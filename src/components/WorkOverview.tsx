import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { statusLabel, type Habit } from "@/data/content";
import { formatDate } from "@/lib/format";

interface WorkOverviewProps {
  habits: Habit[];
}

export function WorkOverview({ habits }: WorkOverviewProps) {
  return (
    <div className="shell">
      <div className="ownerHeading">
        <div>
          <p className="eyebrow">The engine</p>
          <h2 className="artifactSectionTitle">Habits that free up money</h2>
          <p className="sectionIntro">
            These are Hritik&apos;s own habits, updated from the private owner dashboard. Each card
            shows what he is changing, its current status, any estimated savings and the date of the
            latest update.
          </p>
        </div>
        <Link className="ownerEditLink" href="/owner/">
          <LockKeyhole size={15} aria-hidden="true" /> Owner editing
        </Link>
      </div>
      <div className="artifactHabitList">
        {habits.map((habit) => {
          const saved = habit.savedRupees ?? 0;
          return (
            <article className="artifactHabitCard" key={habit.id}>
              <span className="artifactHabitIcon" aria-hidden="true">
                {habit.icon}
              </span>
              <div className="habitListCopy">
                <div>
                  <h3>{habit.title}</h3>
                  <span className={`workStatus workStatus-${habit.status}`}>
                    {statusLabel(habit.status)}
                  </span>
                </div>
                <p>{habit.description}</p>
                <small>Last updated {formatDate(habit.lastUpdated)}</small>
              </div>
              <div className="habitSavedOnly">
                <span>Saved</span>
                <strong>₹{saved.toLocaleString("en-IN")}</strong>
              </div>
            </article>
          );
        })}
      </div>
      <p className="publicPageNextStep">
        Want to work on a habit yourself? <Link href="/habits">Choose one and join in.</Link>
      </p>
    </div>
  );
}
