import "server-only";

import { get, list, put } from "@vercel/blob";
import { challengeHabitIds } from "@/data/challenge-habits";
import { toggleAccount, uniqueAccountIds } from "@/lib/habit-join-state";
import type { HabitJoinSummary } from "@/types/content";

const HABIT_JOINS_PREFIX = "nitya-content/habit-joins-";

interface StoredHabitJoins {
  version: 1;
  participants: Record<string, string[]>;
}

const localHabitState = globalThis as typeof globalThis & {
  __nityaHabitJoins?: StoredHabitJoins;
};

function blobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN,
  );
}

function emptyState(): StoredHabitJoins {
  return { version: 1, participants: {} };
}

function parseState(value: unknown): StoredHabitJoins {
  if (!value || typeof value !== "object") return emptyState();
  const input = value as Partial<StoredHabitJoins>;
  if (input.version !== 1 || !input.participants || typeof input.participants !== "object") {
    return emptyState();
  }

  const participants: Record<string, string[]> = {};
  for (const [habitId, accountIds] of Object.entries(input.participants)) {
    if (!challengeHabitIds.has(habitId) || !Array.isArray(accountIds)) continue;
    const validIds = accountIds.filter(
      (id): id is string => typeof id === "string" && id.length > 0,
    );
    participants[habitId] = uniqueAccountIds(validIds);
  }
  return { version: 1, participants };
}

async function readState(): Promise<StoredHabitJoins> {
  if (!blobConfigured()) {
    return process.env.NODE_ENV === "production"
      ? emptyState()
      : structuredClone(localHabitState.__nityaHabitJoins ?? emptyState());
  }
  const result = await list({ prefix: HABIT_JOINS_PREFIX, limit: 100 });
  const latest = result.blobs.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )[0];
  if (!latest) return emptyState();
  const response = await get(latest.pathname, { access: "private", useCache: false });
  if (!response || response.statusCode !== 200) return emptyState();
  return parseState(JSON.parse(await new Response(response.stream).text()) as unknown);
}

async function writeState(state: StoredHabitJoins): Promise<void> {
  if (!blobConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Habit participation storage is not configured.");
    }
    localHabitState.__nityaHabitJoins = structuredClone(state);
    return;
  }
  await put(`${HABIT_JOINS_PREFIX}${Date.now()}.json`, JSON.stringify(state), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 60,
  });
}

function summaries(state: StoredHabitJoins, accountId: string): HabitJoinSummary[] {
  return [...challengeHabitIds].map((habitId) => {
    const accountIds = uniqueAccountIds(state.participants[habitId] ?? []);
    return {
      habitId,
      participantCount: accountIds.length,
      joined: Boolean(accountId && accountIds.includes(accountId)),
    };
  });
}

export async function getHabitJoinSummaries(accountId: string): Promise<HabitJoinSummary[]> {
  try {
    return summaries(await readState(), accountId);
  } catch (error) {
    console.error("Unable to read habit participation.", error);
    return summaries(emptyState(), accountId);
  }
}

export async function toggleHabitJoin(
  habitIdValue: unknown,
  accountId: string,
): Promise<{ joins: HabitJoinSummary[]; joined: boolean }> {
  const habitId = typeof habitIdValue === "string" ? habitIdValue.trim() : "";
  if (!challengeHabitIds.has(habitId)) throw new Error("That habit is no longer available.");
  if (!accountId) throw new Error("Sign in with Google to join a habit.");

  const state = await readState();
  const accountIds = uniqueAccountIds(state.participants[habitId] ?? []);
  const joined = toggleAccount(accountIds, accountId);
  state.participants[habitId] = accountIds;
  await writeState(state);
  return { joins: summaries(state, accountId), joined };
}
