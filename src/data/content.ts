export type WorkStatus = "not-started" | "in-progress" | "done";

export interface Habit {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: WorkStatus;
  progress: number;
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
    title: "My money first",
    text: "The public ledger begins at ₹0. My savings and anything this project unlocks are added transparently.",
  },
  {
    title: "Giving stays optional",
    text: "Not a fundraiser. Join, build a habit, and give exactly ₹0—that is genuinely welcome.",
  },
  {
    title: "Your life counts first",
    text: "Stay dedicated and your health, money and work improve. The first life impacted is yours.",
  },
] as const;

export const initiatives = [
  {
    icon: "🌱",
    title: "Girl Child Future",
    description:
      "Create long-term financial security for a girl child in a way that is transparent, trackable and genuinely useful later in life.",
    goal: "Support a real future milestone, not just make a one-time donation.",
  },
  {
    icon: "📚",
    title: "Girl Child Education",
    description:
      "Support a child’s education in a way that can be measured by a class, academic year or eventually a longer education journey.",
    goal: "Make the impact easy to understand—who was supported, for what, and for how long.",
  },
  {
    icon: "🏃‍➡️",
    title: "Infra & Sports Building",
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
    progress: 55,
    savedRupees: 0,
    lastUpdated: "2026-08-11",
  },
  {
    id: "taxes",
    icon: "🧾",
    title: "File taxes like a grown-up",
    description: "Claim every deduction I’m owed, on time.",
    status: "in-progress",
    progress: 78,
    savedRupees: 0,
    lastUpdated: "2026-08-11",
  },
  {
    id: "clothes-rule",
    icon: "🛍️",
    title: "The 30-day clothes rule",
    description: "Wait 30 days before any non-essential buy.",
    status: "in-progress",
    progress: 55,
    savedRupees: 0,
    lastUpdated: "2026-08-11",
  },
  {
    id: "credit-card",
    icon: "💳",
    title: "Use the card, not the other way",
    description: "Pay in full, never carry a balance, bank rewards.",
    status: "in-progress",
    progress: 50,
    savedRupees: 0,
    lastUpdated: "2026-08-11",
  },
];

export const goals: PublicGoal[] = [
  {
    id: "run-1000-km",
    category: "Body",
    title: "Run 1,000 km this year",
    description: "Public Strava runs update this goal during each site sync.",
    status: "in-progress",
    progress: 0,
    currentLabel: "0.0 / 1,000 km. Strava will update this after the first successful sync.",
    lastUpdated: "2026-08-11",
  },
  {
    id: "deadlift-140",
    category: "Body",
    title: "Deadlift 140 kg",
    description: "Build strength steadily without letting the running disappear.",
    status: "in-progress",
    progress: 87,
    currentLabel: "122 / 140 kg",
    lastUpdated: "2026-08-11",
  },
  {
    id: "ship-nitya",
    category: "Craft",
    title: "Ship Nitya properly",
    description: "This page → a real, public ledger next.",
    status: "in-progress",
    progress: 40,
    currentLabel: "Visual direction and production wiring in progress",
    lastUpdated: "2026-08-11",
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
  },
];

export function statusLabel(status: WorkStatus): string {
  if (status === "done") return "Done";
  if (status === "in-progress") return "In progress";
  return "Yet to pick up";
}
