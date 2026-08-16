import "server-only";

import { del, get, list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import type { ContactSubmission } from "@/types/content";
import type { ContactSubmissionInput } from "@/lib/contact-validation";

const CONTACT_PREFIX = "nitya-content/contact-submissions/";

const localContactState = globalThis as typeof globalThis & {
  __nityaContactSubmissions?: ContactSubmission[];
};

function blobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN,
  );
}

function parseSubmission(value: unknown): ContactSubmission | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<ContactSubmission>;
  const optionalValuesValid = [item.email, item.instagram, item.interest].every(
    (field) => field === null || typeof field === "string",
  );
  if (
    typeof item.id !== "string" ||
    typeof item.name !== "string" ||
    typeof item.note !== "string" ||
    typeof item.submittedAt !== "string" ||
    !optionalValuesValid
  ) {
    return null;
  }
  return {
    id: item.id,
    name: item.name,
    email: item.email ?? null,
    instagram: item.instagram ?? null,
    interest: item.interest ?? null,
    note: item.note,
    submittedAt: item.submittedAt,
  };
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (!blobConfigured()) {
    return process.env.NODE_ENV === "production"
      ? []
      : structuredClone(localContactState.__nityaContactSubmissions ?? []);
  }

  const result = await list({ prefix: CONTACT_PREFIX, limit: 1000 });
  const submissions = await Promise.all(
    result.blobs.map(async (blob) => {
      try {
        const response = await get(blob.pathname, { access: "private", useCache: false });
        if (!response || response.statusCode !== 200) return null;
        return parseSubmission(JSON.parse(await new Response(response.stream).text()) as unknown);
      } catch (error) {
        console.error(`Unable to read contact message ${blob.pathname}.`, error);
        return null;
      }
    }),
  );

  return submissions
    .filter((item): item is ContactSubmission => Boolean(item))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function saveContactSubmission(
  input: ContactSubmissionInput,
): Promise<ContactSubmission> {
  const submission: ContactSubmission = {
    ...input,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  if (!blobConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Private message storage is not configured.");
    }
    localContactState.__nityaContactSubmissions = [
      submission,
      ...(localContactState.__nityaContactSubmissions ?? []),
    ];
    return submission;
  }

  await put(`${CONTACT_PREFIX}${Date.now()}-${submission.id}.json`, JSON.stringify(submission), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  });
  return submission;
}

export async function deleteContactSubmission(id: string): Promise<void> {
  if (!blobConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Private message storage is not configured.");
    }
    localContactState.__nityaContactSubmissions = (
      localContactState.__nityaContactSubmissions ?? []
    ).filter((submission) => submission.id !== id);
    return;
  }

  const result = await list({ prefix: CONTACT_PREFIX, limit: 1000 });
  const target = result.blobs.find((blob) => blob.pathname.endsWith(`-${id}.json`));
  if (!target) throw new Error("That message no longer exists.");
  await del(target.url);
}
