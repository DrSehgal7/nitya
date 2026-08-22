import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ListChecks } from "lucide-react";
import { SectionMotion } from "@/components/SectionMotion";
import { WorkOverview } from "@/components/WorkOverview";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "What I’m working on",
  description:
    "See the everyday habits Hritik is testing, what they have saved, and when each one was last updated.",
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
            This page is the public log of habits I am testing in my own life. I record what I am
            changing, what it saves and when I last updated it. If you want to take part yourself,
            the separate Habits page lets you join with one tap.
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
