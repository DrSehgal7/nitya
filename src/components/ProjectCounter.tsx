"use client";

import { useEffect, useState } from "react";
import { project } from "@/data/content";
import { millisecondsUntilNextIndiaMidnight, projectDaysSince } from "@/lib/project-time";

export function ProjectCounter() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refreshAtMidnight = () => {
      setDays(projectDaysSince(project.startedOn));
      timer = setTimeout(refreshAtMidnight, millisecondsUntilNextIndiaMidnight() + 100);
    };

    refreshAtMidnight();
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="projectCounter" aria-label="Days since Project Nitya began">
      <span>Project Nitya · in motion</span>
      <div>
        <strong>{days?.toLocaleString("en-IN") ?? "—"}</strong>
        <small>{days === 1 ? "day since start" : "days since start"}</small>
      </div>
      <div className="counterTrack" aria-hidden="true">
        <i />
        <b>🏃‍➡️</b>
      </div>
    </aside>
  );
}
