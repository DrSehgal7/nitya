const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelSiteUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ?? process.env.VERCEL_URL?.trim();

const configuredUrlIsLocal = configuredSiteUrl
  ? /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(configuredSiteUrl)
  : false;

const safeConfiguredSiteUrl =
  process.env.NODE_ENV === "production" && configuredUrlIsLocal ? undefined : configuredSiteUrl;

const siteUrl = (
  safeConfiguredSiteUrl ||
  (vercelSiteUrl ? `https://${vercelSiteUrl}` : undefined) ||
  "https://nitya-project.vercel.app"
).replace(/\/$/, "");

export const site = {
  name: "Nitya",
  devanagariName: "नित्य",
  tagline: "A small daily mission",
  founder: "Hritik सरोच",
  email: "sarojhritik@gmail.com",
  instagramUrl: "https://www.instagram.com/hritik_saroch/",
  instagramHandle: "@hritik_saroch",
  stravaUrl: "https://www.strava.com/athletes/127677454",
  repositoryUrl: "https://github.com/DrSehgal7/nitya",
  siteUrl,
} as const;
