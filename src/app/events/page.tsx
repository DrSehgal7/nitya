import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flag } from "lucide-react";
import { RaceIdeasBoard } from "@/components/RaceIdeasBoard";
import { RaceTrail } from "@/components/RaceTrail";
import { SectionMotion } from "@/components/SectionMotion";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events and challenges",
  description:
    "Hritik's optional events, races and personal challenges—kept separate from Nitya's impact mission.",
};

export default async function EventsPage() {
  const { races } = await getSiteContent();

  return (
    <main id="main-content" className="subpageMain">
      <section className="subpageHero motionHost">
        <SectionMotion />
        <SectionMotion persistent />
        <div className="shell subpageHeroInner">
          <Link className="subpageBackLink" href="/">
            <ArrowLeft size={16} aria-hidden="true" /> Back to Nitya
          </Link>
          <span className="subpageHeroIcon" aria-hidden="true">
            <Flag size={24} />
          </span>
          <p className="sectionSticker">🏁 Optional side quests</p>
          <p className="eyebrow">Events and challenges</p>
          <h1>Personal checkpoints, separate from the mission.</h1>
          <p className="subpageLead">
            I keep events here for fun and personal accountability. They do not fund or measure
            Nitya. The project&apos;s purpose remains practical help for people.
          </p>
        </div>
      </section>

      <nav className="subpageSectionNav" aria-label="Event page sections">
        <div className="shell">
          <a href="#event-calendar">My event calendar</a>
          <a href="#event-ideas">Suggest an event</a>
        </div>
      </nav>

      <section
        className="section raceTrailPageSection"
        id="event-calendar"
        aria-label="Hritik's event calendar"
      >
        <div className="shell">
          <RaceTrail races={races} />
        </div>
      </section>

      <section className="section raceIdeasSection motionHost" id="event-ideas">
        <SectionMotion />
        <div className="shell">
          <div>
            <p className="sectionSticker">💡 Community ideas</p>
            <p className="eyebrow">What should I try next?</p>
            <h2 className="artifactSectionTitle">
              Suggest an event, challenge or weirdly fun idea.
            </h2>
            <p>
              This is the playful corner of the site. Add a trail, race, community event or
              challenge. A Google account gets one vote per idea, and selecting your vote again
              removes it.
            </p>
          </div>
          <RaceIdeasBoard />
        </div>
      </section>
    </main>
  );
}
