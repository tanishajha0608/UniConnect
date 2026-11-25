import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { becomeBooker, blockUser, leaveRide, markPaid, setFare } from "@/app/actions";
import { Chat } from "@/components/chat";
import { ActionForm, SubmitButton } from "@/components/forms";
import { ReportForm } from "@/components/report-form";
import { Badge, Card, Field, inputClass } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { distanceKm } from "@/lib/geo";
import { Ride, Trip, User, type RideDoc, type TripDoc } from "@/lib/models";
import { estimateSoloFareCents, formatUSD, sharesByRiders, venmoPayLink } from "@/lib/split";
import { formatWindow, toMatchable } from "@/lib/trips";

export default async function RidePage({ params }: PageProps<"/rides/[id]">) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  const user = await requireUser();
  await connectDB();
  const ride = (await Ride.findOne({ _id: id, "members.user": user._id }).lean()) as RideDoc | null;
  if (!ride || ride.status === "cancelled") notFound();

  const [users, trips] = await Promise.all([
    User.find({ _id: { $in: ride.members.map((m) => m.user) } }, { name: 1, venmo: 1 }).lean(),
    Trip.find({ _id: { $in: ride.members.map((m) => m.trip) } }).lean() as Promise<TripDoc[]>,
  ]);
  const userOf = (uid: unknown) => users.find((u) => String(u._id) === String(uid));
  const tripOf = (tid: unknown) => trips.find((t) => String(t._id) === String(tid));
  const meId = String(user._id);
  const isBooker = String(ride.booker) === meId;
  const booker = ride.booker ? userOf(ride.booker) : undefined;
  const shares = ride.fareCents ? sharesByRiders(ride.fareCents, ride.members.map((m) => m.riders ?? 1)) : [];
  const myTrip = tripOf(ride.members.find((m) => String(m.user) === meId)?.trip);
  const firstTrip = trips.sort((a, b) => +a.windowStart - +b.windowStart)[0];
  const totalRiders = ride.members.reduce((s, m) => s + (m.riders ?? 1), 0);
  const soloCents = myTrip ? estimateSoloFareCents(distanceKm(toMatchable(myTrip).origin, toMatchable(myTrip).destination)) : 0;

  const shareText = encodeURIComponent(
    `I'm sharing a ride via UniConnect: ${firstTrip?.origin.name} to ${firstTrip?.destination.name}, ${firstTrip ? formatWindow(firstTrip.windowStart, firstTrip.windowEnd) : ""}, with ${ride.members
      .filter((m) => String(m.user) !== meId)
      .map((m) => userOf(m.user)?.name ?? "a UCR student")
      .join(", ")}.`,
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-semibold">Ride to {firstTrip?.destination.name}</h1>
          <Badge tone={ride.status === "completed" ? "green" : ride.status === "booked" ? "blue" : "amber"}>
            {ride.status === "planning" ? "Planning" : ride.status === "booked" ? "Booked" : "Paid up"}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {totalRiders} riders{totalRiders > 4 && " · book an XL"} · first window {firstTrip && formatWindow(firstTrip.windowStart, firstTrip.windowEnd)}
        </p>
        {!ride.fareCents && soloCents > 0 && (
          <p className="text-sm">
            Estimated: about {formatUSD(soloCents)} solo, roughly {formatUSD(Math.round(soloCents / totalRiders))} per person split {totalRiders} ways.
          </p>
        )}
        <a href={`sms:?&body=${shareText}`} className="inline-block text-sm text-blue-700 underline dark:text-blue-400">Text a friend your ride details</a>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Who&apos;s riding</h2>
        {ride.members.map((m, i) => {
          const u = userOf(m.user);
          const t = tripOf(m.trip);
          const mine = String(m.user) === meId;
          return (
            <Card key={String(m.trip)} className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="font-medium">
                  {u?.name ?? "UCR student"} {mine && <span className="text-slate-500">(you)</span>}{" "}
                  {String(ride.booker) === String(m.user) && <Badge tone="blue">Booking</Badge>}
                </p>
                {t && <p className="text-sm text-slate-600 dark:text-slate-300">From {t.origin.name} · {formatWindow(t.windowStart, t.windowEnd)}{(m.riders ?? 1) > 1 && ` · ${m.riders} people`}</p>}
                {ride.fareCents && (
                  <p className="text-sm">
                    Share: <strong>{formatUSD(shares[i])}</strong> {m.paid ? <Badge tone="green">Paid</Badge> : <Badge tone="amber">Owes</Badge>}
                  </p>
                )}
              </div>
              {!mine && (
                <div className="flex flex-col items-end gap-1">
                  {isBooker && ride.fareCents && (
                    <form action={markPaid}>
                      <input type="hidden" name="rideId" value={id} />
                      <input type="hidden" name="userId" value={String(m.user)} />
                      <input type="hidden" name="paid" value={m.paid ? "false" : "true"} />
                      <button className="text-xs text-blue-700 underline dark:text-blue-400">{m.paid ? "Mark unpaid" : "Mark paid"}</button>
                    </form>
                  )}
                  <form action={blockUser}>
                    <input type="hidden" name="userId" value={String(m.user)} />
                    <button className="text-xs text-slate-500 underline">Block</button>
                  </form>
                  <ReportForm userId={String(m.user)} rideId={id} name={u?.name ?? "this rider"} />
                </div>
              )}
            </Card>
          );
        })}
      </section>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Fare split</h2>
        {!ride.booker ? (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-300">One person books the Uber or Lyft and everyone else pays them back.</p>
            <form action={becomeBooker}>
              <input type="hidden" name="rideId" value={id} />
              <SubmitButton>I&apos;ll book the ride</SubmitButton>
            </form>
          </>
        ) : isBooker ? (
          <ActionForm action={setFare} className="space-y-3">
            <input type="hidden" name="rideId" value={id} />
            <Field label="Total fare you paid ($)" hint="Enter it after the ride. Everyone's share updates right away.">
              <input name="fare" inputMode="decimal" required defaultValue={ride.fareCents ? (ride.fareCents / 100).toFixed(2) : ""} placeholder="64.20" className={inputClass} />
            </Field>
            {!user.venmo && <p className="text-xs text-amber-700 dark:text-amber-300">Add your Venmo handle in your profile so riders get a one-tap pay link.</p>}
            <SubmitButton>Save fare</SubmitButton>
          </ActionForm>
        ) : ride.fareCents ? (
          (() => {
            const i = ride.members.findIndex((m) => String(m.user) === meId);
            const mine = ride.members[i];
            return (
              <div className="space-y-2 text-sm">
                <p>
                  {booker?.name ?? "The booker"} paid {formatUSD(ride.fareCents)}. Your share is <strong>{formatUSD(shares[i])}</strong>.
                </p>
                {!mine.paid && (
                  <div className="flex flex-wrap gap-2">
                    {booker?.venmo && (
                      <a href={venmoPayLink(booker.venmo, shares[i], `UniConnect ride to ${firstTrip?.destination.name}`)} target="_blank" rel="noreferrer" className="rounded-lg bg-[#008CFF] px-4 py-2 font-medium text-white">
                        Pay @{booker.venmo} on Venmo
                      </a>
                    )}
                    <form action={markPaid}>
                      <input type="hidden" name="rideId" value={id} />
                      <input type="hidden" name="userId" value={meId} />
                      <SubmitButton variant="secondary">I&apos;ve paid</SubmitButton>
                    </form>
                  </div>
                )}
                {!booker?.venmo && !mine.paid && <p className="text-slate-500">Pay by Zelle or cash, then tap &quot;I&apos;ve paid&quot;.</p>}
              </div>
            );
          })()
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">{booker?.name ?? "Someone"} is booking. Your share appears here once they enter the fare.</p>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Chat rideId={id} />
      </Card>

      <form action={leaveRide}>
        <input type="hidden" name="rideId" value={id} />
        <SubmitButton variant="danger">Leave this ride</SubmitButton>
      </form>
    </div>
  );
}
