import { describe, expect, it } from "vitest";
import { races, validateRaceCalendar } from "../src/data/races";

describe("race calendar", () => {
  it("contains the four confirmed races in date order", () => {
    expect(validateRaceCalendar(races)).toEqual([]);
    expect(races).toHaveLength(4);
    expect(races.map((race) => race.distanceKm)).toEqual([42.195, 21.097, 25, 42.195]);
  });

  it("rejects duplicate race slugs", () => {
    expect(validateRaceCalendar([races[0]!, races[0]!])).toContain(
      "Race 2 has a duplicate slug: ladakh-marathon-2026",
    );
  });
});
