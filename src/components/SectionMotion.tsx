"use client";

import { useEffect, useState } from "react";
import { project } from "@/data/content";
import { millisecondsUntilNextIndiaMidnight, projectDaysSince } from "@/lib/project-time";

interface SectionMotionProps {
  persistent?: boolean;
}

export function SectionMotion({ persistent = false }: SectionMotionProps) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    if (!persistent) return;

    let timer: ReturnType<typeof setTimeout>;
    const refreshAtMidnight = () => {
      setDays(projectDaysSince(project.startedOn));
      timer = setTimeout(refreshAtMidnight, millisecondsUntilNextIndiaMidnight() + 100);
    };

    refreshAtMidnight();
    return () => clearTimeout(timer);
  }, [persistent]);

  return (
    <div
      className={`sectionMotion${persistent ? " sectionMotionPersistent" : ""}`}
      aria-hidden="true"
    >
      {!persistent && (
        <div className="sectionRunnerGhosts">
          <svg viewBox="0 0 420 420">
            <g fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round">
              <circle cx="145" cy="70" r="30" />
              <path d="M135 105 C120 150 120 185 132 225" />
              <path d="M126 155 C92 177 68 198 45 227" />
              <path d="M130 159 C168 180 194 194 224 214" />
              <path d="M132 225 C101 262 76 296 58 340" />
              <path d="M135 225 C174 251 202 277 237 311" />
            </g>
            <g
              className="secondGhost"
              fill="none"
              stroke="currentColor"
              strokeWidth="13"
              strokeLinecap="round"
            >
              <circle cx="265" cy="62" r="30" />
              <path d="M253 99 C238 143 234 180 245 220" />
              <path d="M243 151 C205 171 181 195 157 220" />
              <path d="M247 153 C286 176 315 193 346 216" />
              <path d="M245 220 C216 258 191 292 170 335" />
              <path d="M248 220 C286 248 320 276 355 312" />
            </g>
            <path
              className="motionArc"
              d="M35 255 C130 330 250 325 380 205"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {persistent && (
        <div className="sectionMotionCounter">
          <span>Project Nitya · in motion</span>
          <div className="motionCountValue">
            <strong>{days?.toLocaleString("en-IN") ?? "—"}</strong>
            <b>
              {days === 1 ? "day" : "days"}
              <br />
              since start
            </b>
          </div>
          <div className="motionRunway">
            {Array.from({ length: 8 }, (_, index) => (
              <i key={index} />
            ))}
            <svg viewBox="0 0 60 38">
              <g
                className="motionRunnerBody"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="34" cy="7" r="4.5" />
                <path d="M32 12 L27 21 M29 16 L20 20 M29 16 L39 20 M27 21 L20 31 M27 21 L39 29" />
              </g>
              <path
                className="motionSpeedLines"
                d="M15 21 H3 M18 26 H8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
