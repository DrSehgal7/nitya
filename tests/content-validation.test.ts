import { describe, expect, it } from "vitest";
import { goals, habits, ledger, runningSnapshot } from "../src/data/content";
import { races } from "../src/data/races";
import { parseSiteContent } from "../src/lib/content-validation";
import type { SiteContent } from "../src/types/content";

const validContent = (): SiteContent =>
  structuredClone<SiteContent>({
    version: 1,
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

  it("rejects unsafe or nonsensical owner values", () => {
    const invalidDistance = validContent();
    invalidDistance.runningSnapshot.distanceKm = -1;
    expect(parseSiteContent(invalidDistance)).toBeNull();

    const invalidLink = validContent();
    invalidLink.races[0]!.officialUrl = "javascript:alert(1)";
    expect(parseSiteContent(invalidLink)).toBeNull();
  });
});
