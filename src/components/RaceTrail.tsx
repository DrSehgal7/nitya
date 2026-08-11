"use client";

import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Race } from "@/data/races";
import { millisecondsUntilNextIndiaMidnight } from "@/lib/project-time";
import { daysUntilIndiaDate, nextDatedItemIndex } from "@/lib/race-time";

const trailHeights = [67, 47, 46, 30] as const;

function racePoint(index: number, total: number) {
  return {
    x: 7 + (index / Math.max(1, total - 1)) * 84,
    y: trailHeights[index % trailHeights.length] ?? 47,
  };
}

function shortDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00+05:30`));
}

export function RaceTrail({ races }: { races: Race[] }) {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refreshAtMidnight = () => {
      setToday(Date.now());
      timer = setTimeout(refreshAtMidnight, millisecondsUntilNextIndiaMidnight() + 100);
    };

    refreshAtMidnight();
    return () => clearTimeout(timer);
  }, []);

  const nextRaceIndex = useMemo(() => {
    if (today === null) return 0;
    return nextDatedItemIndex(races, today);
  }, [today]);
  const nextRace = races[nextRaceIndex] ?? races[0];
  if (!nextRace) {
    return (
      <div className="raceExperience raceExperienceEmpty">
        <p className="eyebrow">Next on the start line</p>
        <h3>My race calendar</h3>
        <p>No races are on the calendar yet. The next owner-added race will appear here.</p>
      </div>
    );
  }
  const daysToGo = today === null ? null : daysUntilIndiaDate(nextRace.date, today);
  const runnerPoint = racePoint(nextRaceIndex, races.length);

  return (
    <div className="raceExperience">
      <div className="raceCalendarLine">
        <div className="raceCalendarHead">
          <div>
            <p className="eyebrow">Next on the start line</p>
            <h3>My race calendar</h3>
          </div>
          <div className="raceCountdown" aria-live="polite">
            <strong>{daysToGo ?? "—"}</strong> days
            <span>to {nextRace.name}</span>
          </div>
        </div>
        <div className="raceRail" aria-label="Race calendar timeline">
          <div className="raceRailLine" aria-hidden="true" />
          {races.map((race, index) => {
            const state =
              index < nextRaceIndex ? "done" : index === nextRaceIndex ? "next" : "future";
            const left = 7 + (index / Math.max(1, races.length - 1)) * 86;
            return (
              <div
                className={`railCheckpoint railCheckpoint-${state}`}
                style={{ left: `${left}%` }}
                key={race.slug}
              >
                <i aria-hidden="true" />
                <strong>{race.shortName}</strong>
                <span>{shortDate(race.date)}</span>
                <em>{race.distanceKm} km</em>
              </div>
            );
          })}
          <div
            className="railRunner"
            style={{ left: `${7 + (nextRaceIndex / Math.max(1, races.length - 1)) * 86}%` }}
            aria-hidden="true"
          >
            🏃‍➡️
          </div>
        </div>
      </div>

      <div className="trailHeading">
        <div>
          <p className="eyebrow">Dynamic race path</p>
          <h3>Every race becomes a checkpoint</h3>
          <p>
            Add a race from the owner dashboard and it automatically joins this trail, gets a flag,
            and updates the exact calendar-day countdown.
          </p>
        </div>
        <a className="ownerEditLink" href="/owner">
          <LockKeyhole size={14} aria-hidden="true" /> Owner: add a race
        </a>
      </div>

      <div className="nextCheckpointBanner">
        <div>
          <span>Next checkpoint</span>
          <strong>{nextRace.name}</strong>
          <small>
            {nextRace.location} · {shortDate(nextRace.date)}
          </small>
        </div>
        <div>
          <strong>{daysToGo ?? "—"}</strong>
          <span>days to go</span>
        </div>
      </div>

      <div className="trailMap">
        <svg viewBox="0 0 1100 330" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="trailShadow"
            d="M30 230 C150 95 240 290 360 170 C470 60 555 275 680 160 C805 48 900 255 1070 105"
          />
          <path
            className="trailPath"
            d="M30 230 C150 95 240 290 360 170 C470 60 555 275 680 160 C805 48 900 255 1070 105"
          />
        </svg>
        <span className="trailSun" aria-hidden="true">
          ☀
        </span>
        <i className="trailMountain trailMountainOne" aria-hidden="true" />
        <i className="trailMountain trailMountainTwo" aria-hidden="true" />
        <i className="trailMountain trailMountainThree" aria-hidden="true" />
        {races.map((race, index) => {
          const point = racePoint(index, races.length);
          const state =
            index < nextRaceIndex ? "done" : index === nextRaceIndex ? "next" : "future";
          return (
            <a
              className={`trailCheckpoint trailCheckpoint-${state}${
                index === races.length - 1 ? " trailCheckpoint-end" : ""
              }`}
              href={race.officialUrl}
              target="_blank"
              rel="noreferrer"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              key={race.slug}
            >
              <span className="checkpointFlag" aria-hidden="true">
                {index === nextRaceIndex ? "🚩" : "🏁"}
              </span>
              <span className="checkpointCard">
                <strong>{race.name}</strong>
                <small>
                  {race.location} · {shortDate(race.date)}
                </small>
                <em>
                  {race.distanceKm} km · {race.registrationStatus}
                </em>
                <ArrowUpRight size={12} aria-hidden="true" />
              </span>
            </a>
          );
        })}
        <span
          className="trailRunner"
          style={{ left: `${runnerPoint.x}%`, top: `${runnerPoint.y}%` }}
          aria-hidden="true"
        >
          <b>🏃‍➡️</b>
          <small>YOU</small>
        </span>
      </div>
    </div>
  );
}
