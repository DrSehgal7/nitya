import { Activity, ArrowUpRight, Mountain, RefreshCw, Timer } from "lucide-react";
import stravaRaw from "@/data/strava.generated.json";
import { formatDate, formatDateTime, formatDistance, formatDuration } from "@/lib/format";
import type { StravaSnapshot } from "@/types/strava";
import type { RunningSnapshot } from "@/types/content";
import { SponsorCalculator } from "./SponsorCalculator";

const strava = stravaRaw as StravaSnapshot;

export function SponsorStrava({ runningSnapshot }: { runningSnapshot: RunningSnapshot }) {
  const latestRun = strava.activities[0];
  const runningDistance = strava.connected ? strava.stats.distanceKm : runningSnapshot.distanceKm;
  const runningAsOf =
    strava.connected && strava.syncedAt
      ? formatDate(strava.syncedAt)
      : formatDate(runningSnapshot.asOf);
  const goalPercent = Math.min(100, Math.round((runningDistance / 1000) * 100));

  return (
    <div className="stravaSponsorGrid">
      <article className="liveRunCard">
        <div className="liveRunTop">
          <div>
            <p className="eyebrow">Near-live from Strava</p>
            <h3>{new Date().getFullYear()} running</h3>
          </div>
          <span className={strava.connected ? "syncStatus syncStatusLive" : "syncStatus"}>
            <i /> {strava.connected ? "Synced" : "Manual"}
          </span>
        </div>

        <div className="yearKm">
          <div className="yearKmValue">
            <strong>{formatDistance(runningDistance)}</strong>
            <small>
              As of {runningAsOf} · {strava.connected ? "synced from Strava" : "updated manually"}
            </small>
          </div>
          <span>of the 1,000 km goal</span>
        </div>
        <div className="runProgress" aria-label={`${goalPercent}% of the annual running goal`}>
          <span style={{ width: `${goalPercent}%` }} />
          <b style={{ left: `${Math.max(2, goalPercent)}%` }}>🏃‍➡️</b>
        </div>

        {latestRun ? (
          <div className="latestRun">
            <div>
              <small>Latest public run</small>
              <h4>{latestRun.name}</h4>
              <p>{formatDate(latestRun.date)}</p>
            </div>
            <dl>
              <div>
                <Activity size={16} aria-hidden="true" />
                <dt>Distance</dt>
                <dd>{formatDistance(latestRun.distanceKm)}</dd>
              </div>
              <div>
                <Timer size={16} aria-hidden="true" />
                <dt>Time</dt>
                <dd>{formatDuration(latestRun.movingTimeSeconds)}</dd>
              </div>
              <div>
                <Mountain size={16} aria-hidden="true" />
                <dt>Climb</dt>
                <dd>{Math.round(latestRun.elevationGainM)} m</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="stravaWaiting">
            <RefreshCw size={19} aria-hidden="true" />
            <div>
              <strong>Manual weekend snapshot.</strong>
              <p>The total above is owner-updated and dated until Strava sync is connected.</p>
            </div>
          </div>
        )}

        <div className="stravaFoot">
          <span>
            {strava.syncedAt
              ? `Updated ${formatDateTime(strava.syncedAt)}`
              : `Manual total as of ${runningAsOf}`}
          </span>
          <a href={strava.profileUrl} target="_blank" rel="noreferrer">
            View Strava <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </article>

      <article className="sponsorLiveCard">
        <p className="eyebrow">Optional kilometre sponsorship</p>
        <h3>Estimate what sponsoring a run would look like.</h3>
        <p>
          Enter a distance and an amount per kilometre. This is only a calculator: nothing is
          charged, and continuing simply opens a conversation with Hritik.
        </p>
        <SponsorCalculator initialDistance={latestRun?.distanceKm ?? 0} />
      </article>
    </div>
  );
}
