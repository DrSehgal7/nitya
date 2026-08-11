import { describe, expect, it } from "vitest";
import { races, validateRaceCalendar } from "../src/data/races";

describe("race calendar", () => {
  it("contains the completed HYROX race and four upcoming races in date order", () => {
    expect(validateRaceCalendar(races)).toEqual([]);
    expect(races).toHaveLength(5);
    expect(races.map((race) => race.distanceKm)).toEqual([8, 42.195, 21.097, 25, 42.195]);
    expect(races[0]?.registrationStatus).toBe("Completed");
  });

  it("rejects duplicate race slugs", () => {
    expect(validateRaceCalendar([races[0]!, races[0]!])).toContain(
      "Race 2 has a duplicate slug: hyrox-delhi-open-solo-2026",
    );
  });
});
