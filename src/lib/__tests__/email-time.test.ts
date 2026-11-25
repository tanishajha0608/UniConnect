import { describe, expect, it } from "vitest";
import { isAllowedEmail, publicName } from "../email-rules";
import { pacificToDate } from "../time";

describe("isAllowedEmail", () => {
  it.each(["tjha001@ucr.edu", "  First.Last@UCR.EDU "])("accepts %s", (e) => expect(isAllowedEmail(e)).toBe(true));
  it.each(["x@gmail.com", "x@cs.ucr.edu", "x@ucr.edu.evil.com", "x@notucr.edu", "ucr.edu", "a b@ucr.edu"])("rejects %s", (e) =>
    expect(isAllowedEmail(e)).toBe(false),
  );
});

describe("publicName", () => {
  it("shows first name and last initial", () => {
    expect(publicName("Tanisha Jha")).toBe("Tanisha J.");
    expect(publicName("Cher")).toBe("Cher");
    expect(publicName("")).toBe("UCR student");
  });
});

describe("pacificToDate", () => {
  it("handles standard time (UTC-8)", () => {
    expect(pacificToDate("2026-12-18", "09:00").toISOString()).toBe("2026-12-18T17:00:00.000Z");
  });
  it("handles daylight time (UTC-7)", () => {
    expect(pacificToDate("2026-07-01", "09:00").toISOString()).toBe("2026-07-01T16:00:00.000Z");
  });
});
