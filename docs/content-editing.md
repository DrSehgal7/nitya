# Owner dashboard

Nitya is moving from static GitHub Pages to a server-capable Vercel deployment. The goal is for Hritik to update public information from `/owner` without opening or editing repository files.

## Current transition state

- `/owner` is reserved for the private dashboard.
- No public browser-side edit controls or client-side PIN exist.
- The dashboard form remains unavailable until authentication and persistence are configured.
- The existing source values remain read-only public fallbacks during the transition.

## First owner-managed record

The first dashboard form will update:

- Total running kilometres.
- The date through which the total is accurate.

The public sponsorship/Strava card and `Run 1,000 km this year` goal will read the same validated record and show a small dated note below the total.

## Planned owner flow

1. Open `/owner`.
2. Sign in with the single approved owner identity.
3. Edit values through validated form controls.
4. Review the exact public result.
5. Save and publish.

Authentication will be checked on the server for every read and write. Hiding a button in the browser is not authorization.

## Extending the dashboard

Habits, goals, initiatives, confirmed races, and public numbers can use the same owner boundary later. Their fields and validation should be agreed before persistence is implemented so the storage format does not need repeated migrations.

Service credentials and authentication secrets belong in Vercel environment variables and must never use a `NEXT_PUBLIC_` prefix.
