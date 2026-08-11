import { LockKeyhole } from "lucide-react";
import Link from "next/link";

const challengeHabits = [
  {
    icon: "🍱",
    title: "Plan food better",
    text: "Order less randomly without making food boring.",
    saved: 0,
    progress: 55,
    status: "In progress",
  },
  {
    icon: "🛍️",
    title: "30-day impulse rule",
    text: "Pause before buying things you probably don’t need.",
    saved: 0,
    progress: 10,
    status: "Yet to pick up",
  },
  {
    icon: "💳",
    title: "Use cards properly",
    text: "Pay in full, avoid fees and actually use rewards.",
    saved: 0,
    progress: 70,
    status: "In progress",
  },
  {
    icon: "🏃‍➡️",
    title: "Train consistently",
    text: "Run, lift and build routines that survive busy weeks.",
    saved: 0,
    progress: 62,
    status: "In progress",
  },
  {
    icon: "✂️",
    title: "Fix subscriptions",
    text: "Remove recurring things that add no real value.",
    saved: 0,
    progress: 5,
    status: "Yet to pick up",
  },
  {
    icon: "✨",
    title: "Your own habit",
    text: "Choose something that makes your life tangibly better.",
    saved: 0,
    progress: 0,
    status: "Yet to pick up",
  },
] as const;

export function HabitChallenge() {
  return (
    <div className="habitChallengeLayout">
      <div className="habitChallengeBoard">
        {challengeHabits.map((habit, index) => (
          <article
            className={
              index === 0 ? "challengeHabitCard challengeHabitCardActive" : "challengeHabitCard"
            }
            key={habit.title}
          >
            <span
              className={`challengeStatus ${habit.status === "In progress" ? "challengeStatusActive" : ""}`}
            >
              ● {habit.status}
            </span>
            <span className="challengeHabitIcon" aria-hidden="true">
              {habit.icon}
            </span>
            <h3>{habit.title}</h3>
            <p>{habit.text}</p>
            <div className="challengeMoney">
              Money saved this month: <strong>₹{habit.saved.toLocaleString("en-IN")}</strong>
            </div>
            <div className="challengeProgress" aria-label={`${habit.progress}% progress`}>
              <span style={{ width: `${habit.progress}%` }} />
            </div>
            <div className="challengeControls" aria-label="Habit status">
              <span>{habit.status}</span>
              <span>{habit.status === "In progress" ? "Done" : "Start"}</span>
            </div>
          </article>
        ))}
      </div>
      <aside className="habitWorstCase">
        <p className="eyebrow">The worst-case outcome</p>
        <h3>Your life improves.</h3>
        <p>
          You spend with more intention, get fitter, eat better, organise your money or build a
          useful routine. That&apos;s already positive impact—even before one rupee leaves your
          account.
        </p>
        <p>
          <strong>Contribution is always optional.</strong> The habit is the first contribution.
        </p>
        <a className="button buttonPrimary buttonWide" href="#contact">
          I&apos;m joining the habit challenge
        </a>
        <Link className="habitOwnerLink" href="/owner/">
          <LockKeyhole size={13} aria-hidden="true" /> Only the owner can edit these cards
        </Link>
      </aside>
    </div>
  );
}
