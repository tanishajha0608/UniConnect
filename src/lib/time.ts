/**
 * Convert a date (YYYY-MM-DD) and time (HH:MM) entered in Riverside local time
 * to a UTC Date, handling daylight saving time without extra libraries.
 */
export function pacificToDate(date: string, time: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) throw new Error("Invalid date or time");
  const asUtc = new Date(`${date}T${time}:00Z`);
  const offsetMin = pacificOffsetMinutes(asUtc);
  const guess = new Date(asUtc.getTime() - offsetMin * 60_000);
  // Re-check the offset at the guessed instant in case we crossed a DST boundary.
  const offset2 = pacificOffsetMinutes(guess);
  return offset2 === offsetMin ? guess : new Date(asUtc.getTime() - offset2 * 60_000);
}

/** Offset of America/Los_Angeles from UTC in minutes at a given instant (e.g. -480 or -420). */
export function pacificOffsetMinutes(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const local = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((local - at.getTime()) / 60_000);
}
