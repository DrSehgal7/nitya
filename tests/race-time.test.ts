import { describe, expect, it } from "vitest";
import { daysUntilIndiaDate, indiaDateKey, nextDatedItemIndex } from "../src/lib/race-time";

describe("race calendar time", () => {
  it("uses the India calendar date", () => {
    expect(indiaDateKey(Date.parse("2026-08-11T18:29:59Z"))).toBe("2026-08-11");
    expect(indiaDateKey(Date.parse("2026-08-11T18:30:00Z"))).toBe("2026-08-12");
  });

  it("shows an exact calendar-day countdown", () => {
    expect(daysUntilIndiaDate("2026-09-13", Date.parse("2026-08-11T19:00:00Z"))).toBe(32);
  });

  it("keeps a race current for its full race day", () => {
    const items = [{ date: "2026-09-13" }, { date: "2026-10-18" }];
    expect(nextDatedItemIndex(items, Date.parse("2026-09-13T12:00:00Z"))).toBe(0);
    expect(nextDatedItemIndex(items, Date.parse("2026-09-13T18:30:00Z"))).toBe(1);
  });
});
