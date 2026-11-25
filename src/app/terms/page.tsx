import { Card } from "@/components/ui";

export const metadata = { title: "Terms and safety · UniConnect" };

export default function Terms() {
  return (
    <Card className="space-y-4 text-sm leading-6">
      <h1 className="text-xl font-semibold">Terms and safety</h1>
      <p>UniConnect helps verified UCR students find others making the same trip. We don&apos;t provide, book or pay for rides, and we aren&apos;t affiliated with UC Riverside.</p>
      <h2 className="font-semibold">Staying safe</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Meet at a public pickup spot, such as the Bell Tower or a residence hall entrance.</li>
        <li>Share your ride details with a friend before you leave.</li>
        <li>Check the driver and plate in your Uber or Lyft app before getting in.</li>
        <li>Report anyone who makes you uncomfortable. Reports are reviewed within 24 hours, and you can block someone at any time.</li>
        <li>In an emergency, call 911. UCR Police: (951) 827-5222.</li>
      </ul>
      <h2 className="font-semibold">Paying</h2>
      <p>One rider books and pays the rideshare. Others pay that rider back directly. UniConnect never holds money and can&apos;t resolve payment disputes.</p>
      <h2 className="font-semibold">Your data</h2>
      <p>We store your UCR email, name, optional Venmo handle and your trips. Trips are deleted 90 days after they end. Your exact location is never shared.</p>
    </Card>
  );
}
