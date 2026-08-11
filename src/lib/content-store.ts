import "server-only";

import { get, list, put } from "@vercel/blob";
import { cache } from "react";
import { goals, habits, ledger, runningSnapshot } from "@/data/content";
import { races } from "@/data/races";
import { parseSiteContent } from "@/lib/content-validation";
import type { SiteContent } from "@/types/content";

const CONTENT_PREFIX = "nitya-content/site-content-";

export function defaultSiteContent(): SiteContent {
  return structuredClone({
    version: 1,
    updatedAt: "2026-08-11T00:00:00.000Z",
    runningSnapshot,
    ledger,
    habits,
    goals,
    races,
  });
}

function blobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN,
  );
}

async function readLatest(): Promise<SiteContent | null> {
  if (!blobConfigured()) return null;
  const result = await list({ prefix: CONTENT_PREFIX, limit: 100 });
  const latest = result.blobs.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )[0];
  if (!latest) return null;
  const response = await get(latest.pathname, { access: "private", useCache: false });
  if (!response || response.statusCode !== 200) return null;
  const parsed = JSON.parse(await new Response(response.stream).text()) as unknown;
  return parseSiteContent(parsed);
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    return (await readLatest()) ?? defaultSiteContent();
  } catch (error) {
    console.error("Unable to read Nitya content from Blob; using checked-in defaults.", error);
    return defaultSiteContent();
  }
});

export async function saveSiteContent(value: unknown): Promise<SiteContent> {
  const content = parseSiteContent(value);
  if (!content) throw new Error("The submitted content is invalid.");
  if (!blobConfigured())
    throw new Error("Private Blob storage is not configured for this environment.");

  const timestamp = Date.now();
  await put(`${CONTENT_PREFIX}${timestamp}.json`, JSON.stringify(content), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 60,
  });
  return content;
}
