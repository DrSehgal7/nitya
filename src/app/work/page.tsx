import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ListChecks } from "lucide-react";
import { SectionMotion } from "@/components/SectionMotion";
import { WorkOverview } from "@/components/WorkOverview";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Personal experiments",
  description:
    "Hritik's personal accountability notes—context behind Nitya, not a coaching plan or impact tracker.",
};

export default async function WorkPage() {
  const { habits } = await getSiteContent();

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
            <ListChecks size={24} />
          </span>
          <p className="sectionSticker">⚙️ Personal accountability</p>
          <p className="eyebrow">Context, not the mission</p>
          <h1>Small experiments I&apos;m trying.</h1>
          <p className="subpageLead">
            These are my own notes on reducing waste and building better routines. They explain some
            of the thinking behind Nitya, but they are not a coaching plan and they do not measure
            how many people Nitya has helped. If one feels useful, the separate Habits page lets you
            join it with one tap.
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
