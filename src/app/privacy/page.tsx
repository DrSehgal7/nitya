import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main id="main-content" className="prosePage">
      <p className="eyebrow">Plain-language privacy</p>
      <h1>Small site, small data footprint.</h1>
      <p>
        Nitya does not use advertising trackers or analytics. The money-leaks section is currently
        an informational preview and does not collect financial information.
      </p>

      <h2>Contact form</h2>
      <p>
        If you submit the contact form, your name and note are saved in Nitya&apos;s private Vercel
        Blob storage. Email, Instagram handle, and reason for writing are optional. Only Hritik can
        open the private owner inbox, and the details are used only to read and reply to your note.
        You can email {site.email} to ask for your message to be deleted.
      </p>

      <h2>Strava</h2>
      <p>
        Nitya currently shows a total that Hritik updates manually from his public running record.
        If automatic Strava sync is enabled later, the site will show only the public activity data
        needed for the running total. It will not expose maps, heart rate, private activities, or
        Strava credentials. Visiting a Strava link takes you to Strava, where its own privacy terms
        apply.
      </p>

      <h2>Google sign-in and participation</h2>
      <p>
        Google sign-in is used to keep event-idea votes and habit participation to one action per
        account. Nitya does not store your Google email in its participation records. It converts
        the email into a private, non-reversible identifier, stores that identifier in private
        Vercel Blob storage, and publicly displays only aggregate vote and participant counts.
      </p>

      <h2>External links</h2>
      <p>
        Links to Instagram, Strava, GitHub, and event organisers take you to services with their own
        privacy practices. Nitya cannot control those services.
      </p>
    </main>
  );
}
