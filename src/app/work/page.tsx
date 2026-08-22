import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ListChecks } from "lucide-react";
import { SectionMotion } from "@/components/SectionMotion";
import { WorkOverview } from "@/components/WorkOverview";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "What I’m working on",
  description: "The everyday habits Hritik is testing in public through Project Nitya.",
};

export default async function WorkPage() {
  const { habits } = await getSiteContent();

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
            <ListChecks size={24} />
          </span>
          <p className="sectionSticker">⚙️ The engine</p>
          <p className="eyebrow">Habits, tested in public</p>
          <h1>What I&apos;m working on.</h1>
          <p className="subpageLead">
            These are the small systems helping me waste less, live better and create a little more
            room for impact. No perfect streaks—just honest updates.
          </p>
        </div>
      </section>

      <section className="section habitsSection standaloneExperience motionHost">
        <SectionMotion />
        <WorkOverview habits={habits} />
      </section>
    </main>
  );
}
