"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { PublicRaceIdea, RaceIdeaType } from "@/types/content";

const CREATOR_KEY = "nitya-race-creator-v2";

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
  const [visitorId, setVisitorId] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(CREATOR_KEY);
    const id = stored || window.crypto.randomUUID();
    if (!stored) window.localStorage.setItem(CREATOR_KEY, id);
    setVisitorId(id);

    void fetch("/api/race-ideas", { headers: { "x-nitya-visitor-id": id } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Race ideas are temporarily unavailable.");
        return (await response.json()) as PublicRaceIdea[];
      })
      .then(setIdeas)
      .catch((error: unknown) =>
        setMessage(
          error instanceof Error ? error.message : "Race ideas are temporarily unavailable.",
        ),
      )
      .finally(() => setReady(true));
  }, []);

  async function update(body: Record<string, unknown>) {
    if (!visitorId || busy) return null;
    setBusy(true);
    try {
      const response = await fetch("/api/race-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-nitya-visitor-id": visitorId },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as {
        ideas?: PublicRaceIdea[];
        message?: string;
        error?: string;
      };
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
      <form className="raceIdeaForm" onSubmit={suggest}>
        <input
          name="name"
          required
          maxLength={80}
          placeholder="Race / challenge name"
          aria-label="Race or challenge name"
        />
        <input
          name="location"
          required
          maxLength={80}
          placeholder="Where?"
          aria-label="Race location"
        />
        <select name="type" defaultValue="trail" aria-label="Race type">
          <option value="trail">Trail</option>
          <option value="road">Road</option>
          <option value="hyrox">Hybrid / HYROX</option>
          <option value="ultra">Ultra</option>
          <option value="triathlon">Triathlon</option>
          <option value="fun">Fun challenge</option>
        </select>
        <button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Suggest"}
        </button>
      </form>
      <p className="raceIdeaMessage" aria-live="polite">
        {message ||
          "Suggestions and votes are shared across visitors; each browser gets one vote per idea."}
      </p>

      {ready && ideas.length === 0 ? (
        <div className="raceIdeasEmpty">
          <span aria-hidden="true">🏁</span>
          <h3>No race suggestions yet.</h3>
          <p>Add the first real race or challenge and it will begin with one vote.</p>
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
                  disabled={busy}
                  onClick={() => void update({ action: "vote", id: idea.id })}
                  aria-label={`Vote for ${idea.name}`}
                >
                  ▲ Vote
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
