/** Split a fare in cents as evenly as possible; the first riders absorb leftover cents. */
export function splitEqual(totalCents: number, people: number): number[] {
  if (!Number.isInteger(totalCents) || totalCents < 0) throw new Error("Fare must be a whole number of cents");
  if (!Number.isInteger(people) || people < 1) throw new Error("Need at least one rider");
  const base = Math.floor(totalCents / people);
  const extra = totalCents - base * people;
  return Array.from({ length: people }, (_, i) => base + (i < extra ? 1 : 0));
}

export function formatUSD(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/**
 * Rough solo rideshare fare from straight-line distance. Only used to show
 * estimated savings; real fares vary with traffic and surge pricing.
 */
export function estimateSoloFareCents(km: number): number {
  const roadKm = km * 1.3;
  return Math.round((3 + 1.1 * roadKm) * 100);
}

/** Venmo link that opens a payment to the booker, prefilled with amount and note. */
export function venmoPayLink(handle: string, cents: number, note: string): string {
  const clean = handle.replace(/^@/, "").trim();
  const params = new URLSearchParams({ txn: "pay", recipients: clean, amount: (cents / 100).toFixed(2), note });
  return `https://venmo.com/?${params.toString()}`;
}

/** Shares in member order, weighted by how many riders each member brings. */
export function sharesByRiders(fareCents: number, riders: number[]): number[] {
  const perHead = splitEqual(fareCents, riders.reduce((a, b) => a + b, 0));
  let i = 0;
  return riders.map((n) => perHead.slice(i, (i += n)).reduce((a, b) => a + b, 0));
}
