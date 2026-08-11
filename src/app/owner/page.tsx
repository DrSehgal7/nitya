import type { Metadata } from "next";
import { CircleCheck, LockKeyhole, Pencil, Plus, Trash2 } from "lucide-react";
import { goals, habits } from "@/data/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Owner content studio",
  robots: { index: false, follow: false },
};

export default function OwnerPage() {
  return (
    <main id="main-content" className="ownerPage">
      <section className="shell ownerCard">
        <LockKeyhole size={28} strokeWidth={1.7} aria-hidden="true" />
        <p className="eyebrow">Owner content studio</p>
        <h1>Your private controls are coming here.</h1>
        <p>
          Nitya is moving to Vercel so this page can become a secure dashboard instead of sending
          you to source files. Once owner authentication is connected, only Hritik&apos;s approved
          account will be able to view or save updates.
        </p>
        <div className="ownerActions">
          <div className="ownerAction">
            <CircleCheck size={20} aria-hidden="true" />
            <span>
              <strong>One dashboard for every owner-managed field</strong>
              <small>
                Running kilometres and update date first; more fields can be added later
              </small>
            </span>
          </div>
          <div className="ownerAction">
            <LockKeyhole size={20} aria-hidden="true" />
            <span>
              <strong>Owner-only access</strong>
              <small>Authentication and saving will happen securely on the server</small>
            </span>
          </div>
        </div>
        <div className="ownerCollectionGrid" aria-label="Planned owner-managed collections">
          <section>
            <div className="ownerCollectionHead">
              <div>
                <span>Habits</span>
                <strong>{habits.length} public items</strong>
              </div>
              <button type="button" disabled>
                <Plus size={14} aria-hidden="true" /> Add
              </button>
            </div>
            <ul>
              {habits.map((habit) => (
                <li key={habit.id}>
                  <span aria-hidden="true">{habit.icon}</span>
                  <div>
                    <strong>{habit.title}</strong>
                    <small>Updated {formatDate(habit.lastUpdated)}</small>
                  </div>
                  <button type="button" aria-label={`Edit ${habit.title}`} disabled>
                    <Pencil size={13} aria-hidden="true" />
                  </button>
                  <button type="button" aria-label={`Delete ${habit.title}`} disabled>
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <div className="ownerCollectionHead">
              <div>
                <span>Goals</span>
                <strong>{goals.length} public items</strong>
              </div>
              <button type="button" disabled>
                <Plus size={14} aria-hidden="true" /> Add
              </button>
            </div>
            <ul>
              {goals.map((goal) => (
                <li key={goal.id}>
                  <span aria-hidden="true">◎</span>
                  <div>
                    <strong>{goal.title}</strong>
                    <small>Updated {formatDate(goal.lastUpdated)}</small>
                  </div>
                  <button type="button" aria-label={`Edit ${goal.title}`} disabled>
                    <Pencil size={13} aria-hidden="true" />
                  </button>
                  <button type="button" aria-label={`Delete ${goal.title}`} disabled>
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <p className="ownerFinePrint">
          Add, edit, and delete controls stay disabled until the Vercel project and owner login are
          configured. No client-side PIN, secret, or pretend admin control will be exposed publicly.
        </p>
      </section>
    </main>
  );
}
