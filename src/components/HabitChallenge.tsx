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
      await signIn("google", { redirectTo: "/habits#habit-challenge" });
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
      <aside className="habitChallengeGuide">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>Choose one small thing to do alongside me.</h2>
          <p>
            Join a habit with one tap. Your choice stays attached to your Google account, and you
            can tap again whenever you want to leave.
          </p>
        </div>
        <ol className="habitGuideSteps">
          <li>
            <span>1</span> Pick a habit
          </li>
          <li>
            <span>2</span> Join with Google
          </li>
          <li>
            <span>3</span> Work on it with us
          </li>
        </ol>
      </aside>

      <div className="habitChallengeToolbar">
        <p className="habitJoinNotice" aria-live="polite">
          {message ||
            (authenticated
              ? "Choose any habit. Tap Joined whenever you want to leave."
              : authAvailable
                ? "Choose a habit below. Google sign-in keeps every join to one real account."
                : "Habit joining is unavailable until Google sign-in is configured.")}
        </p>
        <Link className="habitOwnerLink" href="/owner/">
          <LockKeyhole size={13} aria-hidden="true" /> Owner edits
        </Link>
      </div>

      <div className="habitChallengeBoard" id="habit-cards">
        {challengeHabits.map((habit) => {
          const join = summaryFor(habit.id);
          const participantLabel =
            join.participantCount === 0
              ? "Be the first to join"
              : join.participantCount === 1
                ? "1 person is joining"
                : `${join.participantCount.toLocaleString("en-IN")} people are joining`;
          const statusLabel =
            habit.status === "In progress" ? "Hritik is doing this" : "Open to start";

          return (
            <article
              className={
                join.joined ? "challengeHabitCard challengeHabitCardJoined" : "challengeHabitCard"
              }
              key={habit.id}
            >
              <div className="challengeHabitHead">
                <span className="challengeHabitIcon" aria-hidden="true">
                  {habit.icon}
                </span>
                <span
                  className={`challengeStatus ${habit.status === "In progress" ? "challengeStatusActive" : ""}`}
                >
                  <i aria-hidden="true" /> {statusLabel}
                </span>
              </div>
              <div className="challengeHabitCopy">
                <h3>{habit.title}</h3>
                <p>{habit.text}</p>
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
                    size={18}
                    fill={join.joined ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                  {busyHabit === habit.id
                    ? "Saving…"
                    : join.joined
                      ? "Joined"
                      : authenticated
                        ? "Join this habit"
                        : "Join with Google"}
                </button>
                <p className={join.participantCount > 0 ? "hasParticipants" : ""}>
                  {participantLabel}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
