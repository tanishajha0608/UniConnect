import { describe, expect, it } from "vitest";
import { estimateSoloFareCents, sharesByRiders, splitEqual, venmoPayLink } from "../split";

describe("splitEqual", () => {
  it("splits evenly and keeps every cent", () => {
    expect(splitEqual(6420, 4)).toEqual([1605, 1605, 1605, 1605]);
    const s = splitEqual(1000, 3);
    expect(s).toEqual([334, 333, 333]);
    expect(s.reduce((a, b) => a + b)).toBe(1000);
  });
  it("rejects bad input", () => {
    expect(() => splitEqual(10.5, 2)).toThrow();
    expect(() => splitEqual(100, 0)).toThrow();
  });
});

describe("sharesByRiders", () => {
  it("charges a member per person they bring", () => {
    expect(sharesByRiders(6000, [1, 2, 1])).toEqual([1500, 3000, 1500]);
  });
});

describe("venmoPayLink", () => {
  it("builds a prefilled pay link", () => {
    const url = new URL(venmoPayLink("@tj-ucr", 1605, "ride to ONT"));
    expect(url.searchParams.get("recipients")).toBe("tj-ucr");
    expect(url.searchParams.get("amount")).toBe("16.05");
    expect(url.searchParams.get("txn")).toBe("pay");
  });
});

describe("estimateSoloFareCents", () => {
  it("grows with distance", () => {
    expect(estimateSoloFareCents(30)).toBeGreaterThan(estimateSoloFareCents(10));
  });
});
