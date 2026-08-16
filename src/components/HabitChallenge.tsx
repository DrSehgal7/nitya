"use client";

import { LockKeyhole, ThumbsUp } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { challengeHabits } from "@/data/challenge-habits";
import type { HabitJoinSummary } from "@/types/content";

export function HabitChallenge() {
  const [joins, setJoins] = useState<HabitJoinSummary[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [authAvailable, setAuthAvailable] = useState(true);
  const [busyHabit, setBusyHabit] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void fetch("/api/habit-joins")
      .then(async (response) => {
        if (!response.ok) throw new Error("Habit participation is temporarily unavailable.");
        return (await response.json()) as {
          joins: HabitJoinSummary[];
          authenticated: boolean;
          authAvailable: boolean;
        };
      })
      .then((result) => {
        setJoins(result.joins);
        setAuthenticated(result.authenticated);
        setAuthAvailable(result.authAvailable);
      })
      .catch((error: unknown) =>
        setMessage(
          error instanceof Error
            ? error.message
            : "Habit participation is temporarily unavailable.",
        ),
      );
  }, []);

  function summaryFor(habitId: string): HabitJoinSummary {
    return (
      joins.find((join) => join.habitId === habitId) ?? {
        habitId,
        participantCount: 0,
        joined: false,
      }
    );
  }

  async function toggleHabit(habitId: string) {
    if (busyHabit) return;
    if (!authenticated) {
      if (!authAvailable) {
        setMessage("Google sign-in is not configured in this environment.");
        return;
      }
      await signIn("google", { redirectTo: "/#habit-challenge" });
      return;
    }

    setBusyHabit(habitId);
    setMessage("");
    try {
      const response = await fetch("/api/habit-joins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId }),
      });
      const result = (await response.json()) as {
        joins?: HabitJoinSummary[];
        joined?: boolean;
        error?: string;
      };
      if (response.status === 401) setAuthenticated(false);
      if (!response.ok || !result.joins) {
        throw new Error(result.error || "Unable to update this habit.");
      }
      setJoins(result.joins);
      setMessage(result.joined ? "You joined the habit. Let’s do this." : "You left the habit.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update this habit.");
    } finally {
      setBusyHabit("");
    }
  }

  return (
    <div className="habitChallengeLayout" id="habit-challenge">
      <div>
        <p className="habitJoinNotice" aria-live="polite">
          {message ||
            (authenticated
              ? "Choose any habit. Tap again whenever you want to leave."
              : "Sign in with Google, then tap the thumbs-up on any habit you want to join.")}
        </p>
        <div className="habitChallengeBoard" id="habit-cards">
          {challengeHabits.map((habit, index) => {
            const join = summaryFor(habit.id);
            const participantLabel =
              join.participantCount === 1 ? "person is joining" : "people are joining";
            return (
              <article
                className={
                  index === 0 ? "challengeHabitCard challengeHabitCardActive" : "challengeHabitCard"
                }
                key={habit.id}
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
                <div className="habitJoinControl">
                  <button
                    type="button"
                    className={
                      join.joined ? "habitJoinButton habitJoinButtonActive" : "habitJoinButton"
                    }
                    aria-pressed={join.joined}
                    aria-label={
                      join.joined
                        ? `Leave ${habit.title}`
                        : `${authenticated ? "Join" : "Sign in to join"} ${habit.title}`
                    }
                    disabled={Boolean(busyHabit) || !authAvailable}
                    onClick={() => void toggleHabit(habit.id)}
                  >
                    <ThumbsUp
                      size={17}
                      fill={join.joined ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                    {busyHabit === habit.id ? "Saving…" : join.joined ? "Joined" : "Join"}
                  </button>
                  <p>
                    <strong>{join.participantCount.toLocaleString("en-IN")}</strong>{" "}
                    {participantLabel}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
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
        <a className="button buttonPrimary buttonWide" href="#habit-cards">
          Choose a habit to join
        </a>
        <Link className="habitOwnerLink" href="/owner/">
          <LockKeyhole size={13} aria-hidden="true" /> Only the owner can edit these cards
        </Link>
      </aside>
    </div>
  );
}
