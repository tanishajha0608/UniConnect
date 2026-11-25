import { describe, expect, it } from "vitest";
import { rankMatches, scoreMatch, timeGapMinutes, type MatchableTrip } from "../matching";

const bell = { name: "UCR Bell Tower", lat: 33.9737, lng: -117.3281 };
const lothian = { name: "Lothian", lat: 33.9775, lng: -117.322 };
const ont = { name: "ONT", lat: 34.056, lng: -117.6 };
const lax = { name: "LAX", lat: 33.9416, lng: -118.4085 };

const at = (h: number, m = 0) => new Date(Date.UTC(2026, 11, 18, h + 8, m));
const trip = (over: Partial<MatchableTrip>): MatchableTrip => ({
  id: Math.random().toString(36),
  userId: Math.random().toString(36),
  origin: bell,
  destination: ont,
  windowStart: at(9),
  windowEnd: at(11),
  riders: 1,
  ...over,
});

describe("timeGapMinutes", () => {
  it("is 0 for overlapping windows", () => {
    expect(timeGapMinutes(trip({}), trip({ windowStart: at(10), windowEnd: at(12) }))).toBe(0);
  });
  it("measures the gap between separate windows", () => {
    expect(timeGapMinutes(trip({}), trip({ windowStart: at(12), windowEnd: at(13) }))).toBe(60);
  });
});

describe("scoreMatch", () => {
  it("scores a near-identical trip at 100", () => {
    const m = scoreMatch(trip({}), trip({}));
    expect(m?.score).toBe(100);
    expect(m?.reasons[0]).toMatch(/overlap/);
  });

  it("still matches nearby pickups with slightly different times (not too strict)", () => {
    const m = scoreMatch(trip({}), trip({ origin: lothian, windowStart: at(11, 30), windowEnd: at(12) }));
    expect(m).not.toBeNull();
    expect(m!.score).toBeGreaterThanOrEqual(70);
  });

  it("rejects different destinations", () => {
    expect(scoreMatch(trip({}), trip({ destination: lax }))).toBeNull();
  });

  it("rejects windows more than 3 hours apart", () => {
    expect(scoreMatch(trip({}), trip({ windowStart: at(15), windowEnd: at(16) }))).toBeNull();
  });

  it("never matches your own trip", () => {
    const a = trip({});
    expect(scoreMatch(a, { ...a, id: "other" })).toBeNull();
  });

  it("flags groups that need an XL and rejects groups that don't fit", () => {
    expect(scoreMatch(trip({ riders: 3 }), trip({ riders: 2 }))?.needsXL).toBe(true);
    expect(scoreMatch(trip({ riders: 4 }), trip({ riders: 3 }))).toBeNull();
  });
});

describe("rankMatches", () => {
  it("orders best matches first and drops non-matches", () => {
    const best = trip({});
    const ok = trip({ windowStart: at(12, 30), windowEnd: at(13) });
    const none = trip({ destination: lax });
    const ranked = rankMatches(trip({}), [ok, none, best]);
    expect(ranked.map((r) => r.trip)).toEqual([best, ok]);
  });
});
