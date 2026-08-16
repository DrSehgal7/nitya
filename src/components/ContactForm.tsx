"use client";

import { ArrowUpRight, Coffee } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { site } from "@/data/site";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  async function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          instagram: formData.get("instagram"),
          interest: formData.get("interest"),
          note: formData.get("note"),
          website: formData.get("website"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to send your note.");
      formRef.current?.reset();
      setStatus({
        kind: "success",
        message: "Thanks—your note is now in Hritik’s private inbox.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your note could not be saved. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} className="contactForm" onSubmit={(event) => void submitNote(event)}>
      <input className="honeyField" type="text" name="website" tabIndex={-1} autoComplete="off" />

      <div className="formHeading">
        <span className="iconTile" aria-hidden="true">
          <Coffee size={20} strokeWidth={1.8} />
        </span>
        <div>
          <h3>Leave a note</h3>
          <p>Ideas, skills, runs, or coffee.</p>
        </div>
      </div>

      <div className="fieldGrid">
        <label>
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" maxLength={80} required />
        </label>
        <label>
          <span>
            Your email <small>optional</small>
          </span>
          <input name="email" type="email" autoComplete="email" maxLength={120} />
        </label>
      </div>

      <label>
        <span>
          Instagram <small>optional</small>
        </span>
        <input name="instagram" type="text" maxLength={80} placeholder="@your_handle" />
      </label>

      <label>
        <span>
          What brings you here? <small>optional</small>
        </span>
        <select name="interest" defaultValue="">
          <option value="">Choose if useful</option>
          <option>Help with Nitya</option>
          <option>Offer a skill</option>
          <option>Join a run</option>
          <option>Suggest a race</option>
          <option>Coffee or a chat</option>
          <option>Something else</option>
        </select>
      </label>

      <label>
        <span>Your note</span>
        <textarea
          name="note"
          rows={5}
          maxLength={1200}
          placeholder="A few lines is plenty."
          required
        />
      </label>

      <p className="formPrivacyNote">
        By sending, you&apos;re happy for Hritik to use these details only to read and reply to your
        note.
      </p>

      <button className="button buttonPrimary buttonWide" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send my note"}
        {!submitting && <ArrowUpRight size={17} aria-hidden="true" />}
      </button>
      {status && (
        <p className={`contactFormStatus contactFormStatus--${status.kind}`} role="status">
          {status.message}
        </p>
      )}
      <p className="formFinePrint">
        Saved privately for Hritik to review in the owner inbox. Prefer direct contact? Email{" "}
        {site.email}.
      </p>
    </form>
  );
}
