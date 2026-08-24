import type { Habit, LedgerEntry, PublicGoal } from "@/data/content";
import type { Race } from "@/data/races";

export interface RunningSnapshot {
  distanceKm: number;
  asOf: string;
}

export interface SiteContent {
  version: 3;
  updatedAt: string;
  runningSnapshot: RunningSnapshot;
  ledger: LedgerEntry[];
  habits: Habit[];
  goals: PublicGoal[];
  races: Race[];
}

export type RaceIdeaType = "trail" | "road" | "hyrox" | "ultra" | "triathlon" | "fun";

export interface StoredRaceIdea {
  id: string;
  creatorId: string;
  voterIds: string[];
  name: string;
  location: string;
  type: RaceIdeaType;
  createdAt: string;
}

export interface PublicRaceIdea {
  id: string;
  name: string;
  location: string;
  type: RaceIdeaType;
  votes: number;
  hasVoted: boolean;
  canDelete: boolean;
}

export interface OwnerRaceIdea {
  id: string;
  name: string;
  location: string;
  type: RaceIdeaType;
  votes: number;
  createdAt: string;
}

export interface HabitJoinSummary {
  habitId: string;
  participantCount: number;
  joined: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string | null;
  instagram: string | null;
  interest: string | null;
  note: string;
  submittedAt: string;
}
