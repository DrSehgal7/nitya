import { describe, expect, it } from "vitest";
import { goals, habits, ledger, runningSnapshot } from "../src/data/content";
import { races } from "../src/data/races";
import { parseSiteContent } from "../src/lib/content-validation";
import type { SiteContent } from "../src/types/content";

const validContent = (): SiteContent =>
  structuredClone<SiteContent>({
    version: 2,
    updatedAt: "2026-08-12T00:00:00.000Z",
    runningSnapshot: { ...runningSnapshot },
    ledger,
    habits,
    goals,
    races,
  });

describe("owner content validation", () => {
  it("accepts and date-orders the checked-in fallback content", () => {
    const parsed = parseSiteContent(validContent());
    expect(parsed).not.toBeNull();
    expect(parsed?.races.map((race) => race.date)).toEqual(
      [...races].sort((a, b) => a.date.localeCompare(b.date)).map((race) => race.date),
    );
  });

  it("adds the completed HYROX race once when an old Blob snapshot is loaded", () => {
    const legacy = { ...validContent(), version: 1, races: races.slice(1) };
    const parsed = parseSiteContent(legacy);
    expect(parsed?.version).toBe(2);
    expect(parsed?.races.filter((race) => race.slug === "hyrox-delhi-open-solo-2026")).toHaveLength(
      1,
    );
  });

  it("rejects unsafe or nonsensical owner values", () => {
    const invalidDistance = validContent();
    invalidDistance.runningSnapshot.distanceKm = -1;
    expect(parseSiteContent(invalidDistance)).toBeNull();

    const invalidLink = validContent();
    invalidLink.races[0]!.officialUrl = "javascript:alert(1)";
    expect(parseSiteContent(invalidLink)).toBeNull();
  });
});
