import { distanceKm, type LatLng } from "./geo";

/**
 * Ride matching: a cheap candidate filter, then a 0-100 score from weighted
 * soft factors. Weights and cutoffs live here so they can be tuned and A/B
 * tested without touching the rest of the app.
 */
export const MATCH_CONFIG = {
  maxTimeGapMin: 180, // windows further apart than this never match
  maxDestKm: 25,
  maxOriginKm: 25,
  minScore: 50,
  weights: { time: 35, destination: 25, origin: 15, detour: 15, groupFit: 10 },
  standardCarSeats: 4,
  xlCarSeats: 6,
};

export type MatchableTrip = {
  id: string;
  userId: string;
  origin: LatLng & { name: string };
  destination: LatLng & { name: string };
  windowStart: Date;
  windowEnd: Date;
  riders: number; // people travelling on this trip, including the poster
};

export type MatchResult = {
  trip: MatchableTrip;
  score: number;
  reasons: string[];
  needsXL: boolean;
};

const minutes = (ms: number) => ms / 60000;

/** Minutes between two windows; 0 when they overlap. */
export function timeGapMinutes(a: MatchableTrip, b: MatchableTrip): number {
  const gap = Math.max(a.windowStart.getTime(), b.windowStart.getTime()) - Math.min(a.windowEnd.getTime(), b.windowEnd.getTime());
  return Math.max(0, minutes(gap));
}

function linear(value: number, full: number, zero: number) {
  if (value <= full) return 1;
  if (value >= zero) return 0;
  return 1 - (value - full) / (zero - full);
}

export function scoreMatch(mine: MatchableTrip, other: MatchableTrip, cfg = MATCH_CONFIG): MatchResult | null {
  if (mine.id === other.id || mine.userId === other.userId) return null;

  const gap = timeGapMinutes(mine, other);
  const destKm = distanceKm(mine.destination, other.destination);
  const originKm = distanceKm(mine.origin, other.origin);
  const riders = mine.riders + other.riders;

  // Hard filters
  if (gap > cfg.maxTimeGapMin) return null;
  if (destKm > cfg.maxDestKm || originKm > cfg.maxOriginKm) return null;
  if (riders > cfg.xlCarSeats) return null;

  const w = cfg.weights;
  const time = w.time * linear(gap, 0, cfg.maxTimeGapMin);
  const destination = w.destination * linear(destKm, 2, cfg.maxDestKm);
  const origin = w.origin * linear(originKm, 1, 15);
  // Straight-line proxy for the extra distance a shared route adds.
  const detourKm = destKm + originKm;
  const detour = w.detour * linear(detourKm, 1, 20);
  const needsXL = riders > cfg.standardCarSeats;
  const groupFit = needsXL ? w.groupFit / 2 : w.groupFit;

  const score = Math.round(time + destination + origin + detour + groupFit);
  if (score < cfg.minScore) return null;

  const reasons: string[] = [];
  if (gap === 0) reasons.push("Your time windows overlap");
  else reasons.push(`Leaves within ${Math.round(gap)} min of your window`);
  if (destKm < 2) reasons.push(`Same destination: ${other.destination.name}`);
  else reasons.push(`Destination ${destKm.toFixed(1)} km from yours`);
  if (originKm < 1) reasons.push(`Same pickup: ${other.origin.name}`);
  else reasons.push(`Pickup ${originKm.toFixed(1)} km from yours`);
  if (needsXL) reasons.push(`${riders} riders together, needs an XL`);

  return { trip: other, score, reasons, needsXL };
}

export function rankMatches(mine: MatchableTrip, candidates: MatchableTrip[], cfg = MATCH_CONFIG): MatchResult[] {
  return candidates
    .map((c) => scoreMatch(mine, c, cfg))
    .filter((m): m is MatchResult => m !== null)
    .sort((a, b) => b.score - a.score);
}
