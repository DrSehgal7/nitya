import { describe, expect, it } from "vitest";
import { formatDateTime, formatDistance, formatDuration } from "../src/lib/format";
import { millisecondsUntilNextIndiaMidnight, projectDaysSince } from "../src/lib/project-time";

describe("format helpers", () => {
  it("formats short and long durations", () => {
    expect(formatDuration(59 * 60)).toBe("59m");
    expect(formatDuration(4_260)).toBe("1h 11m");
  });

  it("formats race and activity distances", () => {
    expect(formatDistance(5)).toBe("5.0 km");
    expect(formatDistance(21.097)).toBe("21.1 km");
  });

  it("shows the exact Strava sync time in India", () => {
    expect(formatDateTime("2026-08-10T12:30:00Z")).toContain("6:00 pm");
  });
});

describe("project time helpers", () => {
  it("starts at zero and increments on India midnight", () => {
    expect(projectDaysSince("2026-08-09", Date.parse("2026-08-08T18:29:59Z"))).toBe(0);
    expect(projectDaysSince("2026-08-09", Date.parse("2026-08-08T18:30:00Z"))).toBe(0);
    expect(projectDaysSince("2026-08-09", Date.parse("2026-08-09T18:29:59Z"))).toBe(0);
    expect(projectDaysSince("2026-08-09", Date.parse("2026-08-09T18:30:00Z"))).toBe(1);
  });

  it("schedules the next refresh for India midnight", () => {
    const now = Date.parse("2026-08-09T18:29:00Z");
    expect(millisecondsUntilNextIndiaMidnight(now)).toBe(60_000);
  });
});
