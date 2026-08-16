import "server-only";

import { get, list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { addVoterOnce, uniqueVoterIds } from "@/lib/race-idea-votes";
import type { PublicRaceIdea, RaceIdeaType, StoredRaceIdea } from "@/types/content";

const IDEAS_PREFIX = "nitya-content/race-ideas-";
const raceTypes = new Set<RaceIdeaType>(["trail", "road", "hyrox", "ultra", "triathlon", "fun"]);

function blobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN,
  );
}

const localRaceState = globalThis as typeof globalThis & {
  __nityaRaceIdeas?: StoredRaceIdea[];
};

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim().replace(/\s+/g, " ");
  return clean && clean.length <= max ? clean : null;
}

function normalise(value: string): string {
  return value
    .toLocaleLowerCase("en-IN")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseIdeas(value: unknown): StoredRaceIdea[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): StoredRaceIdea[] => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Partial<StoredRaceIdea>;
    const valid =
      typeof candidate.id === "string" &&
      typeof candidate.creatorId === "string" &&
      Array.isArray(candidate.voterIds) &&
      candidate.voterIds.every((id) => typeof id === "string") &&
      typeof candidate.name === "string" &&
      typeof candidate.location === "string" &&
      raceTypes.has(candidate.type as RaceIdeaType) &&
      typeof candidate.createdAt === "string";
    if (!valid) return [];
    return [
      {
        id: candidate.id as string,
        creatorId: candidate.creatorId as string,
        voterIds: uniqueVoterIds(candidate.voterIds as string[]),
        name: candidate.name as string,
        location: candidate.location as string,
        type: candidate.type as RaceIdeaType,
        createdAt: candidate.createdAt as string,
      },
    ];
  });
}

async function readIdeas(): Promise<StoredRaceIdea[]> {
  if (!blobConfigured()) {
    return process.env.NODE_ENV === "production"
      ? []
      : structuredClone(localRaceState.__nityaRaceIdeas ?? []);
  }
  const result = await list({ prefix: IDEAS_PREFIX, limit: 100 });
  const latest = result.blobs.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )[0];
  if (!latest) return [];
  const response = await get(latest.pathname, { access: "private", useCache: false });
  if (!response || response.statusCode !== 200) return [];
  return parseIdeas(JSON.parse(await new Response(response.stream).text()) as unknown);
}

async function writeIdeas(ideas: StoredRaceIdea[]): Promise<void> {
  if (!blobConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Race suggestion storage is not configured.");
    }
    localRaceState.__nityaRaceIdeas = structuredClone(ideas.slice(0, 100));
    return;
  }
  await put(`${IDEAS_PREFIX}${Date.now()}.json`, JSON.stringify(ideas.slice(0, 100)), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 60,
  });
}

export function publicIdeas(ideas: StoredRaceIdea[], visitorId: string): PublicRaceIdea[] {
  return ideas
    .map((idea) => {
      const voterIds = uniqueVoterIds(idea.voterIds);
      return {
        id: idea.id,
        name: idea.name,
        location: idea.location,
        type: idea.type,
        votes: voterIds.length,
        hasVoted: voterIds.includes(visitorId),
        canDelete: idea.creatorId === visitorId && voterIds.length === 1,
      };
    })
    .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));
}

export async function getPublicRaceIdeas(visitorId: string): Promise<PublicRaceIdea[]> {
  try {
    return publicIdeas(await readIdeas(), visitorId);
  } catch (error) {
    console.error("Unable to read race ideas.", error);
    return [];
  }
}

export async function suggestRaceIdea(input: {
  visitorId: unknown;
  name: unknown;
  location: unknown;
  type: unknown;
}): Promise<{ ideas: PublicRaceIdea[]; message: string }> {
  const visitorId = cleanText(input.visitorId, 100);
  const name = cleanText(input.name, 80);
  const location = cleanText(input.location, 80);
  const type = raceTypes.has(input.type as RaceIdeaType) ? (input.type as RaceIdeaType) : null;
  if (!visitorId || !name || !location || !type)
    throw new Error("Please complete every race field.");

  const ideas = await readIdeas();
  const duplicate = ideas.find(
    (idea) =>
      normalise(idea.name) === normalise(name) && normalise(idea.location) === normalise(location),
  );
  let message: string;
  if (duplicate) {
    const added = addVoterOnce(duplicate.voterIds, visitorId);
    message = added
      ? `${duplicate.name} was already here, so your suggestion became an upvote.`
      : `You have already voted for ${duplicate.name}.`;
  } else {
    ideas.unshift({
      id: randomUUID(),
      creatorId: visitorId,
      voterIds: [visitorId],
      name,
      location,
      type,
      createdAt: new Date().toISOString(),
    });
    message = `${name} was added with one vote.`;
  }
  await writeIdeas(
    ideas.map((idea) => ({
      ...idea,
      voterIds: uniqueVoterIds(idea.voterIds),
    })),
  );
  return { ideas: publicIdeas(ideas, visitorId), message };
}

export async function voteForRaceIdea(
  idValue: unknown,
  visitorValue: unknown,
): Promise<{ ideas: PublicRaceIdea[]; message: string }> {
  const id = cleanText(idValue, 100);
  const visitorId = cleanText(visitorValue, 100);
  if (!id || !visitorId) throw new Error("Unable to record this vote.");
  const ideas = await readIdeas();
  const idea = ideas.find((candidate) => candidate.id === id);
  if (!idea) throw new Error("That race idea no longer exists.");
  const added = addVoterOnce(idea.voterIds, visitorId);
  if (added) await writeIdeas(ideas);
  return {
    ideas: publicIdeas(ideas, visitorId),
    message: added
      ? `Your vote for ${idea.name} was recorded.`
      : `You already voted for ${idea.name}.`,
  };
}

export async function deleteRaceIdea(
  idValue: unknown,
  visitorValue: unknown,
): Promise<PublicRaceIdea[]> {
  const id = cleanText(idValue, 100);
  const visitorId = cleanText(visitorValue, 100);
  if (!id || !visitorId) throw new Error("Unable to remove this idea.");
  const ideas = await readIdeas();
  const idea = ideas.find((candidate) => candidate.id === id);
  const voterIds = uniqueVoterIds(idea?.voterIds ?? []);
  if (!idea || idea.creatorId !== visitorId || voterIds.length !== 1) {
    throw new Error("Only the account that suggested a one-vote idea can delete it.");
  }
  const next = ideas.filter((candidate) => candidate.id !== id);
  await writeIdeas(next);
  return publicIdeas(next, visitorId);
}
