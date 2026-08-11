export interface StravaActivity {
  name: string;
  date: string;
  distanceKm: number;
  movingTimeSeconds: number;
  elevationGainM: number;
  activityType: string;
  url: string;
}

export interface StravaSnapshot {
  connected: boolean;
  profileUrl: string;
  syncedAt: string | null;
  statusMessage: string;
  stats: {
    runCount: number;
    distanceKm: number;
    movingTimeSeconds: number;
    elevationGainM: number;
  };
  activities: StravaActivity[];
}
