# Nitya — product and implementation direction

Status: **public MVP on Vercel; owner-managed content enabled**
Stack: **Next.js, React, TypeScript, Vercel Functions and private Vercel Blob storage**

## One-sentence purpose

Nitya is Hritik's self-funded public promise to help 100 people in practical, visible ways and share the results honestly.

## What the site is—and is not

The mission is practical help. The homepage explains the promise, where the help is intended to go, the current verified numbers and how someone can share a need, useful skill or introduction.

The site does not collect donations or payments. It is not a coaching service, fundraising campaign or workout tracker. Hritik's habits, personal goals and events do not count as impact; they are linked as clearly labelled personal pages rather than mixed into the contribution story.

## Public routes

- `/` — the mission, simple process, focus areas, verified numbers, contribution options, transparency notes and contact form.
- `/about` — Hritik's personal story and reason for starting Nitya. It contains no running pitch, fitness tracker or sponsored-distance contribution.
- `/work` — the habits Hritik is building and updating in public.
- `/goals` — Hritik's personal goals and their smaller checkpoints.
- `/events` — Hritik's event calendar and account-protected event suggestions.
- `/habits` — the separate account-protected page where visitors can join a habit.
- `/owner` — authenticated owner dashboard for public content, events and submitted notes.
- `/privacy` and `/thanks` — privacy details and form confirmation.

The homepage, header, footer and sitemap link to the personal pages, while their copy keeps them distinct from Nitya's verified impact.

## Product hierarchy

1. **Lead with the mission:** help 100 people in practical, measurable ways.
2. **Explain the loop once:** find a real need, help clearly, share the result.
3. **Show evidence:** verified savings and people helped, without exposing the private baseline amount.
4. **Invite useful contact:** needs, skills, introductions, collaboration or coffee.
5. **Keep the main journey small:** Home is the contribution story; About is the founder story.

## Data and safety rules

- The exact self-funded baseline remains private and is displayed only as `₹X`.
- Public totals must come from owner-reviewed monthly entries.
- Contact notes are private owner records; only name and note are required.
- Community participation uses Google accounts for one toggle per account and item.
- Spending-analysis values stay in the visitor's browser.
- Event dates link to official organisers and are maintained through typed owner content.
- Public running data remains manually updated until a privacy-filtered Strava connection is approved.

## Review gates

1. A first-time visitor can explain Nitya after reading the hero and three-step loop.
2. The homepage never asks the visitor to fund a run or treats exercise as impact.
3. The About page explains the founder story without turning running or fitness into contribution.
4. Only verified help is added to the public numbers.
5. Desktop and mobile flows pass automated accessibility, layout and interaction checks.
6. Hritik reviews copy and public data before each material production update.

## Later, only when the mission needs it

- A dated, itemised impact ledger with supporting records.
- Moderated provider profiles with explicit consent.
- Privacy-filtered Strava sync for the optional events page.
- Payment collection only after legal language, receipts, reconciliation and refunds are designed; it is not part of the current product.
