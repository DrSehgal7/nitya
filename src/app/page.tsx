import {
  ArrowRight,
  AtSign,
  Check,
  Coffee,
  Flag,
  HeartHandshake,
  ListChecks,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { RunnerScene } from "@/components/RunnerScene";
import { SectionMotion } from "@/components/SectionMotion";
import { initiatives, principles, project } from "@/data/content";
import { site } from "@/data/site";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 60;

export default async function HomePage() {
  const { ledger } = await getSiteContent();
  const pledgeLabel =
    project.baselinePledge !== null ? `₹${project.baselinePledge.toLocaleString("en-IN")}` : "₹X";
  const savedTotal = ledger.reduce((total, entry) => total + entry.savedRupees, 0);
  const peopleTotal = ledger.reduce((total, entry) => total + entry.peopleImpacted, 0);
  const maxMonthlySavings = Math.max(1, ...ledger.map(({ savedRupees }) => savedRupees));
  const maxMonthlyPeople = Math.max(1, ...ledger.map(({ peopleImpacted }) => peopleImpacted));

  return (
    <main id="main-content">
      <section className="artifactHero motionHost" id="mission">
        <RunnerScene />
        <SectionMotion />
        <SectionMotion persistent />
        <div className="shell artifactHeroGrid">
          <div className="artifactHeroCopy">
            <p className="eyebrow">A personal, public experiment in everyday impact</p>
            <h1>Build a better life. Use what it frees up to help someone else.</h1>
            <p className="heroLead">
              Nitya is my personal, public experiment in turning better everyday choices into more
              money, time and skills that can help other people. I&apos;m Hritik{" "}
              <span lang="hi">सरोच</span>, and my first measurable target is to positively impact{" "}
              <strong>100 lives</strong>.
            </p>
            <p>
              I have already committed <strong>{pledgeLabel}</strong> of my own money. The “X” means
              the amount is real but intentionally private. It does not depend on donations or
              public support.
            </p>
            <p>
              Next, I track savings created by better habits and add what I can on top. Visitors can
              join a habit, suggest an event, offer time or skills, or simply follow along. Nitya is
              not a charity or payment platform, and contributing money is never required.
            </p>
            <div className="buttonRow">
              <a className="button buttonPrimary" href="#commitment">
                See how it works <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="button buttonGhost" href="#numbers">
                See the numbers
              </a>
            </div>
          </div>

          <aside className="artifactImpactCard" aria-label="First impact milestone">
            <div className="impactCardTop">
              <span>Verified impact so far</span>
              <Sparkles size={17} aria-hidden="true" />
            </div>
            <div className="artifactRing" aria-hidden="true">
              <div>
                <strong>{peopleTotal}</strong>
                <span>of my first {project.firstImpactGoal}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="artifactPrinciples" aria-label="Nitya principles">
        <div className="shell principleGrid">
          {principles.map((principle, index) => (
            <article key={principle.title}>
              <span className="miniIcon" aria-hidden="true">
                {index === 0 ? (
                  <ShieldCheck size={18} />
                ) : index === 1 ? (
                  <Check size={18} />
                ) : (
                  <Sparkles size={18} />
                )}
              </span>
              <div>
                <h2>{principle.title}</h2>
                <p>{principle.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section sectionDirectory projectDirectory motionHost" id="explore">
        <SectionMotion />
        <div className="shell">
          <p className="sectionSticker">🧭 Explore Nitya</p>
          <p className="eyebrow">Choose your path</p>
          <h2 className="artifactSectionTitle">Pick the part you came for.</h2>
          <p className="sectionIntro">
            The contribution story stays on this homepage. These separate pages show who I am and
            the personal habits, goals and events I am building in public alongside Nitya.
          </p>
          <div className="directoryGrid projectDirectoryGrid">
            <Link className="directoryCard directoryCardAbout" href="/about/">
              <span className="directoryIcon" aria-hidden="true">
                <UserRound size={25} />
              </span>
              <span className="eyebrow">About me</span>
              <strong>Meet the person behind Nitya.</strong>
              <p>My story, interests and the reason I chose to make this promise public.</p>
              <span className="directoryAction">
                Read my story <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
            <Link className="directoryCard directoryCardWork" href="/work/">
              <span className="directoryIcon" aria-hidden="true">
                <ListChecks size={25} />
              </span>
              <span className="eyebrow">Habits in public</span>
              <strong>See what I&apos;m working on.</strong>
              <p>The everyday routines I am testing, learning from and updating honestly.</p>
              <span className="directoryAction">
                Explore my habits <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
            <Link className="directoryCard directoryCardGoals" href="/goals/">
              <span className="directoryIcon" aria-hidden="true">
                <Target size={25} />
              </span>
              <span className="eyebrow">Goals in public</span>
              <strong>Follow the goals I&apos;m chasing.</strong>
              <p>Longer personal goals, divided into smaller checkpoints I can actually finish.</p>
              <span className="directoryAction">
                View my goals <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
            <Link className="directoryCard directoryCardRaces" href="/events/">
              <span className="directoryIcon" aria-hidden="true">
                <Flag size={25} />
              </span>
              <span className="eyebrow">Events</span>
              <strong>See what is next on my calendar.</strong>
              <p>My races and challenges, plus a place to suggest the next interesting one.</p>
              <span className="directoryAction">
                Open events <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section commitmentSection motionHost" id="commitment">
        <SectionMotion />
        <div className="shell">
          <p className="sectionSticker">🤝 My baseline</p>
          <p className="eyebrow">The commitment</p>
          <h2 className="baselineTitle">The baseline starts with me.</h2>
          <div className="baselinePanel">
            <figure className="avatarStage baselinePhoto">
              <Image
                src="/images/hritik-snow-tea.jpg"
                alt="Hritik Saroch playfully leaning into a snowy chai break"
                width={900}
                height={1600}
                sizes="(max-width: 920px) min(100vw - 3rem, 520px), 390px"
                priority
              />
              <figcaption>A serious mission, an unserious chai break.</figcaption>
            </figure>
            <div className="commitmentCopy">
              <p>
                Nitya begins with money I have committed myself: <strong>{pledgeLabel}</strong> is
                already pledged. I show it as {pledgeLabel} because I want the commitment to be real
                without making the private amount the story.
              </p>
              <p>
                Anything created through better planning, less waste or professional growth can be
                added on top. Other people may join with money, time or skills, but the project does
                not depend on them doing so.
              </p>
              <div className="pledgeStack">
                <article>
                  <strong>{pledgeLabel}</strong>
                  <span>my private committed baseline</span>
                </article>
                <article>
                  <strong>+ savings</strong>
                  <span>extra value created by better habits</span>
                </article>
                <article>
                  <strong>+ people</strong>
                  <span>optional support, time or skills</span>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section experimentSection">
        <div className="shell narrowStory">
          <p className="sectionSticker">✨ The experiment</p>
          <p className="eyebrow">The question I am testing</p>
          <h2>Can improving my own systems create more capacity to help?</h2>
          <p>
            I want to keep getting fitter, better at work and more intentional with money—then see
            whether those improvements leave me with more resources to share. The aim is to remove
            waste, not joy, so I can still travel, race, eat well and enjoy what I work for.
          </p>
          <p>
            Success is not one large donation. It is a repeatable way to improve my life and make
            someone else&apos;s life better at the same time. And honestly, I think that is a really
            cool experiment to test in public.
          </p>
        </div>
      </section>

      <section className="section initiativesSection motionHost">
        <SectionMotion />
        <div className="shell">
          <p className="sectionSticker">🎯 Where I want the impact to go</p>
          <p className="eyebrow">Initiatives I&apos;m exploring</p>
          <h2 className="artifactSectionTitle">
            Start with a clear idea. Then make the impact measurable.
          </h2>
          <p className="sectionIntro">
            These are directions I am researching, not confirmed partnerships. Before money is
            deployed, I want a clear recipient, a concrete use and an outcome I can report publicly.
          </p>
          <div className="initiativeGrid">
            {initiatives.map((initiative, index) => (
              <article className="initiativeCard" key={initiative.title}>
                <span className="initiativeNumber">0{index + 1}</span>
                <span className="initiativeIcon" aria-hidden="true">
                  {initiative.icon}
                </span>
                <h3>{initiative.title}</h3>
                <p>{initiative.description}</p>
                <div className="initiativeGoal">Goal: {initiative.goal}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ledgerSection section" id="numbers">
        <div className="shell">
          <div className="ownerHeading">
            <div>
              <p className="eyebrow eyebrowLight">Out in the open</p>
              <h2 className="artifactSectionTitle">The numbers, kept honest</h2>
              <p className="sectionIntro">
                These totals include only savings I have recorded and people who have received
                confirmed help. The private ₹X baseline is excluded. A zero means no verified public
                outcome has been recorded yet—not that the commitment disappeared.
              </p>
            </div>
            <Link className="ownerEditLink" href="/owner/">
              <LockKeyhole size={15} aria-hidden="true" /> Owner editing
            </Link>
          </div>
          <div className="statGrid artifactStats">
            <article>
              <strong>₹{savedTotal.toLocaleString("en-IN")}</strong>
              <span>Savings created</span>
            </article>
            <article>
              <strong>{peopleTotal.toLocaleString("en-IN")}</strong>
              <span>People positively impacted</span>
            </article>
          </div>
          <div className="ledgerLegend" aria-hidden="true">
            <span className="ledgerLegendSavings">Savings</span>
            <span className="ledgerLegendPeople">People</span>
          </div>
          <div className="artifactChart" aria-label="Monthly savings and people impacted">
            {ledger.map((item) => (
              <div key={item.month}>
                <strong>
                  ₹{item.savedRupees.toLocaleString("en-IN")} · {item.peopleImpacted} people
                </strong>
                <span className="ledgerBars" aria-hidden="true">
                  <i
                    style={{
                      height: `${Math.max(2, (item.savedRupees / maxMonthlySavings) * 100)}%`,
                    }}
                  />
                  <b
                    style={{
                      height: `${Math.max(2, (item.peopleImpacted / maxMonthlyPeople) * 100)}%`,
                    }}
                  />
                </span>
                <span>{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section sectionDirectory motionHost" id="contribute">
        <SectionMotion />
        <div className="shell">
          <p className="sectionSticker">🤝 Contribute without donating</p>
          <p className="eyebrow">A useful next step</p>
          <h2 className="artifactSectionTitle">Two ways you can help.</h2>
          <p className="sectionIntro">
            You do not need to send money. A specific need, the right skill or a thoughtful
            introduction can be the contribution that unlocks real help.
          </p>
          <div className="directoryGrid contributionGrid">
            <a className="directoryCard" href="#contact">
              <span className="directoryIcon" aria-hidden="true">
                <HeartHandshake size={25} />
              </span>
              <span className="eyebrow">01 · Share a need</span>
              <strong>Tell me who could use practical help.</strong>
              <p>Describe the person, the need and what a useful outcome might look like.</p>
              <span className="directoryAction">
                Send the context <ArrowRight size={17} aria-hidden="true" />
              </span>
            </a>
            <a className="directoryCard" href="#contact">
              <span className="directoryIcon" aria-hidden="true">
                <Sparkles size={25} />
              </span>
              <span className="eyebrow">02 · Offer something useful</span>
              <strong>Bring time, a skill or an introduction.</strong>
              <p>A small, specific offer is easier to turn into action than a general promise.</p>
              <span className="directoryAction">
                Tell me what you can offer <ArrowRight size={17} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="section contactSection" id="contact">
        <div className="shell contactGrid">
          <div className="contactCopy">
            <p className="sectionSticker">☕ Say hi</p>
            <p className="eyebrow">Open door</p>
            <h2>Suggestion, idea, collaboration—or coffee?</h2>
            <p>
              If you know a real need worth looking at, want to contribute a useful skill, have an
              idea that could make the project better, or just want to grab coffee and talk—send it
              here.
            </p>
            <p>
              <strong>No formal pitch needed.</strong> A useful thought is enough.
            </p>
            <a className="socialCard" href={site.instagramUrl} target="_blank" rel="noreferrer">
              <AtSign size={21} aria-hidden="true" />
              <span>
                <small>Find me on Instagram</small>
                <strong>{site.instagramHandle}</strong>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <div className="coffeeNote">
              <Coffee size={17} aria-hidden="true" /> Gurugram when possible. A video call
              otherwise.
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
