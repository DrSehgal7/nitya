import { describe, expect, it } from "vitest";
import { goals, habits, initiatives, ledger, project, runningSnapshot } from "../src/data/content";

describe("owner-managed public content", () => {
  it("keeps item identifiers unique", () => {
    const ids = [...habits.map(({ id }) => id), ...goals.map(({ id }) => id)];
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(initiatives.map(({ title }) => title)).size).toBe(initiatives.length);
  });

  it("keeps every public progress value within its visual range", () => {
    for (const item of [...habits, ...goals]) {
      expect(item.progress).toBeGreaterThanOrEqual(0);
      expect(item.progress).toBeLessThanOrEqual(100);
    }
  });

  it("starts Project Nitya on 12 August 2026 with a private baseline", () => {
    expect(project.startedOn).toBe("2026-08-12");
    expect(project.baselinePledge).toBeNull();
  });

  it("dates every owner-managed habit and goal update", () => {
    for (const item of [...habits, ...goals]) {
      expect(item.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(`${item.lastUpdated}T00:00:00+05:30`))).toBe(false);
    }
  });

  it("builds the public ledger only from savings and people", () => {
    for (const item of ledger) {
      expect(item.savedRupees).toBeGreaterThanOrEqual(0);
      expect(item.peopleImpacted).toBeGreaterThanOrEqual(0);
      expect(Object.keys(item).sort()).toEqual(["month", "peopleImpacted", "savedRupees"]);
    }
  });

  it("keeps the manual running snapshot publishable", () => {
    expect(runningSnapshot.distanceKm).toBeGreaterThanOrEqual(0);
    expect(runningSnapshot.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(`${runningSnapshot.asOf}T00:00:00+05:30`))).toBe(false);
  });
});
