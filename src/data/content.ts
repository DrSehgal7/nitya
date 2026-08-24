export type WorkStatus = "not-started" | "in-progress" | "done";
export type HabitStatus = WorkStatus | "building" | "maintaining" | "paused";

export interface GoalSubgoal {
  id: string;
  title: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: HabitStatus;
  savedRupees: number | null;
  lastUpdated: string;
}

export interface PublicGoal {
  id: string;
  category: "Body" | "Craft" | "Money";
  title: string;
  description: string;
  status: WorkStatus;
  progress: number;
  currentLabel: string;
  lastUpdated: string;
  subgoals: GoalSubgoal[];
}

export interface LedgerEntry {
  month: string;
  savedRupees: number;
  peopleImpacted: number;
}

// Owner-managed monthly history. Public totals and charts derive only from savings and people
// impacted; the private ₹X commitment is deliberately excluded.
export const ledger: LedgerEntry[] = [
  {
    month: "Aug 2026",
    savedRupees: 0,
    peopleImpacted: 0,
  },
];

export const project = {
  startedOn: "2026-08-12",
  firstImpactGoal: 100,
  verifiedLives: ledger.reduce((total, entry) => total + entry.peopleImpacted, 0) as number | null,
  baselinePledge: null as number | null,
} as const;

// Update these after your weekend run. A connected Strava sync takes precedence automatically.
export const runningSnapshot = {
  distanceKm: 0,
  asOf: "2026-08-10",
} as const;

export const principles = [
  {
    title: "I commit first",
    text: "A real baseline amount—shown publicly as ₹X—is already committed by me.",
  },
  {
    title: "Better habits add more",
    text: "I track genuine savings from reducing waste and can add that value on top of my baseline.",
  },
  {
    title: "Your participation is optional",
    text: "Join a habit, offer a skill or simply follow along. No donation is required.",
  },
] as const;

export const initiatives = [
  {
    icon: "🌱",
    title: "A girl child’s future fund",
    description:
      "Create long-term financial security for a girl child in a way that is transparent, trackable and genuinely useful later in life.",
    goal: "Support a real future milestone, not just make a one-time donation.",
  },
  {
    icon: "📚",
    title: "A girl child’s education",
    description:
      "Support a child’s education in a way that can be measured by a class, academic year or eventually a longer education journey.",
    goal: "Make the impact easy to understand—who was supported, for what, and for how long.",
  },
  {
    icon: "🏃‍➡️",
    title: "Sports access for children",
    description:
      "Help underprivileged kids get better access to sports through equipment, training spaces, coaching opportunities or basic infrastructure.",
    goal: "Translate money into visible access—equipment, hours, children or facilities improved.",
  },
] as const;

export const habits: Habit[] = [
  {
    id: "food",
    icon: "🍱",
    title: "Eat what I actually need",
    description: "Plan the week, skip the impulse food orders.",
    status: "in-progress",
    savedRupees: 0,
    lastUpdated: "2026-08-11",
  },
  {
    id: "taxes",
    icon: "🧾",
    title: "File taxes like a grown-up",
    description: "Claim every deduction I’m owed, on time.",
    status: "in-progress",
    savedRupees: 0,
    lastUpdated: "2026-08-11",
  },
  {
    id: "clothes-rule",
    icon: "🛍️",
    title: "The 30-day clothes rule",
    description: "Wait 30 days before any non-essential buy.",
    status: "in-progress",
    savedRupees: 0,
    lastUpdated: "2026-08-11",
  },
  {
    id: "credit-card",
    icon: "💳",
    title: "Use the card, not the other way",
    description: "Pay in full, never carry a balance, bank rewards.",
    status: "in-progress",
    savedRupees: 0,
    lastUpdated: "2026-08-11",
  },
];

export const goals: PublicGoal[] = [
  {
    id: "run-1000-km",
    category: "Body",
    title: "Run 1,000 km this year",
    description: "A personal consistency goal, separate from Nitya's public impact work.",
    status: "in-progress",
    progress: 0,
    currentLabel: "0.0 / 1,000 km. Strava will update this after the first successful sync.",
    lastUpdated: "2026-08-11",
    subgoals: [
      { id: "run-250", title: "Run 250 km", completed: false },
      { id: "run-500", title: "Run 500 km", completed: false },
      { id: "run-750", title: "Run 750 km", completed: false },
      { id: "run-1000", title: "Run 1,000 km", completed: false },
    ],
  },
  {
    id: "deadlift-140",
    category: "Body",
    title: "Deadlift 150 kg",
    description: "A personal strength goal, separate from Nitya's public impact work.",
    status: "in-progress",
    progress: 87,
    currentLabel: "Building towards 150 kg",
    lastUpdated: "2026-08-11",
    subgoals: [
      { id: "deadlift-120", title: "Deadlift 120 kg", completed: true },
      { id: "deadlift-130", title: "Deadlift 130 kg", completed: true },
      { id: "deadlift-140", title: "Deadlift 140 kg", completed: false },
      { id: "deadlift-150", title: "Deadlift 150 kg", completed: false },
    ],
  },
  {
    id: "ship-nitya",
    category: "Craft",
    title: "Ship Nitya properly",
    description:
      "Turn this early website into a reliable public record of savings, activity and impact.",
    status: "in-progress",
    progress: 40,
    currentLabel: "Visual direction and production wiring in progress",
    lastUpdated: "2026-08-11",
    subgoals: [
      { id: "nitya-design", title: "Finish the public design", completed: true },
      { id: "nitya-owner", title: "Launch private owner controls", completed: true },
      { id: "nitya-ledger", title: "Publish the first real impact ledger", completed: false },
    ],
  },
  {
    id: "safety-net",
    category: "Money",
    title: "Six-month safety net",
    description: "Giving should never put my own plans at risk.",
    status: "not-started",
    progress: 70,
    currentLabel: "Progress",
    lastUpdated: "2026-08-11",
    subgoals: [
      { id: "safety-1", title: "Build a one-month buffer", completed: true },
      { id: "safety-3", title: "Build a three-month buffer", completed: false },
      { id: "safety-6", title: "Build a six-month buffer", completed: false },
    ],
  },
];

export function statusLabel(status: WorkStatus | HabitStatus): string {
  if (status === "done") return "Done";
  if (status === "in-progress") return "In progress";
  if (status === "building") return "Building";
  if (status === "maintaining") return "Maintaining";
  if (status === "paused") return "Paused";
  return "Yet to pick up";
}

export function goalStatusFromSubgoals(
  subgoals: GoalSubgoal[],
  fallback: WorkStatus = "not-started",
): WorkStatus {
  if (subgoals.length === 0) return fallback;
  const completed = subgoals.filter((subgoal) => subgoal.completed).length;
  if (completed === subgoals.length) return "done";
  if (completed > 0) return "in-progress";
  return fallback === "in-progress" ? "in-progress" : "not-started";
}

export function goalProgressFromSubgoals(subgoals: GoalSubgoal[], fallback = 0): number {
  if (subgoals.length === 0) return fallback;
  return Math.round(
    (subgoals.filter((subgoal) => subgoal.completed).length / subgoals.length) * 100,
  );
}
