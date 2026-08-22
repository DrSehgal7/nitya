import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import { PublicGoals } from "@/components/PublicGoals";
import { SectionMotion } from "@/components/SectionMotion";
import { project } from "@/data/content";
import stravaRaw from "@/data/strava.generated.json";
import { getSiteContent } from "@/lib/content-store";
import type { StravaSnapshot } from "@/types/strava";

const strava = stravaRaw as StravaSnapshot;

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Goals I’m chasing in public",
  description: "Follow Hritik's public goals and the smaller milestones behind each one.",
};

export default async function GoalsPage() {
  const { goals, runningSnapshot } = await getSiteContent();
  const pledgeLabel =
    project.baselinePledge !== null ? `₹${project.baselinePledge.toLocaleString("en-IN")}` : "₹X";
  const runningDistance = strava.connected ? strava.stats.distanceKm : runningSnapshot.distanceKm;

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
            <Target size={24} />
          </span>
          <p className="sectionSticker">🎯 One checkpoint at a time</p>
          <p className="eyebrow">Goals in motion</p>
          <h1>Goals I&apos;m chasing in public.</h1>
          <p className="subpageLead">
            The big outcomes are easier to trust when the smaller steps are visible. Follow what is
            done, what comes next and when each goal was last updated.
          </p>
        </div>
      </section>

      <section className="section publicGoalsPageSection standaloneExperience motionHost">
        <SectionMotion />
        <PublicGoals goals={goals} runningDistance={runningDistance} pledgeLabel={pledgeLabel} />
      </section>
    </main>
  );
}
