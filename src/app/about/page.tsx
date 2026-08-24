import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, AtSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Hritik | Nitya",
  description:
    "Meet Hritik Saroch and read why he started Nitya: a personal experiment in building a better life and using the capacity it creates to help others.",
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="subpageHero aboutPageHero">
        <div className="shell subpageHeroInner">
          <Link className="subpageBackLink" href="/">
            <ArrowLeft size={16} aria-hidden="true" /> Back to Nitya
          </Link>
          <p className="eyebrow">About me</p>
          <h1>Why Nitya—and why me.</h1>
          <p>The person, the ordinary life and the question behind this public experiment.</p>
        </div>
      </section>

      <section className="section aboutSection">
        <div className="shell aboutGrid aboutStoryGrid">
          <article className="profileCard aboutPortraitCard">
            <figure className="profilePortrait">
              <Image
                src="/images/hritik-saroch.jpg"
                alt="Hritik Saroch smiling beside a snowy mountain stream"
                width={1200}
                height={1600}
                priority
                sizes="(max-width: 920px) min(100vw - 3rem, 520px), 360px"
              />
              <figcaption>Average hybrid athlete · runner · always exploring</figcaption>
            </figure>
            <h2>
              Hritik <span lang="hi">सरोच</span>
            </h2>
            <p className="profileBioIntro">
              Hritik <span lang="hi">सरोच</span> · Gurugram, India
            </p>
            <ul className="profileBioList" aria-label="A few things about Hritik">
              <li>
                <span aria-hidden="true">💻</span>
                <span>Software engineer by day; average hybrid athlete after hours.</span>
              </li>
              <li>
                <span aria-hidden="true">🏃</span>
                <span>Exploring my physical limits, one run and strength session at a time.</span>
              </li>
              <li>
                <span aria-hidden="true">🍳</span>
                <span>Occasional chef. “Average cook” is probably more accurate.</span>
              </li>
              <li>
                <span aria-hidden="true">☕</span>
                <span>
                  Mixing coffee, cocktails and ideas—currently testing coconut, orange and mango
                  espresso tonics.
                </span>
              </li>
              <li>
                <span aria-hidden="true">💪</span>
                <span>I can help you unlock your first kilometre, chin-up or pull-up.</span>
              </li>
              <li>
                <span aria-hidden="true">🎯</span>
                <span>Always up for a fun challenge—tech, sport or something in between.</span>
              </li>
              <li>
                <span aria-hidden="true">🎬</span>
                <span>Crime and sports documentaries are my comfort watch.</span>
              </li>
            </ul>
            <a
              className="profileInstagram"
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Message ${site.founder} on Instagram at ${site.instagramHandle}`}
            >
              <AtSign aria-hidden="true" size={18} strokeWidth={1.8} />
              <span>
                <small>Say hello on Instagram</small>
                <strong>{site.instagramHandle}</strong>
              </span>
              <ArrowRight aria-hidden="true" size={17} />
            </a>
          </article>

          <article className="aboutStory aboutNarrative">
            <p className="eyebrow">
              <span lang="hi">नित्य</span> · Nitya
            </p>
            <h2>Small things, repeated every day.</h2>
            <p>
              The name reflects the idea: meaningful change is usually not one grand gesture. It is
              small things, repeated every day.
            </p>
            <p>
              Nitya is a personal project, not a registered charity. My first goal is to positively
              impact <strong>100 lives</strong> through practical, measurable support: better access
              to sport for underprivileged children and specific education costs for girls who need
              support.
            </p>
            <p>
              I&apos;m not pretending I already know the perfect way to do this. Part of Nitya is
              figuring that out in public—which causes create real value, how to measure the
              outcome, and where my money or time can genuinely change something.
            </p>
            <aside>
              <strong>This is not about becoming a saint.</strong>
              <p>
                It is about seeing how much good can fit inside an ambitious, enjoyable, ordinary
                life.
              </p>
            </aside>
            <div className="buttonRow">
              <Link className="button buttonPrimary" href="/#contribute">
                See how to contribute <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link className="button buttonGhost" href="/#contact">
                Tell me what you think
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
