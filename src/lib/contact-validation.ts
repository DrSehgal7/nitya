import type { ContactSubmission } from "@/types/content";

export type ContactSubmissionInput = Omit<ContactSubmission, "id" | "submittedAt">;

export type ContactValidationResult =
  { ok: true; data: ContactSubmissionInput } | { ok: false; error: string };

function cleanSingleLine(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim().replace(/\s+/g, " ");
  return clean && clean.length <= maxLength ? clean : null;
}

function cleanOptional(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null || value === "") return null;
  return cleanSingleLine(value, maxLength);
}

export function validateContactSubmission(value: unknown): ContactValidationResult {
  if (!value || typeof value !== "object") {
    return { ok: false, error: "Please provide your name and note." };
  }

  const input = value as Record<string, unknown>;
  const name = cleanSingleLine(input.name, 80);
  if (!name) return { ok: false, error: "Please enter your name (up to 80 characters)." };

  const note = typeof input.note === "string" ? input.note.trim() : "";
  if (!note || note.length > 1200) {
    return { ok: false, error: "Please enter a note of up to 1,200 characters." };
  }

  const email = cleanOptional(input.email, 120);
  if (input.email && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return { ok: false, error: "Enter a valid email address or leave it blank." };
  }

  const instagram = cleanOptional(input.instagram, 80);
  if (input.instagram && !instagram) {
    return { ok: false, error: "Instagram must be 80 characters or fewer." };
  }

  const interest = cleanOptional(input.interest, 80);
  if (input.interest && !interest) {
    return { ok: false, error: "The selected reason is not valid." };
  }

  return {
    ok: true,
    data: { name, email, instagram, interest, note },
  };
}
