export const site = {
  name: "Nitya",
  devanagariName: "नित्य",
  tagline: "A small daily mission",
  founder: "Hritik सरोच",
  email: "hritiksaroch@gmail.com",
  instagramUrl: "https://www.instagram.com/hritik_saroch/",
  instagramHandle: "@hritik_saroch",
  stravaUrl: "https://www.strava.com/athletes/127677454",
  repositoryUrl: "https://github.com/DrSehgal7/nitya",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;
