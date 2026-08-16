export const challengeHabits = [
  {
    id: "plan-food-better",
    icon: "🍱",
    title: "Plan food better",
    text: "Order less randomly without making food boring.",
    saved: 0,
    progress: 55,
    status: "In progress",
  },
  {
    id: "thirty-day-impulse-rule",
    icon: "🛍️",
    title: "30-day impulse rule",
    text: "Pause before buying things you probably don’t need.",
    saved: 0,
    progress: 10,
    status: "Yet to pick up",
  },
  {
    id: "use-cards-properly",
    icon: "💳",
    title: "Use cards properly",
    text: "Pay in full, avoid fees and actually use rewards.",
    saved: 0,
    progress: 70,
    status: "In progress",
  },
  {
    id: "train-consistently",
    icon: "🏃‍➡️",
    title: "Train consistently",
    text: "Run, lift and build routines that survive busy weeks.",
    saved: 0,
    progress: 62,
    status: "In progress",
  },
  {
    id: "fix-subscriptions",
    icon: "✂️",
    title: "Fix subscriptions",
    text: "Remove recurring things that add no real value.",
    saved: 0,
    progress: 5,
    status: "Yet to pick up",
  },
  {
    id: "your-own-habit",
    icon: "✨",
    title: "Your own habit",
    text: "Choose something that makes your life tangibly better.",
    saved: 0,
    progress: 0,
    status: "Yet to pick up",
  },
] as const;

export type ChallengeHabitId = (typeof challengeHabits)[number]["id"];

export const challengeHabitIds = new Set<string>(challengeHabits.map((habit) => habit.id));
