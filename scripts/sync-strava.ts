import { rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSnapshot, type StravaApiActivity } from "../src/lib/strava";
import { site } from "../src/data/site";

interface TokenResponse {
  access_token?: string;
}

const clientId = process.env.STRAVA_CLIENT_ID?.trim();
const clientSecret = process.env.STRAVA_CLIENT_SECRET?.trim();
const refreshToken = process.env.STRAVA_REFRESH_TOKEN?.trim();

async function refreshAccessToken(): Promise<string> {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId ?? "",
      client_secret: clientSecret ?? "",
      grant_type: "refresh_token",
      refresh_token: refreshToken ?? "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Strava token refresh failed with HTTP ${response.status}.`);
  }

  const token = (await response.json()) as TokenResponse;
  if (!token.access_token) throw new Error("Strava did not return an access token.");
  return token.access_token;
}

async function fetchActivities(accessToken: string): Promise<StravaApiActivity[]> {
  const yearStartSeconds = Math.floor(Date.UTC(new Date().getUTCFullYear(), 0, 1) / 1000);
  const activities: StravaApiActivity[] = [];

  for (let page = 1; page <= 20; page += 1) {
    const parameters = new URLSearchParams({
      after: String(yearStartSeconds),
      page: String(page),
      per_page: "200",
    });
    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?${parameters}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Strava activity request failed with HTTP ${response.status}.`);
    }

    const pageActivities = (await response.json()) as StravaApiActivity[];
    activities.push(...pageActivities);
    if (pageActivities.length === 0) break;
  }

  return activities;
}

async function writeSnapshot(activities: StravaApiActivity[]): Promise<void> {
  const snapshot = createSnapshot(activities, site.stravaUrl);
  const outputPath = path.join(process.cwd(), "src/data/strava.generated.json");
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporaryPath, outputPath);
  console.log(`Strava snapshot updated with ${snapshot.activities.length} public runs.`);
}

async function main(): Promise<void> {
  if (!clientId || !clientSecret || !refreshToken) {
    console.log("Strava sync skipped: API credentials are not configured.");
    return;
  }

  const accessToken = await refreshAccessToken();
  const activities = await fetchActivities(accessToken);
  await writeSnapshot(activities);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown Strava sync error.";
  console.warn(`${message} Keeping the last successful snapshot.`);
});
