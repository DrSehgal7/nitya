"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import type { PublicRaceIdea, RaceIdeaType } from "@/types/content";

const glyphs: Record<RaceIdeaType, string> = {
  trail: "⛰️",
  road: "🏁",
  hyrox: "⚡",
  ultra: "🌙",
  triathlon: "🌊",
  fun: "🎲",
};

export function RaceIdeasBoard() {
  const [ideas, setIdeas] = useState<PublicRaceIdea[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [authAvailable, setAuthAvailable] = useState(true);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void fetch("/api/race-ideas")
      .then(async (response) => {
        if (!response.ok) throw new Error("Event ideas are temporarily unavailable.");
        return (await response.json()) as {
          ideas: PublicRaceIdea[];
          authenticated: boolean;
          authAvailable: boolean;
        };
      })
      .then((result) => {
        setIdeas(result.ideas);
        setAuthenticated(result.authenticated);
        setAuthAvailable(result.authAvailable);
      })
      .catch((error: unknown) =>
        setMessage(
          error instanceof Error ? error.message : "Event ideas are temporarily unavailable.",
        ),
      )
      .finally(() => setReady(true));
  }, []);

  async function update(body: Record<string, unknown>) {
    if (!authenticated || busy) return null;
    setBusy(true);
    try {
      const response = await fetch("/api/race-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as {
        ideas?: PublicRaceIdea[];
        message?: string;
        error?: string;
      };
      if (response.status === 401) setAuthenticated(false);
      if (!response.ok || !result.ideas)
        throw new Error(result.error || "Unable to save that change.");
      setIdeas(result.ideas);
      if (result.message) setMessage(result.message);
      return result;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save that change.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function suggest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = await update({
      action: "suggest",
      name: data.get("name"),
      location: data.get("location"),
      type: data.get("type"),
    });
    if (result) form.reset();
  }

  return (
    <div className="raceIdeasBoard">
      <div className="raceVotingAccess">
        <div>
          <strong>{authenticated ? "You are signed in." : "One person. One vote."}</strong>
          <span>
            {authenticated
              ? "Each Google account gets one vote per idea—even across browsers. Tap Voted again to remove it."
              : "Sign in with Google to suggest an event or cast your one vote."}
          </span>
        </div>
        {!authenticated && (
          <button
            type="button"
            disabled={!authAvailable}
            onClick={() => void signIn("google", { redirectTo: "/events#event-ideas" })}
          >
            {authAvailable ? "Continue with Google" : "Google sign-in unavailable"}
          </button>
        )}
      </div>
      <form className="raceIdeaForm" onSubmit={suggest}>
        <input
          name="name"
          required
          maxLength={80}
          placeholder="Event or challenge name"
          aria-label="Event or challenge name"
          disabled={!authenticated || busy}
        />
        <input
          name="location"
          required
          maxLength={80}
          placeholder="Where?"
          aria-label="Event location"
          disabled={!authenticated || busy}
        />
        <select
          name="type"
          defaultValue="trail"
          aria-label="Event type"
          disabled={!authenticated || busy}
        >
          <option value="trail">Trail</option>
          <option value="road">Road</option>
          <option value="hyrox">Hybrid / HYROX</option>
          <option value="ultra">Ultra</option>
          <option value="triathlon">Triathlon</option>
          <option value="fun">Fun challenge</option>
        </select>
        <button type="submit" disabled={!authenticated || busy}>
          {busy ? "Saving…" : "Suggest"}
        </button>
      </form>
      <p className="raceIdeaMessage" aria-live="polite">
        {message ||
          (authenticated
            ? "Suggestions and votes are shared; your Google account gets one vote per idea."
            : "Sign in is required so votes stay fair and cannot be repeated by refreshing.")}
      </p>

      {ready && ideas.length === 0 ? (
        <div className="raceIdeasEmpty">
          <span aria-hidden="true">🏁</span>
          <h3>No event suggestions yet.</h3>
          <p>Add the first real event or challenge and it will begin with one vote.</p>
        </div>
      ) : (
        <div className="raceIdeaGrid">
          {ideas.map((idea) => (
            <article className="raceIdeaCard" key={idea.id}>
              <span className="raceIdeaGlyph" aria-hidden="true">
                {glyphs[idea.type]}
              </span>
              <h3>{idea.name}</h3>
              <p>
                {idea.location} · {idea.type}
              </p>
              <div className="ideaRunnerTrack" aria-hidden="true">
                <i>🏃‍➡️</i>
              </div>
              <div className="ideaVoteRow">
                <strong>{idea.votes}</strong>
                <span>{idea.votes === 1 ? "vote" : "votes"}</span>
                {idea.canDelete && (
                  <button
                    className="ideaDeleteButton"
                    type="button"
                    disabled={busy}
                    aria-label={`Delete ${idea.name}`}
                    onClick={() => void update({ action: "delete", id: idea.id })}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy || !authenticated}
                  onClick={() => void update({ action: "vote", id: idea.id })}
                  aria-label={
                    idea.hasVoted ? `Remove vote from ${idea.name}` : `Vote for ${idea.name}`
                  }
                >
                  {idea.hasVoted ? "✓ Voted · undo" : "▲ Vote"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
