import {
  ArrowRight,
  AtSign,
  Check,
  Coffee,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
      <SectionMotion persistent />
      <section className="artifactHero motionHost" id="mission">
        <RunnerScene />
        <SectionMotion />
        <div className="shell artifactHeroGrid">
          <div className="artifactHeroCopy">
            <p className="eyebrow">One person. One promise. Practical help.</p>
            <h1>
              Small everyday wins, turned into <em>real help.</em>
            </h1>
            <p className="heroLead">
              Nitya is my personal promise to help <strong>100 people</strong> in practical, visible
              ways. I&apos;m Hritik <span lang="hi">सरोच</span>. I fund the work myself, invite
              useful skills and ideas, and publish the results here.
            </p>
            <p>
              This website does not collect donations. If you know someone who needs practical
              help—or you can offer time, skills or a useful introduction—tell me.
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
              <span>People helped so far</span>
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
          <div className="baselinePanel baselinePanelSimple">
            <div className="commitmentCopy">
              <p>
                Nitya starts with money I have already set aside. I show it as{" "}
                <strong>{pledgeLabel}</strong> because the exact amount is personal; where it goes
                and what it achieves will be public.
              </p>
              <p>
                Better planning and less waste may create more to add later. Other people can help
                with time, skills or ideas, but nobody is being asked to fund this project.
              </p>
              <div className="pledgeStack">
                <article>
                  <strong>{pledgeLabel}</strong>
                  <span>money I have already committed</span>
                </article>
                <article>
                  <strong>+ savings</strong>
                  <span>extra capacity I create over time</span>
                </article>
                <article>
                  <strong>+ people</strong>
                  <span>optional time, skills and ideas</span>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section experimentSection">
        <div className="shell narrowStory">
          <p className="sectionSticker">✨ How it works</p>
          <p className="eyebrow">A simple loop</p>
          <h2>Find a real need. Help clearly. Share the result.</h2>
          <p>
            I start with a specific person or need, decide what useful support looks like, help, and
            record the confirmed outcome here. Money is only one tool; time, skills and the right
            introduction can matter just as much.
          </p>
          <p>
            <strong>Nitya is a public record of small choices becoming practical help.</strong>
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
              So here&apos;s my alternative: make help voluntary, specific and easy to understand. A
              doctor offering a consultation, an engineer mentoring a student, someone connecting a
              family to the right resource, or a friend giving an hour to solve a real problem can
              all make a meaningful difference.
            </p>
          </div>
        </div>
      </section>

      <section className="section transparencySection">
        <div className="shell transparencyCard artifactMoneyCard">
          <div>
            <p className="eyebrow">The honest bit</p>
            <h2>Money is kept separate until there is a clear use</h2>
            <p>
              <strong>
                This website does not collect payments. Money I personally set aside for Nitya is
                kept separate from everyday spending.
              </strong>{" "}
              It stays untouched until there is a specific recipient, a documented purpose and a
              result I can report honestly.
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
                <strong>Held separately</strong>
                <p>Kept away from normal spending until a real need is confirmed.</p>
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

      <section className="section sectionDirectory motionHost" id="contribute">
        <SectionMotion />
        <div className="shell">
          <p className="sectionSticker">🤝 Contribute without donating</p>
          <p className="eyebrow">A useful next step</p>
          <h2 className="artifactSectionTitle">Three ways you can help.</h2>
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
            <a className="directoryCard" href="#contact">
              <span className="directoryIcon" aria-hidden="true">
                <Check size={25} />
              </span>
              <span className="eyebrow">03 · Help keep it honest</span>
              <strong>Verify a need or help report the result.</strong>
              <p>Good documentation makes the help understandable, accountable and repeatable.</p>
              <span className="directoryAction">
                Help me verify it <ArrowRight size={17} aria-hidden="true" />
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
