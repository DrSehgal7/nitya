"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type RaceIdeaType = "trail" | "road" | "hyrox" | "ultra" | "triathlon" | "fun";

interface RaceIdea {
  id: string;
  creatorId: string;
  name: string;
  location: string;
  type: RaceIdeaType;
  votes: number;
}

const IDEAS_KEY = "nitya-race-ideas-v2";
const CREATOR_KEY = "nitya-race-creator-v1";
const raceTypes = new Set<RaceIdeaType>(["trail", "road", "hyrox", "ultra", "triathlon", "fun"]);

const glyphs: Record<RaceIdeaType, string> = {
  trail: "⛰️",
  road: "🏁",
  hyrox: "⚡",
  ultra: "🌙",
  triathlon: "🌊",
  fun: "🎲",
};

function normalise(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
}

function readIdeas(value: string | null): RaceIdea[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((idea): idea is RaceIdea => {
      if (!idea || typeof idea !== "object") return false;
      const candidate = idea as Partial<RaceIdea>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.creatorId === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.location === "string" &&
        typeof candidate.type === "string" &&
        raceTypes.has(candidate.type as RaceIdeaType) &&
        typeof candidate.votes === "number" &&
        candidate.votes >= 1
      );
    });
  } catch {
    return [];
  }
}

export function RaceIdeasBoard() {
  const [ideas, setIdeas] = useState<RaceIdea[]>([]);
  const [creatorId, setCreatorId] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedCreator = window.localStorage.getItem(CREATOR_KEY);
    const currentCreator = storedCreator || window.crypto.randomUUID();
    if (!storedCreator) window.localStorage.setItem(CREATOR_KEY, currentCreator);

    setCreatorId(currentCreator);
    setIdeas(readIdeas(window.localStorage.getItem(IDEAS_KEY)));
    setReady(true);

    const syncOpenTabs = (event: StorageEvent) => {
      if (event.key === IDEAS_KEY) setIdeas(readIdeas(event.newValue));
    };
    window.addEventListener("storage", syncOpenTabs);
    return () => window.removeEventListener("storage", syncOpenTabs);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
  }, [ideas, ready]);

  function suggest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const location = String(data.get("location") ?? "").trim();
    const type = String(data.get("type") ?? "trail") as RaceIdeaType;
    if (!name || !location || !raceTypes.has(type) || !creatorId) return;

    const duplicate = ideas.find(
      (idea) =>
        normalise(idea.name) === normalise(name) &&
        normalise(idea.location) === normalise(location),
    );

    if (duplicate) {
      setIdeas((current) =>
        current.map((idea) =>
          idea.id === duplicate.id ? { ...idea, votes: idea.votes + 1 } : idea,
        ),
      );
      setMessage(`${duplicate.name} was already here, so your suggestion became an upvote.`);
    } else {
      setIdeas((current) => [
        {
          id: window.crypto.randomUUID(),
          creatorId,
          name,
          location,
          type,
          votes: 1,
        },
        ...current,
      ]);
      setMessage(`${name} was added with one vote.`);
    }

    form.reset();
  }

  function vote(id: string) {
    setIdeas((current) =>
      current.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea)),
    );
  }

  function remove(id: string) {
    const idea = ideas.find((candidate) => candidate.id === id);
    if (!idea || idea.creatorId !== creatorId || idea.votes !== 1) return;
    setIdeas((current) => current.filter((candidate) => candidate.id !== id));
    setMessage(`${idea.name} was removed.`);
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
        <button type="submit">Suggest</button>
      </form>
      <p className="raceIdeaMessage" aria-live="polite">
        {message || "No database: ideas are saved in this browser and sync live across its tabs."}
      </p>

      {ready && ideas.length === 0 ? (
        <div className="raceIdeasEmpty">
          <span aria-hidden="true">🏁</span>
          <h3>No race suggestions yet.</h3>
          <p>Add the first real race or challenge and it will begin with one vote.</p>
        </div>
      ) : (
        <div className="raceIdeaGrid">
          {ideas.map((idea) => {
            const canDelete = idea.creatorId === creatorId && idea.votes === 1;
            return (
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
                  {canDelete && (
                    <button
                      className="ideaDeleteButton"
                      type="button"
                      onClick={() => remove(idea.id)}
                      aria-label={`Delete ${idea.name}`}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => vote(idea.id)}
                    aria-label={`Vote for ${idea.name}`}
                  >
                    ▲ Vote
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
