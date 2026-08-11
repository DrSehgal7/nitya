# Nitya

A small daily mission: improve life deliberately, give without guilt, and keep the numbers honest.

This repository contains a **Next.js + TypeScript** application deployed on Vercel. It includes a fixed animated Project Nitya counter, an inline trail-style race calendar, a shared race-idea board, a read-only public habit challenge, dark and light themes, a browser-only spending exercise, an email-based collaboration form, and a Google-authenticated owner studio backed by private Vercel Blob storage.

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

The coffee/help form sends submissions to `sarojhritik@gmail.com` through [FormSubmit](https://formsubmit.co/). The first real submission triggers a one-time activation email. Approve that email before publicly launching the form.

## Strava

The page currently uses the dated manual running snapshot and links to Hritik's public profile. Gmail authentication alone does not authorize API access. The dormant sync script is retained for a possible future server-side Strava connection, but no scheduled workflow currently runs it. See [the Strava setup notes](docs/strava-setup.md).

## Race ideas without a traditional database

The race board starts empty. Suggestions and votes are shared across visitors through a separate private Blob snapshot. Duplicate race/location submissions become upvotes, and the originating browser can delete its suggestion while it still has one vote. Creator identifiers remain private and are never returned by the public API.

## Owner dashboard

`/owner` is protected by Google authentication and an exact server-side `OWNER_EMAIL` check. The studio edits running distance/date, monthly savings and people impacted, habits, goals, and confirmed races. Every write is authenticated, validated, and saved to private Blob storage. See [the owner dashboard guide](docs/content-editing.md).

## Deploy

Import this GitHub repository into Vercel. Vercel detects Next.js and deploys pushes to `main`; pull requests receive preview deployments. GitHub Actions now verifies formatting, types, tests, and the production build, but does not publish GitHub Pages.

Follow [the Vercel setup guide](docs/vercel-setup.md). Set `NEXT_PUBLIC_SITE_URL` to the final Vercel or custom-domain URL so metadata, the sitemap, and form redirects use the production address.

See [the implementation plan](docs/implementation-plan.md) for scope, release gates, and next steps.
