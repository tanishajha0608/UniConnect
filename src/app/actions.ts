"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createLoginToken, endSession, isAdmin, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isAllowedEmail, normalizeEmail, publicName } from "@/lib/email-rules";
import { appUrl, sendMail } from "@/lib/mailer";
import { scoreMatch, MATCH_CONFIG } from "@/lib/matching";
import { JoinRequest, Message, Report, Ride, Trip, User, type TripDoc, type RideDoc } from "@/lib/models";
import { findPlace } from "@/lib/places";
import { pacificToDate } from "@/lib/time";
import { toMatchable } from "@/lib/trips";

export type FormState = { error?: string; ok?: string; devLink?: string } | undefined;

/* ---------- Sign in ---------- */

export async function requestLoginLink(_: FormState, form: FormData): Promise<FormState> {
  const email = normalizeEmail(String(form.get("email") ?? ""));
  if (!isAllowedEmail(email)) return { error: "Use your @ucr.edu email address." };
  const token = await createLoginToken(email);
  if (!token) return { error: "Too many sign-in links. Try again in an hour." };
  const link = appUrl(`/api/auth/verify?token=${encodeURIComponent(token)}`);
  try {
    await sendMail({
      to: email,
      subject: "Your UniConnect sign-in link",
      text: `Tap to sign in to UniConnect:\n\n${link}\n\nThis link works once and expires in 15 minutes. If you didn't ask for it, ignore this email.`,
    });
  } catch (e) {
    console.error("Sign-in email failed:", e);
    return { error: "We couldn't send the sign-in email right now. Please try again later." };
  }
  const devLink = !process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production" ? link : undefined;
  return { ok: `We sent a sign-in link to ${email}. It expires in 15 minutes.`, devLink };
}

export async function signOut() {
  await endSession();
  redirect("/");
}

/* ---------- Profile ---------- */

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  venmo: z
    .string()
    .trim()
    .max(40)
    .regex(/^@?[A-Za-z0-9_-]*$/, "Venmo handles use letters, numbers, - and _")
    .optional(),
});

export async function saveProfile(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser({ allowIncompleteProfile: true });
  const parsed = profileSchema.safeParse({ name: form.get("name"), venmo: form.get("venmo") || undefined });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await User.updateOne({ _id: user._id }, { name: parsed.data.name, venmo: parsed.data.venmo?.replace(/^@/, "") });
  revalidatePath("/", "layout");
  if (!user.name) redirect("/trips");
  return { ok: "Saved." };
}

/* ---------- Trips ---------- */

const tripSchema = z
  .object({
    origin: z.string(),
    destination: z.string(),
    date: z.string(),
    from: z.string(),
    to: z.string(),
    riders: z.coerce.number().int().min(1).max(4),
    luggage: z.enum(["none", "carry-on", "checked"]),
    note: z.string().trim().max(280).optional(),
  })
  .refine((v) => v.origin !== v.destination, "Pickup and destination must be different");

export async function createTrip(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = tripSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const v = parsed.data;
  const origin = findPlace(v.origin);
  const destination = findPlace(v.destination);
  if (!origin || !destination) return { error: "Pick a pickup and destination from the list." };

  let windowStart: Date, windowEnd: Date;
  try {
    windowStart = pacificToDate(v.date, v.from);
    windowEnd = pacificToDate(v.date, v.to);
  } catch {
    return { error: "Enter a valid date and times." };
  }
  if (windowEnd <= windowStart) return { error: "The latest time must be after the earliest time." };
  if (windowEnd.getTime() - windowStart.getTime() > 6 * 3600_000) return { error: "Keep your window to 6 hours or less." };
  if (windowEnd.getTime() < Date.now()) return { error: "That time has already passed." };

  await connectDB();
  const open = await Trip.countDocuments({ user: user._id, status: { $ne: "cancelled" }, windowEnd: { $gt: new Date() } });
  if (open >= 10) return { error: "You have 10 upcoming trips. Cancel one before posting more." };

  const toPoint = (p: NonNullable<ReturnType<typeof findPlace>>) => ({
    placeId: p.id,
    name: p.name,
    location: { type: "Point", coordinates: [p.lng, p.lat] },
  });
  const trip = await Trip.create({
    user: user._id,
    origin: toPoint(origin),
    destination: toPoint(destination),
    windowStart,
    windowEnd,
    riders: v.riders,
    luggage: v.luggage,
    note: v.note || undefined,
  });
  redirect(`/trips/${trip._id}`);
}

export async function cancelTrip(form: FormData) {
  const user = await requireUser();
  await connectDB();
  const trip = (await Trip.findOne({ _id: form.get("tripId"), user: user._id })) as (TripDoc & { save(): Promise<unknown> }) | null;
  if (!trip) return;
  if (trip.ride) await leaveRideInternal(String(trip.ride), String(user._id));
  await Trip.updateOne({ _id: trip._id }, { status: "cancelled", $unset: { ride: 1 } });
  await JoinRequest.updateMany({ $or: [{ fromTrip: trip._id }, { toTrip: trip._id }], status: "pending" }, { status: "withdrawn" });
  revalidatePath("/trips");
  redirect("/trips");
}

/* ---------- Requests ---------- */

export async function sendJoinRequest(form: FormData) {
  const user = await requireUser();
  await connectDB();
  const fromTrip = (await Trip.findOne({ _id: form.get("fromTrip"), user: user._id, status: { $ne: "cancelled" } }).lean()) as TripDoc | null;
  const toTrip = (await Trip.findOne({ _id: form.get("toTrip"), status: { $ne: "cancelled" } }).lean()) as TripDoc | null;
  if (!fromTrip || !toTrip) throw new Error("Trip not found");
  const other = await User.findById(toTrip.user).lean();
  if (!other || other.suspended || other.blocked?.some((b: unknown) => String(b) === String(user._id))) throw new Error("Can't request this ride");
  if (user.blocked?.some((b) => String(b) === String(toTrip.user))) throw new Error("You blocked this person");

  // Re-check the match on the server so requests can't be forged for far-off trips.
  const match = scoreMatch(toMatchable(fromTrip), toMatchable(toTrip));
  if (!match) throw new Error("These trips no longer match");

  await JoinRequest.updateOne(
    { fromTrip: fromTrip._id, toTrip: toTrip._id },
    { $set: { fromUser: user._id, toUser: toTrip.user, score: match.score, status: "pending" } },
    { upsert: true },
  );
  await sendMail({
    to: other.email,
    subject: `${publicName(user.name)} wants to split a ride to ${toTrip.destination.name}`,
    text: `${publicName(user.name)} is heading to ${toTrip.destination.name} around the same time as you (match score ${match.score}/100).\n\nReview the request: ${appUrl(`/trips/${toTrip._id}`)}`,
  }).catch((e) => console.error(e));
  revalidatePath(`/trips/${fromTrip._id}`);
}

export async function respondToRequest(form: FormData) {
  const user = await requireUser();
  await connectDB();
  const accept = form.get("decision") === "accept";
  const req = await JoinRequest.findOne({ _id: form.get("requestId"), toUser: user._id, status: "pending" });
  if (!req) return;

  if (!accept) {
    req.status = "declined";
    await req.save();
    revalidatePath(`/trips/${req.toTrip}`);
    return;
  }

  const [fromTrip, toTrip] = (await Promise.all([Trip.findById(req.fromTrip).lean(), Trip.findById(req.toTrip).lean()])) as [
    TripDoc | null,
    TripDoc | null,
  ];
  if (!fromTrip || !toTrip || fromTrip.status === "cancelled" || toTrip.status === "cancelled") {
    req.status = "withdrawn";
    await req.save();
    return;
  }

  // Join an existing ride if either side already has one; otherwise start a new ride.
  let ride = (await Ride.findById(toTrip.ride ?? fromTrip.ride)) as (RideDoc & { save(): Promise<unknown> }) | null;
  if (!ride) ride = (await Ride.create({ members: [] })) as RideDoc & { save(): Promise<unknown> };
  for (const t of [toTrip, fromTrip]) {
    if (!ride.members.some((m) => String(m.trip) === String(t._id))) {
      ride.members.push({ user: t.user, trip: t._id, riders: t.riders ?? 1, paid: false });
    }
  }
  const totalRiders = ride.members.reduce((s, m) => s + (m.riders ?? 1), 0);
  if (totalRiders > MATCH_CONFIG.xlCarSeats) throw new Error("This ride is full");
  await ride.save();
  await Trip.updateMany({ _id: { $in: [fromTrip._id, toTrip._id] } }, { status: "matched", ride: ride._id });
  req.status = "accepted";
  await req.save();

  const requester = await User.findById(fromTrip.user).lean();
  if (requester)
    await sendMail({
      to: requester.email,
      subject: `You're matched for ${toTrip.destination.name}`,
      text: `${publicName(user.name)} accepted your request. Plan pickup and the fare split here: ${appUrl(`/rides/${ride._id}`)}`,
    }).catch((e) => console.error(e));
  redirect(`/rides/${ride._id}`);
}

/* ---------- Rides ---------- */

async function loadMemberRide(rideId: string, userId: string) {
  await connectDB();
  const ride = await Ride.findOne({ _id: rideId, "members.user": userId });
  if (!ride) throw new Error("Ride not found");
  return ride as RideDoc & { save(): Promise<unknown> };
}

async function leaveRideInternal(rideId: string, userId: string) {
  const ride = await Ride.findById(rideId);
  if (!ride) return;
  ride.members = ride.members.filter((m: { user: unknown }) => String(m.user) !== userId);
  if (String(ride.booker) === userId) {
    ride.booker = undefined;
    ride.fareCents = undefined;
    ride.status = "planning";
  }
  if (ride.members.length < 2) {
    ride.status = "cancelled";
    await Trip.updateMany({ ride: ride._id }, { status: "open", $unset: { ride: 1 } });
  }
  await ride.save();
}

export async function leaveRide(form: FormData) {
  const user = await requireUser();
  const rideId = String(form.get("rideId"));
  await loadMemberRide(rideId, String(user._id));
  await leaveRideInternal(rideId, String(user._id));
  await Trip.updateMany({ ride: rideId, user: user._id }, { status: "open", $unset: { ride: 1 } });
  redirect("/trips");
}

export async function postMessage(form: FormData) {
  const user = await requireUser();
  const body = String(form.get("body") ?? "").trim().slice(0, 1000);
  if (!body) return;
  const ride = await loadMemberRide(String(form.get("rideId")), String(user._id));
  await Message.create({ ride: ride._id, user: user._id, body });
}

export async function becomeBooker(form: FormData) {
  const user = await requireUser();
  const ride = await loadMemberRide(String(form.get("rideId")), String(user._id));
  if (ride.booker && String(ride.booker) !== String(user._id)) return;
  ride.booker = user._id;
  await ride.save();
  revalidatePath(`/rides/${ride._id}`);
}

export async function setFare(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const ride = await loadMemberRide(String(form.get("rideId")), String(user._id));
  if (String(ride.booker) !== String(user._id)) return { error: "Only the person who booked can enter the fare." };
  const dollars = Number(String(form.get("fare") ?? "").replace(/[$,]/g, ""));
  if (!Number.isFinite(dollars) || dollars <= 0 || dollars > 1000) return { error: "Enter the total fare, for example 64.20" };
  ride.fareCents = Math.round(dollars * 100);
  ride.status = "booked";
  for (const m of ride.members) m.paid = String(m.user) === String(user._id);
  await ride.save();
  revalidatePath(`/rides/${ride._id}`);
  return { ok: "Fare saved. Everyone can see their share now." };
}

export async function markPaid(form: FormData) {
  const user = await requireUser();
  const ride = await loadMemberRide(String(form.get("rideId")), String(user._id));
  const target = String(form.get("userId"));
  // Riders mark themselves paid; the booker can confirm anyone.
  if (target !== String(user._id) && String(ride.booker) !== String(user._id)) return;
  const member = ride.members.find((m) => String(m.user) === target);
  if (member) member.paid = form.get("paid") !== "false";
  if (ride.members.every((m) => m.paid)) ride.status = "completed";
  await ride.save();
  revalidatePath(`/rides/${ride._id}`);
}

/* ---------- Safety ---------- */

export async function reportUser(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const reason = String(form.get("reason") ?? "").trim();
  if (reason.length < 5) return { error: "Tell us briefly what happened." };
  await connectDB();
  const reported = String(form.get("userId"));
  await Report.create({ reporter: user._id, reported, ride: form.get("rideId") || undefined, reason: reason.slice(0, 1000) });
  // Three open reports from different people suspends the account until an admin reviews it.
  const reporters = await Report.distinct("reporter", { reported, status: "open" });
  if (reporters.length >= 3) await User.updateOne({ _id: reported }, { suspended: true });
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  for (const to of admins)
    await sendMail({ to, subject: "New UniConnect report", text: `${reason}\n\nReview: ${appUrl("/admin")}` }).catch(() => {});
  return { ok: "Thanks. We'll review this within 24 hours. You can also block this person." };
}

export async function blockUser(form: FormData) {
  const user = await requireUser();
  await connectDB();
  const target = String(form.get("userId"));
  if (target === String(user._id)) return;
  await User.updateOne({ _id: user._id }, { $addToSet: { blocked: target } });
  revalidatePath("/", "layout");
}

export async function unblockUser(form: FormData) {
  const user = await requireUser();
  await connectDB();
  await User.updateOne({ _id: user._id }, { $pull: { blocked: String(form.get("userId")) } });
  revalidatePath("/profile");
}

/* ---------- Admin ---------- */

async function requireAdmin() {
  const user = await requireUser();
  if (!isAdmin(user)) throw new Error("Not allowed");
  await connectDB();
  return user;
}

export async function resolveReport(form: FormData) {
  await requireAdmin();
  await Report.updateOne({ _id: form.get("reportId") }, { status: "resolved" });
  revalidatePath("/admin");
}

export async function setSuspended(form: FormData) {
  await requireAdmin();
  await User.updateOne({ _id: form.get("userId") }, { suspended: form.get("suspended") === "true" });
  revalidatePath("/admin");
}
