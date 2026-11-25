import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card, LinkButton } from "@/components/ui";

export default async function Home() {
  const user = await getCurrentUser().catch(() => null);
  if (user) redirect("/trips");
  return (
    <div className="space-y-8">
      <section className="space-y-4 pt-6">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Going to ONT, LAX or home for the weekend? Split the ride.</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          UniConnect matches UCR students heading to the same place at the same time, so a $60 Uber becomes $15 each.
        </p>
        <LinkButton href="/login" className="px-6 py-3 text-base">Sign in with your @ucr.edu email</LinkButton>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Post your trip", "Pick where you're leaving from, where you're going and a time window."],
          ["Get matched", "We rank students going your way by time, destination and pickup."],
          ["Split and pay back", "One person books, everyone sees their share and pays back by Venmo."],
        ].map(([title, body]) => (
          <Card key={title}>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{body}</p>
          </Card>
        ))}
      </section>
      <p className="text-sm text-slate-500">Only verified @ucr.edu students can see or join rides.</p>
    </div>
  );
}
