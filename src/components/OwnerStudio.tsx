"use client";

import { Mail, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  goalProgressFromSubgoals,
  goalStatusFromSubgoals,
  statusLabel,
  type Habit,
  type LedgerEntry,
  type PublicGoal,
} from "@/data/content";
import type { Race } from "@/data/races";
import { parseNumberDraft } from "@/lib/number-input";
import type { ContactSubmission, SiteContent } from "@/types/content";

const goalStatusOptions = [
  ["not-started", "Yet to pick up"],
  ["in-progress", "In progress"],
  ["done", "Done"],
] as const;

const habitStatusOptions = [
  ["not-started", "Yet to pick up"],
  ["building", "Building"],
  ["in-progress", "In progress"],
  ["maintaining", "Maintaining"],
  ["paused", "Paused"],
  ["done", "Done"],
] as const;

function freshId(prefix: string): string {
  return `${prefix}-${window.crypto.randomUUID()}`;
}

function todayInIndia(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function NumericDraftInput({
  value,
  min,
  max,
  step = 1,
  integer = false,
  onValueChange,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
  onValueChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  const focused = useRef(false);
  const parsed = parseNumberDraft(draft, { min, max, integer });

  useEffect(() => {
    if (!focused.current) setDraft(String(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode={Number.isInteger(step) ? "numeric" : "decimal"}
      value={draft}
      aria-invalid={parsed === null}
      onFocus={() => {
        focused.current = true;
      }}
      onChange={(event) => {
        const nextDraft = event.target.value;
        setDraft(nextDraft);
        const nextValue = parseNumberDraft(nextDraft, { min, max, integer });
        if (nextValue !== null) onValueChange(nextValue);
      }}
      onBlur={() => {
        focused.current = false;
        const nextValue = parseNumberDraft(draft, { min, max, integer });
        setDraft(String(nextValue ?? value));
      }}
    />
  );
}

export function OwnerStudio({
  initialContent,
  initialSubmissions,
}: {
  initialContent: SiteContent;
  initialSubmissions: ContactSubmission[];
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxMessage, setInboxMessage] = useState(
    initialSubmissions.length
      ? "Newest notes appear first."
      : "No notes yet. New form submissions will appear here.",
  );
  const [runningKmDraft, setRunningKmDraft] = useState(
    String(initialContent.runningSnapshot.distanceKm),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("All fields below are private controls until you save.");

  async function refreshInbox() {
    setInboxLoading(true);
    setInboxMessage("Checking for new notes…");
    try {
      const response = await fetch("/api/contact", { cache: "no-store" });
      const result = (await response.json()) as {
        submissions?: ContactSubmission[];
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "Unable to refresh the inbox.");
      const next = result.submissions ?? [];
      setSubmissions(next);
      setInboxMessage(next.length ? "Inbox refreshed." : "No notes yet.");
    } catch (error) {
      setInboxMessage(error instanceof Error ? error.message : "Unable to refresh the inbox.");
    } finally {
      setInboxLoading(false);
    }
  }

  async function deleteMessage(id: string) {
    if (!window.confirm("Delete this message permanently?")) return;
    setInboxLoading(true);
    setInboxMessage("Deleting note…");
    try {
      const response = await fetch("/api/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to delete this note.");
      setSubmissions((current) => current.filter((submission) => submission.id !== id));
      setInboxMessage("Note deleted.");
    } catch (error) {
      setInboxMessage(error instanceof Error ? error.message : "Unable to delete this note.");
    } finally {
      setInboxLoading(false);
    }
  }

  function updateHabit(index: number, patch: Partial<Habit>) {
    setContent((current) => ({
      ...current,
      habits: current.habits.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function updateGoal(index: number, patch: Partial<PublicGoal>) {
    setContent((current) => ({
      ...current,
      goals: current.goals.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const next = { ...item, ...patch };
        if (!patch.subgoals) return next;
        return {
          ...next,
          status: goalStatusFromSubgoals(next.subgoals, next.status),
          progress: goalProgressFromSubgoals(next.subgoals, next.progress),
          lastUpdated: todayInIndia(),
        };
      }),
    }));
  }

  function updateRace(index: number, patch: Partial<Race>) {
    setContent((current) => ({
      ...current,
      races: current.races.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function updateLedger(index: number, patch: Partial<LedgerEntry>) {
    setContent((current) => ({
      ...current,
      ledger: current.ledger.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  async function save() {
    const distanceKm = Number(runningKmDraft.trim());
    if (runningKmDraft.trim() === "" || !Number.isFinite(distanceKm) || distanceKm < 0) {
      setMessage("Enter a valid running total of 0 km or more.");
      return;
    }

    const payload: SiteContent = {
      ...content,
      runningSnapshot: { ...content.runningSnapshot, distanceKm },
    };
    setSaving(true);
    setMessage("Saving securely…");
    try {
      const response = await fetch("/api/owner/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as SiteContent & { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to save your changes.");
      setContent(result);
      setRunningKmDraft(String(result.runningSnapshot.distanceKm));
      setMessage(`Saved successfully at ${new Date(result.updatedAt).toLocaleString("en-IN")}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save your changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="shell ownerStudio">
      <details className="ownerEditorSection ownerInbox" open>
        <summary>
          <span>
            <Mail size={19} aria-hidden="true" /> Messages ({submissions.length})
          </span>
        </summary>
        <div className="ownerInboxToolbar">
          <p aria-live="polite">{inboxMessage}</p>
          <button
            className="ownerAdd ownerInboxRefresh"
            type="button"
            disabled={inboxLoading}
            onClick={() => void refreshInbox()}
          >
            <RefreshCw size={15} aria-hidden="true" />
            {inboxLoading ? "Working…" : "Refresh inbox"}
          </button>
        </div>
        {submissions.length === 0 ? (
          <div className="ownerInboxEmpty">
            <Mail size={22} aria-hidden="true" />
            <p>
              Submitted notes will appear here. The sender only has to provide their name and note.
            </p>
          </div>
        ) : (
          <div className="ownerMessageList">
            {submissions.map((submission) => (
              <article className="ownerMessageCard" key={submission.id}>
                <div className="ownerEditorCardHead">
                  <div>
                    <strong>{submission.name}</strong>
                    <time dateTime={submission.submittedAt}>
                      {new Date(submission.submittedAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                  <button
                    className="ownerDelete"
                    type="button"
                    disabled={inboxLoading}
                    aria-label={`Delete note from ${submission.name}`}
                    onClick={() => void deleteMessage(submission.id)}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
                <p className="ownerMessageNote">{submission.note}</p>
                <dl className="ownerMessageMeta">
                  {submission.email && (
                    <div>
                      <dt>Email</dt>
                      <dd>
                        <a href={`mailto:${submission.email}`}>{submission.email}</a>
                      </dd>
                    </div>
                  )}
                  {submission.instagram && (
                    <div>
                      <dt>Instagram</dt>
                      <dd>{submission.instagram}</dd>
                    </div>
                  )}
                  {submission.interest && (
                    <div>
                      <dt>Reason</dt>
                      <dd>{submission.interest}</dd>
                    </div>
                  )}
                </dl>
              </article>
            ))}
          </div>
        )}
      </details>

      <div className="ownerSaveBar">
        <p aria-live="polite">{message}</p>
        <button
          className="button buttonPrimary"
          type="button"
          disabled={saving}
          onClick={() => void save()}
        >
          <Save size={16} aria-hidden="true" /> {saving ? "Saving…" : "Save all changes"}
        </button>
      </div>

      <details className="ownerEditorSection" open>
        <summary>Running kilometres</summary>
        <div className="ownerFieldGrid ownerFieldGridTwo">
          <label>
            Distance this year (km)
            <input
              type="text"
              inputMode="decimal"
              placeholder="For example, 42.5"
              value={runningKmDraft}
              aria-describedby="running-km-help"
              onChange={(event) => {
                const nextValue = event.target.value;
                setRunningKmDraft(nextValue);
                if (nextValue.trim() === "") return;
                const nextDistance = Number(nextValue);
                if (!Number.isFinite(nextDistance) || nextDistance < 0) return;
                setContent((current) => ({
                  ...current,
                  runningSnapshot: {
                    distanceKm: nextDistance,
                    asOf: todayInIndia(),
                  },
                }));
              }}
            />
            <small id="running-km-help">
              Enter the cumulative total for this year. Decimals such as 42.5 are supported.
            </small>
          </label>
          <label>
            Updated as of
            <input
              type="date"
              value={content.runningSnapshot.asOf}
              onChange={(event) =>
                setContent((current) => ({
                  ...current,
                  runningSnapshot: { ...current.runningSnapshot, asOf: event.target.value },
                }))
              }
            />
          </label>
        </div>
      </details>

      <details className="ownerEditorSection" open>
        <summary>Public savings and people</summary>
        <p className="ownerSectionHint">
          The private ₹X pledge is never stored here. Charts use only these monthly entries.
        </p>
        <div className="ownerEditorList">
          {content.ledger.map((entry, index) => (
            // Ledger rows are not reordered in this editor, so the position is the stable identity.
            // Do not include `entry.month` in the key: changing it would remount the row and make
            // the input lose focus after every keystroke.
            <article className="ownerEditorRow" key={`ledger-${index}`}>
              <div className="ownerFieldGrid ownerFieldGridThree">
                <label>
                  Month
                  <input
                    value={entry.month}
                    maxLength={30}
                    onChange={(event) => updateLedger(index, { month: event.target.value })}
                  />
                </label>
                <label>
                  Savings (₹)
                  <NumericDraftInput
                    min={0}
                    step={1}
                    integer
                    value={entry.savedRupees}
                    onValueChange={(savedRupees) => updateLedger(index, { savedRupees })}
                  />
                </label>
                <label>
                  People impacted
                  <NumericDraftInput
                    min={0}
                    step={1}
                    integer
                    value={entry.peopleImpacted}
                    onValueChange={(peopleImpacted) => updateLedger(index, { peopleImpacted })}
                  />
                </label>
              </div>
              <button
                className="ownerDelete"
                type="button"
                aria-label={`Delete ${entry.month}`}
                onClick={() =>
                  setContent((current) => ({
                    ...current,
                    ledger: current.ledger.filter((_, itemIndex) => itemIndex !== index),
                  }))
                }
              >
                <Trash2 size={15} />
              </button>
            </article>
          ))}
        </div>
        <button
          className="ownerAdd"
          type="button"
          onClick={() =>
            setContent((current) => ({
              ...current,
              ledger: [
                ...current.ledger,
                { month: "New month", savedRupees: 0, peopleImpacted: 0 },
              ],
            }))
          }
        >
          <Plus size={15} /> Add month
        </button>
      </details>

      <details className="ownerEditorSection" open>
        <summary>Habits</summary>
        <div className="ownerEditorList">
          {content.habits.map((habit, index) => (
            <article className="ownerEditorCard" key={habit.id}>
              <div className="ownerEditorCardHead">
                <strong>
                  {habit.icon} {habit.title || "Untitled habit"}
                </strong>
                <button
                  className="ownerDelete"
                  type="button"
                  aria-label={`Delete ${habit.title}`}
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      habits: current.habits.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="ownerFieldGrid ownerFieldGridFour">
                <label>
                  Icon
                  <input
                    value={habit.icon}
                    maxLength={12}
                    onChange={(event) => updateHabit(index, { icon: event.target.value })}
                  />
                </label>
                <label className="ownerFieldWide">
                  Title
                  <input
                    value={habit.title}
                    maxLength={100}
                    onChange={(event) => updateHabit(index, { title: event.target.value })}
                  />
                </label>
                <label>
                  Status
                  <select
                    value={habit.status}
                    onChange={(event) =>
                      updateHabit(index, { status: event.target.value as Habit["status"] })
                    }
                  >
                    {habitStatusOptions.map(([value, label]) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Description
                  <textarea
                    value={habit.description}
                    maxLength={240}
                    onChange={(event) => updateHabit(index, { description: event.target.value })}
                  />
                </label>
                <label>
                  Saved (₹)
                  <NumericDraftInput
                    min={0}
                    step={1}
                    integer
                    value={habit.savedRupees ?? 0}
                    onValueChange={(savedRupees) => updateHabit(index, { savedRupees })}
                  />
                </label>
                <label>
                  Last updated
                  <input
                    type="date"
                    value={habit.lastUpdated}
                    onChange={(event) => updateHabit(index, { lastUpdated: event.target.value })}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
        <button
          className="ownerAdd"
          type="button"
          onClick={() =>
            setContent((current) => ({
              ...current,
              habits: [
                ...current.habits,
                {
                  id: freshId("habit"),
                  icon: "✨",
                  title: "New habit",
                  description: "Describe the habit.",
                  status: "not-started",
                  savedRupees: 0,
                  lastUpdated: new Date().toISOString().slice(0, 10),
                },
              ],
            }))
          }
        >
          <Plus size={15} /> Add habit
        </button>
      </details>

      <details className="ownerEditorSection" open>
        <summary>Goals</summary>
        <div className="ownerEditorList">
          {content.goals.map((goal, index) => (
            <article className="ownerEditorCard" key={goal.id}>
              <div className="ownerEditorCardHead">
                <strong>{goal.title || "Untitled goal"}</strong>
                <button
                  className="ownerDelete"
                  type="button"
                  aria-label={`Delete ${goal.title}`}
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      goals: current.goals.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="ownerFieldGrid ownerFieldGridFour">
                <label>
                  Category
                  <select
                    value={goal.category}
                    onChange={(event) =>
                      updateGoal(index, { category: event.target.value as PublicGoal["category"] })
                    }
                  >
                    <option>Body</option>
                    <option>Craft</option>
                    <option>Money</option>
                  </select>
                </label>
                <label className="ownerFieldWide">
                  Title
                  <input
                    value={goal.title}
                    maxLength={120}
                    onChange={(event) => updateGoal(index, { title: event.target.value })}
                  />
                </label>
                {goal.subgoals.length === 0 ? (
                  <label>
                    Status
                    <select
                      value={goal.status}
                      onChange={(event) =>
                        updateGoal(index, { status: event.target.value as PublicGoal["status"] })
                      }
                    >
                      {goalStatusOptions.map(([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="ownerCalculatedStatus">
                    <span>Overall status</span>
                    <strong>{statusLabel(goal.status)}</strong>
                    <small>Calculated from the milestones below.</small>
                  </div>
                )}
                <label>
                  Description
                  <textarea
                    value={goal.description}
                    maxLength={300}
                    onChange={(event) => updateGoal(index, { description: event.target.value })}
                  />
                </label>
                <label>
                  Current update
                  <textarea
                    value={goal.currentLabel}
                    maxLength={200}
                    onChange={(event) => updateGoal(index, { currentLabel: event.target.value })}
                  />
                </label>
                <label>
                  Last updated
                  <input
                    type="date"
                    value={goal.lastUpdated}
                    onChange={(event) => updateGoal(index, { lastUpdated: event.target.value })}
                  />
                </label>
              </div>
              <div className="ownerMilestones">
                <div className="ownerMilestonesHead">
                  <div>
                    <strong>Milestones</strong>
                    <small>Complete every milestone and the goal is marked done.</small>
                  </div>
                  <button
                    className="ownerAdd ownerAddCompact"
                    type="button"
                    onClick={() =>
                      updateGoal(index, {
                        subgoals: [
                          ...goal.subgoals,
                          {
                            id: freshId("milestone"),
                            title: `Milestone ${goal.subgoals.length + 1}`,
                            completed: false,
                          },
                        ],
                      })
                    }
                  >
                    <Plus size={14} aria-hidden="true" /> Add milestone
                  </button>
                </div>
                {goal.subgoals.length === 0 ? (
                  <p className="ownerMilestonesEmpty">
                    Add a milestone to turn this goal into a dynamic checklist.
                  </p>
                ) : (
                  <div className="ownerMilestoneList">
                    {goal.subgoals.map((subgoal, subgoalIndex) => (
                      <div className="ownerMilestoneRow" key={subgoal.id}>
                        <label className="ownerMilestoneCheck">
                          <input
                            type="checkbox"
                            checked={subgoal.completed}
                            onChange={(event) =>
                              updateGoal(index, {
                                subgoals: goal.subgoals.map((entry, entryIndex) =>
                                  entryIndex === subgoalIndex
                                    ? { ...entry, completed: event.target.checked }
                                    : entry,
                                ),
                              })
                            }
                          />
                          <span>{subgoal.completed ? "Completed" : "Not completed"}</span>
                        </label>
                        <input
                          value={subgoal.title}
                          maxLength={120}
                          aria-label={`Milestone ${subgoalIndex + 1}`}
                          onChange={(event) =>
                            updateGoal(index, {
                              subgoals: goal.subgoals.map((entry, entryIndex) =>
                                entryIndex === subgoalIndex
                                  ? { ...entry, title: event.target.value }
                                  : entry,
                              ),
                            })
                          }
                        />
                        <button
                          className="ownerDelete"
                          type="button"
                          aria-label={`Delete ${subgoal.title}`}
                          onClick={() =>
                            updateGoal(index, {
                              subgoals: goal.subgoals.filter(
                                (_, entryIndex) => entryIndex !== subgoalIndex,
                              ),
                            })
                          }
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        <button
          className="ownerAdd"
          type="button"
          onClick={() =>
            setContent((current) => ({
              ...current,
              goals: [
                ...current.goals,
                {
                  id: freshId("goal"),
                  category: "Body",
                  title: "New goal",
                  description: "Describe the goal.",
                  status: "not-started",
                  progress: 0,
                  currentLabel: "Starting point",
                  lastUpdated: new Date().toISOString().slice(0, 10),
                  subgoals: [],
                },
              ],
            }))
          }
        >
          <Plus size={15} /> Add goal
        </button>
      </details>

      <details className="ownerEditorSection" open>
        <summary>Race calendar</summary>
        <p className="ownerSectionHint">
          Saved races are automatically ordered by date and added to the public trail.
        </p>
        <div className="ownerEditorList">
          {content.races.map((race, index) => (
            <article className="ownerEditorCard" key={race.slug}>
              <div className="ownerEditorCardHead">
                <strong>🏁 {race.name || "Untitled race"}</strong>
                <button
                  className="ownerDelete"
                  type="button"
                  aria-label={`Delete ${race.name}`}
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      races: current.races.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="ownerFieldGrid ownerFieldGridFour">
                <label className="ownerFieldWide">
                  Race name
                  <input
                    value={race.name}
                    maxLength={120}
                    onChange={(event) => updateRace(index, { name: event.target.value })}
                  />
                </label>
                <label>
                  Short name
                  <input
                    value={race.shortName}
                    maxLength={50}
                    onChange={(event) => updateRace(index, { shortName: event.target.value })}
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={race.date}
                    onChange={(event) => updateRace(index, { date: event.target.value })}
                  />
                </label>
                <label>
                  Distance (km)
                  <NumericDraftInput
                    min={0.1}
                    step={0.001}
                    value={race.distanceKm}
                    onValueChange={(distanceKm) => updateRace(index, { distanceKm })}
                  />
                </label>
                <label>
                  Location
                  <input
                    value={race.location}
                    maxLength={100}
                    onChange={(event) => updateRace(index, { location: event.target.value })}
                  />
                </label>
                <label>
                  Status
                  <select
                    value={race.status}
                    onChange={(event) =>
                      updateRace(index, { status: event.target.value as Race["status"] })
                    }
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="considering">Considering</option>
                  </select>
                </label>
                <label>
                  Calendar label
                  <input
                    value={race.registrationStatus}
                    maxLength={80}
                    onChange={(event) =>
                      updateRace(index, { registrationStatus: event.target.value })
                    }
                  />
                </label>
                <label className="ownerFieldWide">
                  Official HTTPS link
                  <input
                    type="url"
                    value={race.officialUrl}
                    maxLength={500}
                    onChange={(event) => updateRace(index, { officialUrl: event.target.value })}
                  />
                </label>
                <label className="ownerFieldWide">
                  Note
                  <textarea
                    value={race.note}
                    maxLength={240}
                    onChange={(event) => updateRace(index, { note: event.target.value })}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
        <button
          className="ownerAdd"
          type="button"
          onClick={() =>
            setContent((current) => ({
              ...current,
              races: [
                ...current.races,
                {
                  slug: freshId("race"),
                  name: "New race",
                  shortName: "New race",
                  distanceKm: 10,
                  location: "Location",
                  date: new Date().toISOString().slice(0, 10),
                  status: "considering",
                  registrationStatus: "Considering",
                  officialUrl: "https://example.com/",
                  note: "Add a note.",
                },
              ],
            }))
          }
        >
          <Plus size={15} /> Add race
        </button>
      </details>

      <div className="ownerSaveBar ownerSaveBarBottom">
        <p>{message}</p>
        <button
          className="button buttonPrimary"
          type="button"
          disabled={saving}
          onClick={() => void save()}
        >
          <Save size={16} /> {saving ? "Saving…" : "Save all changes"}
        </button>
      </div>
    </section>
  );
}
