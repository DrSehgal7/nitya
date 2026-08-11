"use client";

import { ArrowUpRight, Coffee } from "lucide-react";
import { useState } from "react";
import { site } from "@/data/site";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="contactForm"
      action={`https://formsubmit.co/${site.email}`}
      method="post"
      onSubmit={() => setSubmitting(true)}
    >
      <input type="hidden" name="_subject" value="A new note from the Nitya website" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={`${site.siteUrl}/thanks/`} />
      <input className="honeyField" type="text" name="_honey" tabIndex={-1} autoComplete="off" />

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
          <span>Your email</span>
          <input name="email" type="email" autoComplete="email" maxLength={120} required />
        </label>
      </div>

      <label>
        <span>
          Instagram <small>optional</small>
        </span>
        <input name="instagram" type="text" maxLength={80} placeholder="@your_handle" />
      </label>

      <label>
        <span>What brings you here?</span>
        <select name="interest" defaultValue="" required>
          <option value="" disabled>
            Pick one
          </option>
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
          name="message"
          rows={5}
          maxLength={1200}
          placeholder="A few lines is plenty."
          required
        />
      </label>

      <label className="consentField">
        <input type="checkbox" name="consent" required />
        <span>I&apos;m happy for Hritik to use these details to reply.</span>
      </label>

      <button className="button buttonPrimary buttonWide" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send my note"}
        {!submitting && <ArrowUpRight size={17} aria-hidden="true" />}
      </button>
      <p className="formFinePrint">
        Delivered through FormSubmit. Prefer direct contact? Email {site.email}.
      </p>
    </form>
  );
}
