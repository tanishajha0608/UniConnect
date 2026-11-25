import "server-only";
import type { Types } from "mongoose";
import { connectDB } from "./db";
import { rankMatches, MATCH_CONFIG, type MatchableTrip, type MatchResult } from "./matching";
import { Trip, User, type TripDoc } from "./models";

export function toMatchable(t: TripDoc): MatchableTrip {
  return {
    id: String(t._id),
    userId: String(t.user),
    origin: { name: t.origin.name, lng: t.origin.location!.coordinates[0], lat: t.origin.location!.coordinates[1] },
    destination: {
      name: t.destination.name,
      lng: t.destination.location!.coordinates[0],
      lat: t.destination.location!.coordinates[1],
    },
    windowStart: new Date(t.windowStart),
    windowEnd: new Date(t.windowEnd),
    riders: t.riders ?? 1,
  };
}

/**
 * Candidate filter in the database (open or matched trips, nearby destination,
 * overlapping time), then scoring in code. Users either side has blocked are excluded.
 */
export async function findMatches(trip: TripDoc, viewerBlocked: Types.ObjectId[] = []): Promise<MatchResult[]> {
  await connectDB();
  const pad = MATCH_CONFIG.maxTimeGapMin * 60_000;
  const blockedMe = await User.find({ blocked: trip.user }, { _id: 1 }).lean();
  const excluded = [trip.user, ...viewerBlocked, ...blockedMe.map((u) => u._id)];

  const candidates = (await Trip.find({
    _id: { $ne: trip._id },
    user: { $nin: excluded },
    status: { $in: ["open", "matched"] },
    windowStart: { $lte: new Date(new Date(trip.windowEnd).getTime() + pad) },
    windowEnd: { $gte: new Date(Math.max(Date.now(), new Date(trip.windowStart).getTime() - pad)) },
    "destination.location": {
      $nearSphere: {
        $geometry: { type: "Point", coordinates: trip.destination.location!.coordinates },
        $maxDistance: MATCH_CONFIG.maxDestKm * 1000,
      },
    },
  })
    .limit(200)
    .lean()) as TripDoc[];

  // Avoid suggesting a second trip from someone you're already riding with.
  const mine = toMatchable(trip);
  return rankMatches(
    mine,
    candidates.filter((c) => !(trip.ride && c.ride && String(c.ride) === String(trip.ride))).map(toMatchable),
  );
}

export function formatWindow(start: Date, end: Date): string {
  const tz = "America/Los_Angeles";
  const day = start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: tz });
  const t = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });
  return `${day}, ${t(start)} to ${t(end)}`;
}

/** A user's trips that ended less than a day ago or are still upcoming, soonest first. */
export async function listUpcomingTrips(userId: Types.ObjectId): Promise<TripDoc[]> {
  await connectDB();
  return (await Trip.find({ user: userId, status: { $ne: "cancelled" }, windowEnd: { $gt: new Date(Date.now() - 86400_000) } })
    .sort({ windowStart: 1 })
    .lean()) as TripDoc[];
}
