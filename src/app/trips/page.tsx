import Link from "next/link";
import { Badge, Card, LinkButton } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { JoinRequest } from "@/lib/models";
import { formatWindow, listUpcomingTrips } from "@/lib/trips";

export default async function TripsPage() {
  const user = await requireUser();
  await connectDB();
  const trips = await listUpcomingTrips(user._id);
  const pending = await JoinRequest.aggregate<{ _id: unknown; n: number }>([
    { $match: { toUser: user._id, status: "pending" } },
    { $group: { _id: "$toTrip", n: { $sum: 1 } } },
  ]);
  const pendingByTrip = new Map(pending.map((p) => [String(p._id), p.n]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My trips</h1>
        <LinkButton href="/trips/new">Post a trip</LinkButton>
      </div>
      {trips.length === 0 ? (
        <Card className="space-y-2 text-center">
          <p className="font-medium">No upcoming trips yet.</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Post where you&apos;re going and when, and we&apos;ll find students heading the same way.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {trips.map((t) => {
            const n = pendingByTrip.get(String(t._id)) ?? 0;
            return (
              <li key={String(t._id)}>
                <Link href={t.ride ? `/rides/${t.ride}` : `/trips/${t._id}`} className="block">
                  <Card className="transition hover:border-blue-400">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">
                        {t.origin.name} → {t.destination.name}
                      </p>
                      {t.status === "matched" ? <Badge tone="green">Matched</Badge> : <Badge tone="blue">Looking</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{formatWindow(t.windowStart, t.windowEnd)}</p>
                    {n > 0 && <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-300">{n} request{n > 1 ? "s" : ""} waiting for you</p>}
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
