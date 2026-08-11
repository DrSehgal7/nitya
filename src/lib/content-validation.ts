import type { Habit, LedgerEntry, PublicGoal, WorkStatus } from "@/data/content";
import { hyroxDelhi2026, type Race, type RaceStatus } from "../data/races";
import type { SiteContent } from "@/types/content";

const statuses = new Set<WorkStatus>(["not-started", "in-progress", "done"]);
const raceStatuses = new Set<RaceStatus>(["confirmed", "considering"]);
const goalCategories = new Set<PublicGoal["category"]>(["Body", "Craft", "Money"]);
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  return clean && clean.length <= max ? clean : null;
}

function numberIn(value: unknown, min: number, max: number): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max
    ? value
    : null;
}

function integerIn(value: unknown, min: number, max: number): number | null {
  const parsed = numberIn(value, min, max);
  return parsed !== null && Number.isInteger(parsed) ? parsed : null;
}

function date(value: unknown): string | null {
  const clean = text(value, 10);
  return clean && isoDate.test(clean) && !Number.isNaN(Date.parse(`${clean}T00:00:00Z`))
    ? clean
    : null;
}

function slug(value: unknown, fallback: string): string {
  const clean = typeof value === "string" ? value : "";
  const result = clean
    .toLocaleLowerCase("en-IN")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
  return result || fallback;
}

function habit(value: unknown, index: number): Habit | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<Habit>;
  const title = text(item.title, 100);
  const description = text(item.description, 240);
  const icon = text(item.icon, 12);
  const status = statuses.has(item.status as WorkStatus) ? (item.status as WorkStatus) : null;
  const progress = integerIn(item.progress, 0, 100);
  const savedRupees = integerIn(item.savedRupees, 0, 100_000_000);
  const lastUpdated = date(item.lastUpdated);
  if (
    !title ||
    !description ||
    !icon ||
    !status ||
    progress === null ||
    savedRupees === null ||
    !lastUpdated
  )
    return null;
  return {
    id: slug(item.id, `habit-${index + 1}`),
    icon,
    title,
    description,
    status,
    progress,
    savedRupees,
    lastUpdated,
  };
}

function goal(value: unknown, index: number): PublicGoal | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<PublicGoal>;
  const title = text(item.title, 120);
  const description = text(item.description, 300);
  const currentLabel = text(item.currentLabel, 200);
  const category = goalCategories.has(item.category as PublicGoal["category"])
    ? (item.category as PublicGoal["category"])
    : null;
  const status = statuses.has(item.status as WorkStatus) ? (item.status as WorkStatus) : null;
  const progress = integerIn(item.progress, 0, 100);
  const lastUpdated = date(item.lastUpdated);
  if (
    !title ||
    !description ||
    !currentLabel ||
    !category ||
    !status ||
    progress === null ||
    !lastUpdated
  )
    return null;
  return {
    id: slug(item.id, `goal-${index + 1}`),
    category,
    title,
    description,
    status,
    progress,
    currentLabel,
    lastUpdated,
  };
}

function ledgerEntry(value: unknown): LedgerEntry | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<LedgerEntry>;
  const month = text(item.month, 30);
  const savedRupees = integerIn(item.savedRupees, 0, 100_000_000);
  const peopleImpacted = integerIn(item.peopleImpacted, 0, 1_000_000);
  if (!month || savedRupees === null || peopleImpacted === null) return null;
  return { month, savedRupees, peopleImpacted };
}

function race(value: unknown, index: number): Race | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<Race>;
  const name = text(item.name, 120);
  const shortName = text(item.shortName, 50);
  const location = text(item.location, 100);
  const raceDate = date(item.date);
  const registrationStatus = text(item.registrationStatus, 80);
  const officialUrl = text(item.officialUrl, 500);
  const note = text(item.note, 240);
  const distanceKm = numberIn(item.distanceKm, 0.1, 1_000);
  const status = raceStatuses.has(item.status as RaceStatus) ? (item.status as RaceStatus) : null;
  if (
    !name ||
    !shortName ||
    !location ||
    !raceDate ||
    !registrationStatus ||
    !officialUrl ||
    !note ||
    distanceKm === null ||
    !status
  )
    return null;
  try {
    const url = new URL(officialUrl);
    if (url.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return {
    slug: slug(item.slug, `race-${index + 1}`),
    name,
    shortName,
    distanceKm,
    location,
    date: raceDate,
    status,
    registrationStatus,
    officialUrl,
    note,
  };
}

export function parseSiteContent(value: unknown): SiteContent | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<SiteContent>;
  if (!input.runningSnapshot || typeof input.runningSnapshot !== "object") return null;

  const distanceKm = numberIn(input.runningSnapshot.distanceKm, 0, 1_000_000);
  const asOf = date(input.runningSnapshot.asOf);
  const habits = Array.isArray(input.habits) ? input.habits.map(habit) : [];
  const goals = Array.isArray(input.goals) ? input.goals.map(goal) : [];
  const ledger = Array.isArray(input.ledger) ? input.ledger.map(ledgerEntry) : [];
  const inputVersion = input.version === 2 ? 2 : 1;
  const races = Array.isArray(input.races) ? input.races.map(race) : [];

  // Version 2 adds Hritik's completed HYROX Delhi race to existing version 1 Blob snapshots.
  // Once an owner saves version 2, the race can still be edited or deleted normally.
  if (inputVersion < 2 && !races.some((item) => item?.slug === hyroxDelhi2026.slug)) {
    races.push(structuredClone(hyroxDelhi2026));
  }

  if (
    distanceKm === null ||
    !asOf ||
    habits.length > 30 ||
    goals.length > 30 ||
    ledger.length > 60 ||
    races.length > 30 ||
    habits.some((item) => item === null) ||
    goals.some((item) => item === null) ||
    ledger.some((item) => item === null) ||
    races.some((item) => item === null)
  ) {
    return null;
  }

  const unique = (items: Array<{ id?: string; slug?: string }>) => {
    const keys = items.map((item) => item.id ?? item.slug ?? "");
    return new Set(keys).size === keys.length;
  };
  if (!unique(habits as Habit[]) || !unique(goals as PublicGoal[]) || !unique(races as Race[]))
    return null;

  return {
    version: 2,
    updatedAt: new Date().toISOString(),
    runningSnapshot: { distanceKm, asOf },
    ledger: ledger as LedgerEntry[],
    habits: habits as Habit[],
    goals: goals as PublicGoal[],
    races: (races as Race[]).sort((a, b) => a.date.localeCompare(b.date)),
  };
}
