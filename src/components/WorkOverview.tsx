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
            Small, practical habits I am testing in public—what I am doing, where each one stands
            and what it has helped me save.
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
    </div>
  );
}
