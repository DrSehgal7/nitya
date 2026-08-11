import type { StravaActivity, StravaSnapshot } from "../types/strava";

export interface StravaApiActivity {
  id?: number;
  name?: string;
  start_date_local?: string;
  distance?: number;
  moving_time?: number;
  total_elevation_gain?: number;
  type?: string;
  sport_type?: string;
  visibility?: string;
}

const runningTypes = new Set(["Run", "TrailRun", "VirtualRun"]);

export function isPublicRun(activity: StravaApiActivity): boolean {
  const activityType = activity.sport_type ?? activity.type ?? "";
  return activity.visibility?.toLowerCase() === "everyone" && runningTypes.has(activityType);
}

export function normaliseActivity(activity: StravaApiActivity): StravaActivity | null {
  if (!isPublicRun(activity) || !activity.id || !activity.name || !activity.start_date_local) {
    return null;
  }

  return {
    name: activity.name.trim().slice(0, 120),
    date: activity.start_date_local,
    distanceKm: Number(((activity.distance ?? 0) / 1000).toFixed(2)),
    movingTimeSeconds: Math.max(0, Math.round(activity.moving_time ?? 0)),
    elevationGainM: Math.max(0, Number((activity.total_elevation_gain ?? 0).toFixed(1))),
    activityType: activity.sport_type ?? activity.type ?? "Run",
    url: `https://www.strava.com/activities/${activity.id}`,
  };
}

export function createSnapshot(
  activities: StravaApiActivity[],
  profileUrl: string,
  syncedAt = new Date().toISOString(),
): StravaSnapshot {
  const publicRuns = activities
    .map(normaliseActivity)
    .filter((activity): activity is StravaActivity => activity !== null)
    .sort((left, right) => Date.parse(right.date) - Date.parse(left.date));

  return {
    connected: true,
    profileUrl,
    syncedAt,
    statusMessage: publicRuns.length
      ? "Showing public runs from Strava."
      : "Connected to Strava; no public runs were returned.",
    stats: {
      runCount: publicRuns.length,
      distanceKm: Number(
        publicRuns.reduce((total, activity) => total + activity.distanceKm, 0).toFixed(2),
      ),
      movingTimeSeconds: publicRuns.reduce(
        (total, activity) => total + activity.movingTimeSeconds,
        0,
      ),
      elevationGainM: Number(
        publicRuns.reduce((total, activity) => total + activity.elevationGainM, 0).toFixed(1),
      ),
    },
    activities: publicRuns.slice(0, 20),
  };
}
