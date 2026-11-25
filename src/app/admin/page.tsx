import { notFound } from "next/navigation";
import { resolveReport, setSuspended } from "@/app/actions";
import { Badge, Card } from "@/components/ui";
import { isAdmin, requireUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Report, Ride, Trip, User } from "@/lib/models";

export default async function AdminPage() {
  const user = await requireUser();
  if (!isAdmin(user)) notFound();
  await connectDB();
  const [reports, stats] = await Promise.all([
    Report.find({ status: "open" }).sort({ createdAt: 1 }).limit(100).lean(),
    Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Ride.countDocuments({ status: { $in: ["booked", "completed"] } }),
      Trip.countDocuments({ status: "matched" }),
    ]),
  ]);
  const people = await User.find({ _id: { $in: reports.flatMap((r) => [r.reporter, r.reported]) } }, { name: 1, email: 1, suspended: 1 }).lean();
  const who = (id: unknown) => people.find((p) => String(p._id) === String(id));
  const [users, trips, rides, matched] = stats;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Verified users", users],
          ["Trips posted", trips],
          ["Trips matched", matched],
          ["Rides booked", rides],
        ].map(([label, n]) => (
          <Card key={String(label)}>
            <p className="text-2xl font-semibold">{n}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </Card>
        ))}
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Open reports ({reports.length})</h2>
        {reports.length === 0 && <p className="text-sm text-slate-500">Nothing to review.</p>}
        {reports.map((r) => {
          const reported = who(r.reported);
          return (
            <Card key={String(r._id)} className="space-y-2 text-sm">
              <p>
                <strong>{reported?.name ?? "?"}</strong> ({reported?.email}) reported by {who(r.reporter)?.email}{" "}
                {reported?.suspended && <Badge tone="amber">Suspended</Badge>}
              </p>
              <p className="whitespace-pre-wrap rounded bg-slate-50 p-2 dark:bg-slate-950">{r.reason}</p>
              <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}</p>
              <div className="flex gap-2">
                <form action={setSuspended}>
                  <input type="hidden" name="userId" value={String(r.reported)} />
                  <input type="hidden" name="suspended" value={reported?.suspended ? "false" : "true"} />
                  <button className="rounded-lg border border-red-300 px-3 py-1 text-red-700">{reported?.suspended ? "Unsuspend" : "Suspend"}</button>
                </form>
                <form action={resolveReport}>
                  <input type="hidden" name="reportId" value={String(r._id)} />
                  <button className="rounded-lg border border-slate-300 px-3 py-1">Resolve</button>
                </form>
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
