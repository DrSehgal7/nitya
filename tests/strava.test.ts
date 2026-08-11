import { describe, expect, it } from "vitest";
import { createSnapshot, isPublicRun } from "../src/lib/strava";

const publicRun = {
  id: 123,
  name: "Morning Run",
  start_date_local: "2026-08-08T06:15:00Z",
  distance: 10_250,
  moving_time: 3_600,
  total_elevation_gain: 125.4,
  sport_type: "Run",
  visibility: "everyone",
};

describe("Strava privacy filter", () => {
  it("accepts only explicitly public running activities", () => {
    expect(isPublicRun(publicRun)).toBe(true);
    expect(isPublicRun({ ...publicRun, visibility: "followers_only" })).toBe(false);
    expect(isPublicRun({ ...publicRun, visibility: "only_me" })).toBe(false);
    expect(isPublicRun({ ...publicRun, sport_type: "Ride" })).toBe(false);
  });

  it("publishes only the approved fields and aggregates them", () => {
    const snapshot = createSnapshot(
      [publicRun, { ...publicRun, id: 456, visibility: "only_me" }],
      "https://www.strava.com/athletes/127677454",
      "2026-08-08T10:00:00Z",
    );

    expect(snapshot.connected).toBe(true);
    expect(snapshot.stats.runCount).toBe(1);
    expect(snapshot.stats.distanceKm).toBe(10.25);
    expect(snapshot.activities[0]).toEqual({
      name: "Morning Run",
      date: "2026-08-08T06:15:00Z",
      distanceKm: 10.25,
      movingTimeSeconds: 3600,
      elevationGainM: 125.4,
      activityType: "Run",
      url: "https://www.strava.com/activities/123",
    });
  });
});
