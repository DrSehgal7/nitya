import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main id="main-content" className="prosePage">
      <p className="eyebrow">Plain-language privacy</p>
      <h1>Small site, small data footprint.</h1>
      <p>
        Nitya does not use advertising trackers or analytics. The spending exercise runs entirely in
        your browser and its figures are not stored or transmitted.
      </p>

      <h2>Contact form</h2>
      <p>
        If you submit the contact form, the name, email, Instagram handle, interest, and message you
        choose to provide are sent through FormSubmit to {site.email}. They are used only to reply
        to you. You can email that address to ask for your message to be deleted.
      </p>

      <h2>Strava</h2>
      <p>
        The race page displays a build-time snapshot of Hritik&apos;s public running activities. It
        does not expose maps, heart rate, private activities, or Strava credentials. Visiting the
        embedded links takes you to Strava, where Strava&apos;s own privacy terms apply.
      </p>

      <h2>External links</h2>
      <p>
        Links to Instagram, Strava, GitHub, FormSubmit, and race organisers take you to services
        with their own privacy practices. Nitya cannot control those services.
      </p>
    </main>
  );
}
