import { notFound } from "next/navigation";
import { cancelTrip, respondToRequest, sendJoinRequest } from "@/app/actions";
import { SubmitButton } from "@/components/forms";
import { Badge, Card, LinkButton } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { publicName } from "@/lib/email-rules";
import { distanceKm } from "@/lib/geo";
import { JoinRequest, Trip, User, type TripDoc } from "@/lib/models";
import { estimateSoloFareCents, formatUSD } from "@/lib/split";
import { findMatches, formatWindow, toMatchable } from "@/lib/trips";
import { isValidObjectId } from "mongoose";

export default async function TripPage({ params }: PageProps<"/trips/[id]">) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  const user = await requireUser();
  await connectDB();
  const trip = (await Trip.findOne({ _id: id, user: user._id }).lean()) as TripDoc | null;
  if (!trip || trip.status === "cancelled") notFound();

  const [matches, incoming, outgoing] = await Promise.all([
    findMatches(trip, user.blocked ?? []),
    JoinRequest.find({ toTrip: trip._id, status: "pending" }).lean(),
    JoinRequest.find({ fromTrip: trip._id }).lean(),
  ]);
  const people = await User.find(
    { _id: { $in: [...matches.map((m) => m.trip.userId), ...incoming.map((r) => r.fromUser)] } },
    { name: 1 },
  ).lean();
  const nameOf = (uid: unknown) => publicName(people.find((p) => String(p._id) === String(uid))?.name);
  const incomingTrips = (await Trip.find({ _id: { $in: incoming.map((r) => r.fromTrip) } }).lean()) as TripDoc[];
  const requestedTo = new Map(outgoing.map((r) => [String(r.toTrip), r.status]));

  const me = toMatchable(trip);
  const solo = estimateSoloFareCents(distanceKm(me.origin, me.destination));

  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-semibold">{trip.origin.name} → {trip.destination.name}</h1>
          {trip.status === "matched" ? <Badge tone="green">Matched</Badge> : <Badge tone="blue">Looking</Badge>}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {formatWindow(trip.windowStart, trip.windowEnd)} · {trip.riders === 1 ? "just you" : `${trip.riders} people`}
          {trip.luggage !== "none" && ` · ${trip.luggage} luggage`}
        </p>
        <p className="text-sm">
          Solo, this is roughly <strong>{formatUSD(solo)}</strong>. Split with one more group it&apos;s about{" "}
          <strong>{formatUSD(Math.round(solo / 2))}</strong> each, or <strong>{formatUSD(Math.round(solo / 4))}</strong> with four.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {trip.ride && <LinkButton href={`/rides/${trip.ride}`}>Open ride chat</LinkButton>}
          <form action={cancelTrip}>
            <input type="hidden" name="tripId" value={id} />
            <SubmitButton variant="danger">Cancel trip</SubmitButton>
          </form>
        </div>
      </Card>

      {incoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Requests to ride with you</h2>
          {incoming.map((r) => {
            const t = incomingTrips.find((x) => String(x._id) === String(r.fromTrip));
            return (
              <Card key={String(r._id)} className="space-y-2">
                <p className="font-medium">{nameOf(r.fromUser)} <Badge tone="amber">match {r.score}/100</Badge></p>
                {t && <p className="text-sm text-slate-600 dark:text-slate-300">From {t.origin.name} · {formatWindow(t.windowStart, t.windowEnd)} · {t.riders === 1 ? "1 person" : `${t.riders} people`}</p>}
                <form action={respondToRequest} className="flex gap-2">
                  <input type="hidden" name="requestId" value={String(r._id)} />
                  <button name="decision" value="accept" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Accept</button>
                  <button name="decision" value="decline" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800">Decline</button>
                </form>
              </Card>
            );
          })}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Students going your way</h2>
        {matches.length === 0 ? (
          <Card className="space-y-1 text-sm">
            <p className="font-medium">No matches yet.</p>
            <p className="text-slate-600 dark:text-slate-300">
              We&apos;ll email you when someone requests to join. Widening your time window by an hour usually finds more riders.
            </p>
          </Card>
        ) : (
          matches.map((m) => {
            const status = requestedTo.get(m.trip.id);
            return (
              <Card key={m.trip.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{nameOf(m.trip.userId)}</p>
                  <Badge tone={m.score >= 75 ? "green" : "blue"}>match {m.score}/100</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {m.trip.origin.name} → {m.trip.destination.name} · {formatWindow(m.trip.windowStart, m.trip.windowEnd)}
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {m.reasons.map((r) => <li key={r}>{r}</li>)}
                </ul>
                {status === "pending" ? (
                  <Badge tone="amber">Request sent</Badge>
                ) : status === "declined" ? (
                  <Badge>Declined</Badge>
                ) : status === "accepted" ? (
                  <Badge tone="green">Riding together</Badge>
                ) : (
                  <form action={sendJoinRequest}>
                    <input type="hidden" name="fromTrip" value={id} />
                    <input type="hidden" name="toTrip" value={m.trip.id} />
                    <SubmitButton>Request to split</SubmitButton>
                  </form>
                )}
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}

