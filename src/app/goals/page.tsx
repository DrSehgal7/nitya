import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import { PublicGoals } from "@/components/PublicGoals";
import { SectionMotion } from "@/components/SectionMotion";
import stravaRaw from "@/data/strava.generated.json";
import { getSiteContent } from "@/lib/content-store";
import type { StravaSnapshot } from "@/types/strava";

const strava = stravaRaw as StravaSnapshot;

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Personal goals",
  description:
    "Hritik's personal side goals and milestones—kept separate from Nitya's public impact record.",
};

export default async function GoalsPage() {
  const { goals, runningSnapshot } = await getSiteContent();
  const runningDistance = strava.connected ? strava.stats.distanceKm : runningSnapshot.distanceKm;

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
            <Target size={24} />
          </span>
          <p className="sectionSticker">🎯 Personal side goals</p>
          <p className="eyebrow">Accountability, not impact</p>
          <h1>Side goals I&apos;m tracking in public.</h1>
          <p className="subpageLead">
            These are my larger personal goals—from running 1,000 km to building financial safety.
            They keep me accountable and make the person behind Nitya visible. They are not a
            workout service, and completing them does not count as helping someone. Confirmed help
            is recorded separately on the Nitya homepage.
          </p>
        </div>
      </section>

      <section className="section publicGoalsPageSection standaloneExperience motionHost">
        <SectionMotion />
        <PublicGoals goals={goals} runningDistance={runningDistance} />
      </section>
    </main>
  );
}
