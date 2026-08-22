import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ThumbsUp } from "lucide-react";
import { HabitChallenge } from "@/components/HabitChallenge";
import { SectionMotion } from "@/components/SectionMotion";

export const metadata: Metadata = {
  title: "Join the habits",
  description: "Choose one simple habit and work on it alongside Hritik and the Nitya community.",
};

export default function HabitsPage() {
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
            <ThumbsUp size={24} />
          </span>
          <p className="sectionSticker">🎮 Pick your side quest</p>
          <p className="eyebrow">Join me for the habits</p>
          <h1>Make your life better with me.</h1>
          <p className="subpageLead">
            Pick one small habit and work on it alongside me. Joining only adds you to the public
            participant count; your identity is not shown. Google sign-in prevents duplicate joins,
            and tapping the button again lets you leave. No donation is required.
          </p>
        </div>
      </section>

      <section className="section sideQuestSection standaloneExperience">
        <div className="shell">
          <HabitChallenge />
        </div>
      </section>
    </main>
  );
}
