import { Check, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { goalProgressFromSubgoals, statusLabel, type PublicGoal } from "@/data/content";
import { formatDate } from "@/lib/format";

interface PublicGoalsProps {
  goals: PublicGoal[];
  runningDistance: number;
  pledgeLabel: string;
}

export function PublicGoals({ goals, runningDistance, pledgeLabel }: PublicGoalsProps) {
  return (
    <div className="shell">
      <div className="ownerHeading publicGoalsHeading">
        <div>
          <p className="eyebrow">Goals in motion</p>
          <h2 className="artifactSectionTitle">Every big goal gets smaller checkpoints.</h2>
          <p className="sectionIntro">
            These are Hritik&apos;s personal goals, broken into smaller milestones. He updates their
            status and date from the owner dashboard. Completing a meaningful goal unlocks an extra
            contribution on top of his private {pledgeLabel} baseline.
          </p>
        </div>
        <Link className="ownerEditLink" href="/owner/">
          <LockKeyhole size={15} aria-hidden="true" /> Owner editing
        </Link>
      </div>
      <div className="artifactGoalGrid">
        {goals.map((goal) => {
          const isRunGoal = goal.id === "run-1000-km";
          const progress = goalProgressFromSubgoals(goal.subgoals, goal.progress);
          const currentLabel = isRunGoal
            ? `${runningDistance.toFixed(1)} / 1,000 km`
            : goal.currentLabel;
          const completedCount = goal.subgoals.filter((item) => item.completed).length;
          return (
            <article className="artifactGoalCard" key={goal.id}>
              <div className="goalTop">
                <span>{goal.category}</span>
                <span className={`workStatus workStatus-${goal.status}`}>
                  {statusLabel(goal.status)}
                </span>
              </div>
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
              <div className={`goalMotionVisual goalMotionVisual-${goal.id}`} aria-hidden="true">
                {goal.id === "run-1000-km"
                  ? "🏃‍➡️"
                  : goal.id === "deadlift-140"
                    ? "🏋️"
                    : goal.id === "ship-nitya"
                      ? "✦"
                      : "₹"}
              </div>
              <div className="goalUpdatePreview">
                <span>Current update</span>
                <p>{currentLabel}</p>
                <small>Last updated {formatDate(goal.lastUpdated)}</small>
              </div>
              {goal.subgoals.length > 0 && (
                <div className="publicMilestones">
                  <span className="publicMilestonesLabel">Milestones</span>
                  <ul>
                    {goal.subgoals.map((subgoal) => (
                      <li className={subgoal.completed ? "isComplete" : ""} key={subgoal.id}>
                        <span aria-hidden="true">
                          {subgoal.completed ? <Check size={13} /> : null}
                        </span>
                        {subgoal.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="goalCurrent">
                {goal.subgoals.length > 0
                  ? `${completedCount} of ${goal.subgoals.length} milestones`
                  : currentLabel}
              </div>
              {goal.subgoals.length > 0 && (
                <div
                  className="activeTrack"
                  aria-label={`${completedCount} of ${goal.subgoals.length} milestones completed`}
                >
                  <span style={{ width: `${progress}%` }} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
