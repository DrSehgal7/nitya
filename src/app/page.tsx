import {
  ArrowRight,
  AtSign,
  Check,
  Coffee,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { HabitChallenge } from "@/components/HabitChallenge";
import { RaceIdeasBoard } from "@/components/RaceIdeasBoard";
import { RaceTrail } from "@/components/RaceTrail";
import { RunnerScene } from "@/components/RunnerScene";
import { SectionMotion } from "@/components/SectionMotion";
import { SpendingAnalyzer } from "@/components/SpendingAnalyzer";
import { SponsorStrava } from "@/components/SponsorStrava";
import { initiatives, principles, project, statusLabel } from "@/data/content";
import { site } from "@/data/site";
import stravaRaw from "@/data/strava.generated.json";
import { getSiteContent } from "@/lib/content-store";
import { formatDate } from "@/lib/format";
import type { StravaSnapshot } from "@/types/strava";

const strava = stravaRaw as StravaSnapshot;

export const revalidate = 60;

export default async function HomePage() {
  const { goals, habits, ledger, races, runningSnapshot } = await getSiteContent();
  const pledgeLabel =
    project.baselinePledge !== null ? `₹${project.baselinePledge.toLocaleString("en-IN")}` : "₹X";
  const runningDistance = strava.connected ? strava.stats.distanceKm : runningSnapshot.distanceKm;
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
            <p className="eyebrow">A small daily mission</p>
            <h1>
              See how far one life can <em>positively ripple into others</em>—while still building a
              good life of my own.
            </h1>
            <p className="heroLead">
              I&apos;m Hritik <span lang="hi">सरोच</span>. I want to see how many lives one ordinary
              person can positively impact by being a little more intentional with money, time and
              everyday habits. My first public milestone is <strong>100 lives</strong>—not because I
              want to stop there, but because I need a starting line I can measure.
            </p>
            <p>
              I&apos;ve already pledged <strong>{pledgeLabel} of my own money</strong>. That amount
              is committed regardless of what anyone else contributes. From here, I want to optimise
              my own life—plan better, waste less, earn better, use money smarter—and put the extra
              savings I create <strong>on top of that {pledgeLabel}</strong>.
            </p>
            <p>
              The experiment is simple:{" "}
              <strong>how far can I take this without making my own life miserable?</strong> I still
              want to travel, race, eat well and enjoy the things I work for. The idea is to remove
              waste, not joy—then redirect some of that recovered value.
            </p>
            <div className="buttonRow">
              <a className="button buttonPrimary" href="#optimise">
                Analyse my spending <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="button buttonGhost" href="#numbers">
                See the numbers
              </a>
            </div>
          </div>

          <aside className="artifactImpactCard" aria-label="First impact milestone">
            <div className="impactCardTop">
              <span>First milestone</span>
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
          <h2 className="baselineTitle">My money first. Everything else goes on top.</h2>
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
                I don&apos;t want Nitya to depend on asking other people to fund something I believe
                in. So the base starts with me: <strong>{pledgeLabel} is already pledged.</strong>
              </p>
              <p>
                Then I want to test how much more I can create through smarter choices, better
                planning, stronger professional growth, people voluntarily joining, and useful time
                contributed by others.
              </p>
              <div className="pledgeStack">
                <article>
                  <strong>{pledgeLabel}</strong>
                  <span>my committed baseline</span>
                </article>
                <article>
                  <strong>+ savings</strong>
                  <span>created by optimisation</span>
                </article>
                <article>
                  <strong>+ people</strong>
                  <span>optional money, time &amp; skills</span>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section experimentSection">
        <div className="shell narrowStory">
          <p className="sectionSticker">✨ The experiment</p>
          <p className="eyebrow">Why this</p>
          <h2>Because I genuinely think this is a very cool experiment.</h2>
          <p>
            I want to find my ceiling. Not my ceiling for donating once—my ceiling for building a
            life where I keep getting fitter, better at work, more financially intentional and more
            useful to people around me, while the amount of positive impact grows alongside it.
          </p>
          <p>
            <strong>
              If the experiment works, the interesting part is not that I gave {pledgeLabel}. It is
              how much more value one person can create by improving his own systems first.
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
                  I picked it because the change I believe in isn&apos;t one grand gesture.
                  It&apos;s small things, done every single day.
                </p>
              </aside>
              <p>
                My personal goal is to positively impact <strong>100 lives first</strong>, through
                causes I actually understand and care about. The direction right now is practical
                and measurable: sports infrastructure for underprivileged kids, sponsoring a
                child&apos;s education for a specific class, and eventually helping fund a
                child&apos;s full primary education.
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
            These are the areas I want Nitya to work toward first. I&apos;m still finalising the
            exact organisations, structure and execution. For now, the important part is the
            direction and the outcome I want each initiative to create.
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
            <h2>How the money is actually handled</h2>
            <p>
              <strong>
                For now, every rupee related to Nitya is being moved into my mother&apos;s account
                and left untouched.
              </strong>{" "}
              I&apos;m still finalising exactly how and where the money should be deployed, so I
              don&apos;t want it mixed with day-to-day spending or used casually.
            </p>
          </div>
          <div className="moneyFlow">
            <article>
              <span>₹</span>
              <div>
                <strong>Money comes in</strong>
                <p>My pledge, optimisation savings, and optional contributions.</p>
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
                <p>Every allocation and outcome will appear here.</p>
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
                What better habits have helped me save, and how many people this experiment has
                positively impacted. My private ₹X commitment is intentionally not part of these
                totals or charts.
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

      <section className="section habitsSection motionHost" id="habits">
        <SectionMotion />
        <div className="shell">
          <div className="ownerHeading">
            <div>
              <p className="eyebrow">The engine</p>
              <h2 className="artifactSectionTitle">What I&apos;m working on</h2>
              <p className="sectionIntro">
                Two kinds of work: habits that cut waste and free up money, and goals that simply
                make the life better. Both count.
              </p>
            </div>
            <Link className="ownerEditLink" href="/owner/">
              <LockKeyhole size={15} aria-hidden="true" /> Owner editing
            </Link>
          </div>
          <h3 className="subsectionTitle">Habits that free up money</h3>
          <div className="artifactHabitList">
            {habits.map((habit) => {
              const saved = habit.savedRupees ?? 0;
              return (
                <article className="artifactHabitCard" key={habit.id}>
                  <span className="artifactHabitIcon" aria-hidden="true">
                    {habit.icon}
                  </span>
                  <div className="habitListCopy">
                    <div>
                      <h4>{habit.title}</h4>
                      <span className={`workStatus workStatus-${habit.status}`}>
                        {statusLabel(habit.status)}
                      </span>
                    </div>
                    <p>{habit.description}</p>
                    <small>Last updated {formatDate(habit.lastUpdated)}</small>
                  </div>
                  <div className="habitSavedOnly">
                    <span>Saved</span>
                    <strong>₹{saved.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="activeTrack" aria-label={`${habit.progress}% progress`}>
                    <span style={{ width: `${habit.progress}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
          <div className="goalMotionBlock motionHost">
            <SectionMotion />
            <h3 className="subsectionTitle goalsTitle">Goals I&apos;m chasing in public</h3>
            <p className="publicGoalNote">
              Every meaningful goal I hit unlocks an additional contribution from me—on top of the{" "}
              {pledgeLabel} I&apos;ve already committed.
            </p>
            <div className="artifactGoalGrid">
              {goals.map((goal) => {
                const isRunGoal = goal.id === "run-1000-km";
                const progress = isRunGoal
                  ? Math.min(100, Math.round((runningDistance / 1000) * 100))
                  : goal.progress;
                const currentLabel = isRunGoal
                  ? `${runningDistance.toFixed(1)} / 1,000 km`
                  : goal.currentLabel;
                return (
                  <article className="artifactGoalCard" key={goal.id}>
                    <div className="goalTop">
                      <span>{goal.category}</span>
                      <span className={`workStatus workStatus-${goal.status}`}>
                        {statusLabel(goal.status)}
                      </span>
                    </div>
                    <h4>{goal.title}</h4>
                    <p>{goal.description}</p>
                    <div
                      className={`goalMotionVisual goalMotionVisual-${goal.id}`}
                      aria-hidden="true"
                    >
                      {goal.id === "run-1000-km"
                        ? "🏃‍➡️"
                        : goal.id === "deadlift-140"
                          ? "🏋️"
                          : goal.id === "ship-nitya"
                            ? "✦"
                            : "₹"}
                    </div>
                    <div className="goalUpdatePreview">
                      <span>Current update</span>
                      <p>{currentLabel}</p>
                      <small>Last updated {formatDate(goal.lastUpdated)}</small>
                    </div>
                    <div className="goalCurrent">
                      {isRunGoal
                        ? `${runningDistance.toFixed(1)} / 1,000 km`
                        : goal.id === "deadlift-140"
                          ? "122 / 140 kg"
                          : "Progress"}
                    </div>
                    <div className="activeTrack" aria-label={`${progress}% progress`}>
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <small className="goalPercent">{progress}%</small>
                  </article>
                );
              })}
            </div>
          </div>

          <div id="races" className="homeRaceSection motionHost">
            <SectionMotion />
            <RaceTrail races={races} />
          </div>
        </div>
      </section>

      <section className="section toolSection" id="optimise">
        <div className="shell">
          <p className="eyebrow">Find your ripple</p>
          <h2 className="artifactSectionTitle">
            Tell me where the money leaks—I&apos;ll help you plug it
          </h2>
          <p className="sectionIntro">
            Pick one thing to optimise, drop in your last three months, and get a plain analysis
            with concrete steps to actually save. What you do with the savings is entirely yours.
          </p>
          <SpendingAnalyzer />
        </div>
      </section>

      <section className="section sponsorSection" id="sponsor">
        <div className="shell">
          <p className="eyebrow">Support · optional</p>
          <h2 className="artifactSectionTitle">Sponsor a kilometre—I donate every rupee</h2>
          <p className="sectionIntro">
            I&apos;m running these kilometres anyway. Sponsoring a kilometre is simply one fun way
            to attach impact to something I already love doing. It is always optional, and it sits{" "}
            <strong>on top of my own {pledgeLabel} commitment</strong>.
          </p>
          <SponsorStrava runningSnapshot={runningSnapshot} />
        </div>
      </section>

      <section className="section raceIdeasSection motionHost">
        <SectionMotion />
        <div className="shell">
          <div>
            <p className="sectionSticker">🏁 Community checkpoints</p>
            <p className="eyebrow">What should I race next?</p>
            <h2 className="artifactSectionTitle">Suggest a race, challenge or weirdly fun idea.</h2>
            <p>
              Think I&apos;m missing a cool trail, hybrid race, ultra, city run or slightly
              questionable challenge? Add it. People can vote and the most interesting ideas rise to
              the top.
            </p>
          </div>
          <RaceIdeasBoard />
        </div>
      </section>

      <section className="section sideQuestSection motionHost">
        <SectionMotion />
        <div className="shell">
          <div>
            <p className="sectionSticker">🎮 Pick your side quest</p>
            <p className="eyebrow">Join me for the habits</p>
            <h2 className="artifactSectionTitle">Make your life better with me.</h2>
            <p>
              You don&apos;t need to donate anything to join Nitya. Pick one habit that makes your
              own life better and work on it alongside me. If you contribute ₹0 and simply become
              healthier, more organised or less wasteful, that is still a win for both of us.
            </p>
          </div>
          <HabitChallenge />
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
