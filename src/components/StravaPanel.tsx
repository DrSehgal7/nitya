import { Activity, ArrowUpRight, CalendarDays, Mountain, Timer } from "lucide-react";
import stravaRaw from "@/data/strava.generated.json";
import { formatDate, formatDateTime, formatDistance, formatDuration } from "@/lib/format";
import type { StravaSnapshot } from "@/types/strava";

const strava = stravaRaw as StravaSnapshot;

export function StravaPanel() {
  const latestRun = strava.activities[0];

  return (
    <section className="stravaPanel" aria-labelledby="strava-heading">
      <div className="stravaHeader">
        <div>
          <p className="eyebrow">Latest run</p>
          <h2 id="strava-heading">{latestRun?.name ?? "Strava sync is ready"}</h2>
        </div>
        <a href={strava.profileUrl} target="_blank" rel="noreferrer">
          View profile <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>

      {latestRun ? (
        <>
          <dl className="stravaStats">
            <div>
              <Activity size={18} aria-hidden="true" />
              <dt>Distance</dt>
              <dd>{formatDistance(latestRun.distanceKm)}</dd>
            </div>
            <div>
              <Timer size={18} aria-hidden="true" />
              <dt>Moving time</dt>
              <dd>{formatDuration(latestRun.movingTimeSeconds)}</dd>
            </div>
            <div>
              <Mountain size={18} aria-hidden="true" />
              <dt>Elevation</dt>
              <dd>{Math.round(latestRun.elevationGainM)} m</dd>
            </div>
            <div>
              <CalendarDays size={18} aria-hidden="true" />
              <dt>Date</dt>
              <dd>{formatDate(latestRun.date)}</dd>
            </div>
          </dl>
          <p className="stravaNote">
            Public run only · synced{" "}
            {strava.syncedAt ? formatDateTime(strava.syncedAt) : "recently"}· powered by Strava
          </p>
        </>
      ) : (
        <div className="stravaEmpty">
          <Activity size={28} aria-hidden="true" />
          <p>{strava.statusMessage}</p>
          <small>No maps · no heart rate · no private activities</small>
        </div>
      )}
    </section>
  );
}
