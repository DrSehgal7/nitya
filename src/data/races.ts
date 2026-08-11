export type RaceStatus = "confirmed" | "considering";

export interface Race {
  slug: string;
  name: string;
  shortName: string;
  distanceKm: number;
  location: string;
  date: string;
  status: RaceStatus;
  registrationStatus: string;
  officialUrl: string;
  note: string;
}

export function validateRaceCalendar(calendar: Race[]): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const [index, race] of calendar.entries()) {
    if (slugs.has(race.slug)) errors.push(`Race ${index + 1} has a duplicate slug: ${race.slug}`);
    slugs.add(race.slug);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(race.date) || Number.isNaN(Date.parse(race.date))) {
      errors.push(`Race ${race.slug} has an invalid ISO date.`);
    }
    if (race.distanceKm <= 0) errors.push(`Race ${race.slug} must have a positive distance.`);
    if (!race.officialUrl.startsWith("https://")) {
      errors.push(`Race ${race.slug} must link to an HTTPS official URL.`);
    }
  }

  for (let index = 1; index < calendar.length; index += 1) {
    const previousRace = calendar[index - 1];
    const currentRace = calendar[index];
    if (previousRace && currentRace && previousRace.date > currentRace.date) {
      errors.push("Race calendar must be ordered by date.");
      break;
    }
  }

  return errors;
}

export const races: Race[] = [
  {
    slug: "ladakh-marathon-2026",
    name: "Ladakh Marathon",
    shortName: "Ladakh",
    distanceKm: 42.195,
    location: "Leh, Ladakh",
    date: "2026-09-13",
    status: "confirmed",
    registrationStatus: "On my calendar",
    officialUrl: "https://ladakhmarathon.com/races/marathon/",
    note: "The high-altitude one.",
  },
  {
    slug: "vedanta-delhi-half-2026",
    name: "Vedanta Delhi Half Marathon",
    shortName: "Delhi Half",
    distanceKm: 21.097,
    location: "New Delhi",
    date: "2026-10-18",
    status: "confirmed",
    registrationStatus: "On my calendar",
    officialUrl:
      "https://vedantadelhihalfmarathon.procam.in/race-categories/half-marathon/information",
    note: "A fast 21K through Delhi.",
  },
  {
    slug: "tata-steel-world-25k-2026",
    name: "Tata Steel World 25K",
    shortName: "Kolkata 25K",
    distanceKm: 25,
    location: "Kolkata",
    date: "2026-12-20",
    status: "confirmed",
    registrationStatus: "On my calendar",
    officialUrl: "https://tatasteelworld25k.procam.in/",
    note: "The bridge between half and full.",
  },
  {
    slug: "tata-mumbai-marathon-2027",
    name: "Tata Mumbai Marathon",
    shortName: "Mumbai",
    distanceKm: 42.195,
    location: "Mumbai",
    date: "2027-01-17",
    status: "confirmed",
    registrationStatus: "On my calendar",
    officialUrl: "https://tatamumbaimarathon.procam.in/",
    note: "The full marathon finale.",
  },
];

const raceErrors = validateRaceCalendar(races);
if (raceErrors.length > 0) {
  throw new Error(`Invalid race calendar:\n${raceErrors.join("\n")}`);
}

export const raceIdeas = [
  {
    name: "TCS World 10K Bengaluru",
    date: "2027-04-25",
    reason: "A shorter, speed-focused target after the marathon block.",
    officialUrl: "https://tcsworld10k.procam.in/",
  },
];
