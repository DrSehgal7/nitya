import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flag } from "lucide-react";
import { RaceIdeasBoard } from "@/components/RaceIdeasBoard";
import { RaceTrail } from "@/components/RaceTrail";
import { SectionMotion } from "@/components/SectionMotion";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Race calendar",
  description:
    "Follow Hritik's race calendar, see every checkpoint, and suggest the next race or challenge.",
};

export default async function RacesPage() {
  const { races } = await getSiteContent();

  return (
    <main id="main-content" className="subpageMain">
      <SectionMotion persistent />
      <section className="subpageHero motionHost">
        <SectionMotion />
        <div className="shell subpageHeroInner">
          <Link className="subpageBackLink" href="/">
            <ArrowLeft size={16} aria-hidden="true" /> Back to Nitya
          </Link>
          <span className="subpageHeroIcon" aria-hidden="true">
            <Flag size={24} />
          </span>
          <p className="sectionSticker">🏁 Next on the start line</p>
          <p className="eyebrow">My race calendar</p>
          <h1>One trail. Every race a checkpoint.</h1>
          <p className="subpageLead">
            Follow what I have finished, what I am training for and the exact countdown to the next
            start line—then help me choose what comes after it.
          </p>
        </div>
      </section>

      <nav className="subpageSectionNav" aria-label="Race page sections">
        <div className="shell">
          <a href="#race-calendar">Race calendar</a>
          <a href="#race-ideas">Suggest the next race</a>
        </div>
      </nav>

      <section
        className="section raceTrailPageSection"
        id="race-calendar"
        aria-label="Hritik's race calendar"
      >
        <div className="shell">
          <RaceTrail races={races} />
        </div>
      </section>

      <section className="section raceIdeasSection motionHost" id="race-ideas">
        <SectionMotion />
        <div className="shell">
          <div>
            <p className="sectionSticker">🏁 Community checkpoints</p>
            <p className="eyebrow">What should I race next?</p>
            <h2 className="artifactSectionTitle">Suggest a race, challenge or weirdly fun idea.</h2>
            <p>
              Think I&apos;m missing a cool trail, hybrid race, ultra, city run or slightly
              questionable challenge? Add it. People can vote and the most interesting ideas rise to
              the top.
            </p>
          </div>
          <RaceIdeasBoard />
        </div>
      </section>
    </main>
  );
}
