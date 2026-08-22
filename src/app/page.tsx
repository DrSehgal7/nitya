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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { RunnerScene } from "@/components/RunnerScene";
import { SectionMotion } from "@/components/SectionMotion";
import { SponsorStrava } from "@/components/SponsorStrava";
import { initiatives, principles, project } from "@/data/content";
import { site } from "@/data/site";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 60;

export default async function HomePage() {
  const { ledger, runningSnapshot } = await getSiteContent();
  const pledgeLabel =
    project.baselinePledge !== null ? `₹${project.baselinePledge.toLocaleString("en-IN")}` : "₹X";
  const savedTotal = ledger.reduce((total, entry) => total + entry.savedRupees, 0);
  const peopleTotal = ledger.reduce((total, entry) => total + entry.peopleImpacted, 0);
  const maxMonthlySavings = Math.max(1, ...ledger.map(({ savedRupees }) => savedRupees));
  const maxMonthlyPeople = Math.max(1, ...ledger.map(({ peopleImpacted }) => peopleImpacted));

  return (
    <main id="main-content">
      <SectionMotion persistent />
      <section className="artifactHero motionHost" id="mission">
        <RunnerScene />
        <SectionMotion />
        <div className="shell artifactHeroGrid">
          <div className="artifactHeroCopy">
            <p className="eyebrow">A public experiment in everyday impact</p>
            <h1>
              Build a better life. Use what it frees up to <em>help someone else.</em>
            </h1>
            <p className="heroLead">
              Nitya is my personal, public experiment in turning better everyday choices into more
              money, time and skills that can help other people. I&apos;m Hritik{" "}
              <span lang="hi">सरोच</span>, and my first measurable target is to positively impact{" "}
              <strong>100 lives</strong>.
            </p>
            <p>
              I have already committed <strong>{pledgeLabel} of my own money</strong>. The “X” means
              the amount is real but intentionally private. It does not depend on donations or
              public support.
            </p>
            <p>
              Next, I track savings created by better habits and add what I can on top. Visitors can
              join a habit, suggest a race, offer time or skills, or simply follow along. Nitya is
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

      <section className="section commitmentSection motionHost" id="commitment">
        <SectionMotion />
        <div className="shell">
          <p className="sectionSticker">🤝 My baseline</p>
          <p className="eyebrow">The commitment</p>
          <h2 className="baselineTitle">The baseline starts with me.</h2>
          <div className="baselinePanel">
            <figure className="avatarStage">
              <Image
                src="/images/hritik-snow-tea.jpg"
                alt="Hritik Saroch playfully leaning into a snowy chai break"
                width={900}
                height={1600}
                sizes="(max-width: 920px) min(100vw - 3rem, 560px), 420px"
              />
              <figcaption>A serious mission, an unserious chai break.</figcaption>
            </figure>
            <div className="commitmentCopy">
              <p>
                Nitya begins with money I have committed myself:{" "}
                <strong>{pledgeLabel} is already pledged.</strong> I show it as ₹X because I want
                the commitment to be real without making the private amount the story.
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
            <strong>
              Success is not one large donation. It is a repeatable way to improve my life and make
              someone else&apos;s life better at the same time.
            </strong>
          </p>
        </div>
      </section>

      <section className="section aboutSection" id="about">
        <div className="shell">
          <p className="eyebrow">About me</p>
          <h2 className="artifactSectionTitle">Why Nitya—and why me</h2>
          <div className="aboutGrid">
            <article className="profileCard">
              <figure className="profilePortrait">
                <Image
                  src="/images/hritik-saroch.jpg"
                  alt="Hritik Saroch smiling beside a snowy mountain stream"
                  width={1200}
                  height={1600}
                  sizes="(max-width: 920px) min(100vw - 3rem, 520px), 360px"
                />
                <figcaption>Average hybrid athlete · runner · always exploring</figcaption>
              </figure>
              <h3>
                Hritik <span lang="hi">सरोच</span>
              </h3>
              <p>
                Hritik <span lang="hi">सरोच</span> · Gurugram, India
              </p>
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
              <ul className="profileBioList">
                <li>
                  <span aria-hidden="true">💻</span> Software engineer by day; average hybrid
                  athlete after hours.
                </li>
                <li>
                  <span aria-hidden="true">🏃</span> Exploring my physical limits, one run and
                  strength session at a time.
                </li>
                <li>
                  <span aria-hidden="true">🍳</span> Occasional chef. “Average cook” is probably
                  more accurate.
                </li>
                <li>
                  <span aria-hidden="true">☕</span> Mixing coffee, cocktails and ideas—currently
                  testing coconut, orange and mango espresso tonics.
                </li>
                <li>
                  <span aria-hidden="true">💪</span> I can help you unlock your first kilometre,
                  chin-up or pull-up.
                </li>
                <li>
                  <span aria-hidden="true">🎯</span> Always up for a fun challenge—tech, sport or
                  something in between.
                </li>
                <li>
                  <span aria-hidden="true">🎬</span> Crime and sports documentaries are my comfort
                  watch.
                </li>
              </ul>
            </article>
            <div className="aboutStory">
              <aside>
                <strong>
                  <span lang="hi">नित्य</span> · Nitya
                </strong>
                <p>
                  The name reflects the idea: meaningful change is usually not one grand gesture. It
                  is small things, repeated every day.
                </p>
              </aside>
              <p>
                Nitya is a personal project, not a registered charity. My first goal is to
                positively impact <strong>100 lives</strong> through practical, measurable support:
                better access to sport for underprivileged children and specific education costs for
                girls who need support.
              </p>
              <p>
                I&apos;m not pretending I already know the perfect way to do this. Part of Nitya is
                figuring that out in public—which causes create real value, how to measure the
                outcome, and where my money or time can genuinely change something.
              </p>
              <p>
                <em>
                  This is not about becoming a saint. It is about seeing how much good can fit
                  inside an ambitious, enjoyable, ordinary life.
                </em>
              </p>
            </div>
          </div>
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

      <section className="manifestoSection section">
        <div className="shell manifestoGrid">
          <div>
            <p className="eyebrow eyebrowLight">The reason</p>
            <h2>Giving should never feel like guilt.</h2>
          </div>
          <div className="manifestoCopy">
            <p>
              I&apos;ve given to causes before—as much as I could at the time. But too often it
              curdled into guilt: the follow-ups, the pressure, the feeling that saying “not right
              now” made me the villain.
            </p>
            <blockquote>
              Money is one way to contribute. Your time, skills and attention can change a life too.
            </blockquote>
            <p>
              So here&apos;s my alternative. I optimise my life in the open, give on my own terms,
              and treat useful time as a contribution too. A doctor giving a discounted
              consultation, an engineer mentoring a student, a trainer helping someone move better,
              or a friend giving an hour to solve a real problem—all of that can positively impact a
              life.
            </p>
          </div>
        </div>
      </section>

      <section className="section transparencySection">
        <div className="shell transparencyCard artifactMoneyCard">
          <div>
            <p className="eyebrow">The honest bit</p>
            <h2>Where the money sits before it is used</h2>
            <p>
              <strong>
                This website does not collect payments. For now, money I personally set aside for
                Nitya is moved into my mother&apos;s account and left untouched.
              </strong>{" "}
              I am still selecting the right organisations and uses, so the money stays separate
              from my everyday spending until there is a clear, documented purpose.
            </p>
          </div>
          <div className="moneyFlow">
            <article>
              <span>₹</span>
              <div>
                <strong>Money comes in</strong>
                <p>My private pledge, plus savings I choose to add.</p>
              </div>
            </article>
            <article>
              <span>👩</span>
              <div>
                <strong>Moves to Mum&apos;s account</strong>
                <p>Kept separate from normal spending so it stays untouched.</p>
              </div>
            </article>
            <article>
              <span>📍</span>
              <div>
                <strong>Deployed publicly later</strong>
                <p>The recipient, purpose and confirmed outcome will be recorded here.</p>
              </div>
            </article>
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

      <section className="section sectionDirectory motionHost" aria-labelledby="explore-nitya">
        <SectionMotion />
        <div className="shell">
          <p className="sectionSticker">🧭 Choose your path</p>
          <p className="eyebrow">Explore Nitya</p>
          <h2 className="artifactSectionTitle" id="explore-nitya">
            Pick the part you came for.
          </h2>
          <p className="sectionIntro">
            Start with the part that interests you. Each page explains what you can view or do, so
            you do not need to read the whole project first.
          </p>
          <div className="directoryGrid">
            <Link className="directoryCard directoryCardWork" href="/work">
              <span className="directoryIcon" aria-hidden="true">
                <ListChecks size={25} />
              </span>
              <span className="eyebrow">The engine</span>
              <strong>What I&apos;m working on.</strong>
              <p>
                See the habits I am testing myself, what they save and when I last updated them.
              </p>
              <span className="directoryAction">
                See the work <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
            <Link className="directoryCard directoryCardGoals" href="/goals">
              <span className="directoryIcon" aria-hidden="true">
                <Target size={25} />
              </span>
              <span className="eyebrow">Goals in motion</span>
              <strong>Goals I&apos;m chasing in public.</strong>
              <p>Follow my larger personal goals through smaller milestones and dated updates.</p>
              <span className="directoryAction">
                Follow the goals <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
            <Link className="directoryCard directoryCardHabits" href="/habits">
              <span className="directoryIcon" aria-hidden="true">
                <HeartHandshake size={25} />
              </span>
              <span className="eyebrow">Join me for the habits</span>
              <strong>Make your life better with me.</strong>
              <p>Choose a habit, tap the thumbs-up and join everyone working on it alongside me.</p>
              <span className="directoryAction">
                Choose a habit <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
            <Link className="directoryCard directoryCardRaces" href="/races">
              <span className="directoryIcon" aria-hidden="true">
                <Flag size={25} />
              </span>
              <span className="eyebrow">Race calendar + community</span>
              <strong>Every race becomes a checkpoint.</strong>
              <p>Follow my race trail, then suggest a race, challenge or weirdly fun idea.</p>
              <span className="directoryAction">
                Explore the races <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section toolSection" id="optimise">
        <div className="shell">
          <p className="eyebrow">Find your ripple</p>
          <h2 className="artifactSectionTitle">
            Tell me where the money leaks—I&apos;ll help you plug it
          </h2>
          <div className="brewingCard">
            <div className="brewingVisual" aria-hidden="true">
              <span className="steam steamOne" />
              <span className="steam steamTwo" />
              <span className="steam steamThree" />
              <Coffee size={66} strokeWidth={1.35} />
            </div>
            <div className="brewingCopy">
              <p className="eyebrow">A useful little tool is steeping</p>
              <h3>Brewing this section for you :)</h3>
              <p>
                I&apos;m working on a simple way to spot everyday money leaks without turning your
                life into a spreadsheet. No forms or spending inputs here until it is genuinely
                useful.
              </p>
              <p className="brewingHelp">Need help sooner? Let&apos;s look at it together.</p>
              <div className="toolContactLinks">
                <a href="#contact">Leave me a note</a>
                <a href={site.instagramUrl} target="_blank" rel="noreferrer">
                  Message me on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section sponsorSection" id="sponsor">
        <div className="shell">
          <p className="eyebrow">Support · optional</p>
          <h2 className="artifactSectionTitle">
            Sponsor a kilometre—every rupee goes to the cause
          </h2>
          <p className="sectionIntro">
            This is an optional way to connect one of my runs with a contribution. The calculator
            only shows an amount; it does not take payment. If you want to proceed, it opens a
            conversation with me first. Any support sits{" "}
            <strong>on top of my own {pledgeLabel} commitment</strong>.
          </p>
          <SponsorStrava runningSnapshot={runningSnapshot} />
        </div>
      </section>

      <section className="section contactSection" id="contact">
        <div className="shell contactGrid">
          <div className="contactCopy">
            <p className="sectionSticker">☕ Say hi</p>
            <p className="eyebrow">Open door</p>
            <h2>Suggestion, idea, collaboration—or coffee?</h2>
            <p>
              If you think I&apos;m doing something badly, know a cause worth looking at, have a
              race I should try, want to contribute a skill, have a project idea, or just want to
              grab coffee and talk—send it here.
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
