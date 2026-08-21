# Nitya

A small daily mission: improve life deliberately, give without guilt, and keep the numbers honest.

This repository contains a **Next.js + TypeScript** application deployed on Vercel. It includes a fixed animated Project Nitya counter, an inline trail-style race calendar, a shared race-idea board, a read-only public habit challenge, dark and light themes, a browser-only spending exercise, a private collaboration inbox, and a Google-authenticated owner studio backed by private Vercel Blob storage.

## Run locally

Use the Node version in `.nvmrc`—`22.12.10` does not exist; the intended release is `22.12.0`.

```sh
nvm install 22.12.0
nvm use
npm install
npm run dev
```

Open:

- Home: `http://127.0.0.1:3000/`
- Race trail: `http://127.0.0.1:3000/#races`
- Owner content studio: `http://127.0.0.1:3000/owner`

## Verify

```sh
npm run format:check
npm run check
npm test
npm run build
npm run test:e2e:local
```

## Content

- Current typed habits, goals, initiatives, and public claims: `src/data/content.ts`
- Manual weekend running total and as-of date: `runningSnapshot` in `src/data/content.ts`
- Homepage composition: `src/app/page.tsx`
- Race track and trail: `src/components/RaceTrail.tsx`
- Animated section treatment: `src/components/SectionMotion.tsx`
- Shared race suggestions and voting: `src/components/RaceIdeasBoard.tsx`
- Public habit challenge: `src/components/HabitChallenge.tsx`
- Contact/profile details: `src/data/site.ts`
- Confirmed races and race suggestion: `src/data/races.ts`
- Strava snapshot: `src/data/strava.generated.json`
- Global design and themes: `src/app/globals.css`

Public money, impact, and running totals begin at zero. Checked-in values are safe fallbacks; successful saves from `/owner` become the production source of truth.

## Contact form

The coffee/help form requires only a name and note. Email, Instagram, and reason for writing are optional. Each note is saved as a separate private Blob record and appears under **Messages** at `/owner`; nothing is published publicly. Hritik can refresh and delete notes from that inbox.

## Strava

The page currently uses the dated manual running snapshot and links to Hritik's public profile. Gmail authentication alone does not authorize API access. The dormant sync script is retained for a possible future server-side Strava connection, but no scheduled workflow currently runs it. See [the Strava setup notes](docs/strava-setup.md).

## Race ideas without a traditional database

The race board starts empty. Suggestions and votes are shared across visitors through a separate private Blob snapshot. Google sign-in is required, and the API accepts at most one vote from each Google account for an idea. The vote control is a toggle, so the same account can remove its own vote without affecting anyone else's. Duplicate race/location submissions become upvotes only when that account has not already voted. The suggesting account can delete its idea while it still has one vote. Emails are converted to keyed, non-reversible identifiers before storage and are never returned by the public API.

## Habit participation

Each challenge habit has an account-protected thumbs-up toggle and a shared participant count. The first click joins that habit and a second click leaves it. The private Blob snapshot stores only keyed, non-reversible account identifiers—not Google email addresses.

## Owner dashboard

`/owner` is protected by Google authentication and an exact server-side `OWNER_EMAIL` check. The studio includes the private Messages inbox and edits running distance/date, monthly savings and people impacted, habits, milestone-based goals, and confirmed races. Every write is authenticated, validated, and saved to private Blob storage. See [the owner dashboard guide](docs/content-editing.md).

## Deploy

Import this GitHub repository into Vercel. Vercel detects Next.js and deploys pushes to `main`; pull requests receive preview deployments. GitHub Actions now verifies formatting, types, tests, and the production build, but does not publish GitHub Pages.

Follow [the Vercel setup guide](docs/vercel-setup.md). Set `NEXT_PUBLIC_SITE_URL` to the final Vercel or custom-domain URL so metadata, the sitemap, and form redirects use the production address.

See [the implementation plan](docs/implementation-plan.md) for scope, release gates, and next steps.
