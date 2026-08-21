import { describe, expect, it } from "vitest";
import { goals, habits, ledger, runningSnapshot } from "../src/data/content";
import { races } from "../src/data/races";
import { parseSiteContent } from "../src/lib/content-validation";
import type { SiteContent } from "../src/types/content";

const validContent = (): SiteContent =>
  structuredClone<SiteContent>({
    version: 3,
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
    const legacy: unknown = { ...validContent(), version: 1, races: races.slice(1) };
    const parsed = parseSiteContent(legacy);
    expect(parsed?.version).toBe(3);
    expect(parsed?.races.filter((race) => race.slug === "hyrox-delhi-open-solo-2026")).toHaveLength(
      1,
    );
  });

  it("adds editable milestones when a version 2 owner snapshot is loaded", () => {
    const legacy = structuredClone(validContent()) as unknown as {
      version: number;
      goals: Array<Record<string, unknown>>;
    };
    legacy.version = 2;
    for (const goal of legacy.goals) delete goal.subgoals;

    const parsed = parseSiteContent(legacy);
    expect(parsed?.version).toBe(3);
    expect(parsed?.goals.every((goal) => goal.subgoals.length > 0)).toBe(true);
  });

  it("derives goal status and progress from any number of milestones", () => {
    const content = validContent();
    content.goals[1]!.subgoals = [
      { id: "lift-120", title: "Deadlift 120 kg", completed: true },
      { id: "lift-130", title: "Deadlift 130 kg", completed: true },
      { id: "lift-140", title: "Deadlift 140 kg", completed: true },
      { id: "lift-150", title: "Deadlift 150 kg", completed: true },
    ];
    content.goals[1]!.status = "in-progress";
    content.goals[1]!.progress = 12;

    const parsed = parseSiteContent(content);
    expect(parsed?.goals[1]?.status).toBe("done");
    expect(parsed?.goals[1]?.progress).toBe(100);
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
