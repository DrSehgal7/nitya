import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, AtSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Hritik | Nitya",
  description:
    "The personal story behind Nitya: why Hritik Saroch started a public promise to turn small, consistent actions into practical help.",
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="subpageHero aboutPageHero">
        <div className="shell subpageHeroInner">
          <Link className="subpageBackLink" href="/">
            <ArrowLeft size={16} aria-hidden="true" /> Back to Nitya
          </Link>
          <p className="eyebrow">The person behind the promise</p>
          <h1>Why I started Nitya.</h1>
          <p>
            This page is simply my story—how an ordinary person arrived at a small, public promise
            to help more deliberately.
          </p>
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
              <figcaption>Hritik Saroch · Gurugram, India</figcaption>
            </figure>
            <h2>
              Hritik <span lang="hi">सरोच</span>
            </h2>
            <p className="profileBioIntro">
              Software engineer, average hybrid athlete and enthusiastic beginner at several
              unrelated things.
            </p>
            <ul className="profileBioList" aria-label="A few things about Hritik">
              <li>
                <span aria-hidden="true">🏃</span>
                <span>Exploring my physical limits through running and strength.</span>
              </li>
              <li>
                <span aria-hidden="true">🍳</span>
                <span>Occasional chef—still an average cook, but confidently experimenting.</span>
              </li>
              <li>
                <span aria-hidden="true">☕</span>
                <span>Currently mixing espresso tonics with coconut, orange and mango.</span>
              </li>
              <li>
                <span aria-hidden="true">💪</span>
                <span>Happy to help with your first kilometre, chin-up or pull-up.</span>
              </li>
              <li>
                <span aria-hidden="true">✨</span>
                <span>Up for fun challenges in tech or sport—and a good documentary after.</span>
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
            <p className="eyebrow">The beginning</p>
            <h2>Useful help should feel clear, voluntary and human.</h2>
            <p>
              I have supported causes before, but I often found the experience wrapped in pressure,
              follow-ups and guilt. That bothered me. Helping someone should not require a grand
              identity or a perfect organisation; it can begin with one person noticing a real need
              and choosing to act.
            </p>
            <p>
              So I started Nitya as a personal promise. I set aside my own money, look for specific
              ways it can be useful, and keep a public record of what actually happened. My first
              measurable goal is to positively impact <strong>100 lives</strong>.
            </p>
            <p>
              I chose the name because it reminds me that meaningful change is usually built through
              small actions repeated consistently—not one dramatic gesture.
            </p>
            <aside>
              <strong>I am learning in public.</strong>
              <p>
                Nitya is a personal project, not a registered charity. I do not have every process
                solved yet. I would rather be honest about that, start carefully and improve the
                structure as the work becomes real.
              </p>
            </aside>
            <p>
              The idea is simple: keep living an ambitious, enjoyable, ordinary life—and make
              practical room in it for other people too.
            </p>
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
