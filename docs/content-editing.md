# Owner dashboard

`/owner` is the private publishing studio for Nitya. Unauthenticated visitors are redirected to `/owner/sign-in`; Google sign-in succeeds only when the returned email exactly matches `OWNER_EMAIL`.

## Editable content

- Annual running kilometres and the as-of date.
- Monthly savings and people positively impacted.
- Habits, including icon, description, status, saved amount, progress, and last update.
- Public goals, including category, status, current update, progress, and last update.
- Race-calendar checkpoints, dates, distance, location, status, official link, and note.

The private ₹X commitment is intentionally absent from the editable public ledger.

## Persistence

Owner content is validated by `src/lib/content-validation.ts` and stored as immutable JSON snapshots in the private `nitya-content` Vercel Blob store. The newest valid snapshot becomes the public source of truth. Checked-in values in `src/data/content.ts` and `src/data/races.ts` remain safe fallbacks for local development or temporary storage failure.

Race suggestions use a separate private snapshot so a stale owner form cannot overwrite community votes.

## Required Vercel configuration

```text
AUTH_GOOGLE_ID=<Google OAuth client ID>
AUTH_GOOGLE_SECRET=<Google OAuth client secret>
AUTH_SECRET=<random server secret>
OWNER_EMAIL=sarojhritik@gmail.com
NEXT_PUBLIC_SITE_URL=https://nitya-project.vercel.app
```

The connected Blob store supplies `BLOB_STORE_ID` and Vercel's short-lived OIDC credentials. None of these values may use a `NEXT_PUBLIC_` prefix except the canonical site URL.

Google's authorized production callback is:

```text
https://nitya-project.vercel.app/api/auth/callback/google
```

After changing any environment variable, create a new deployment. Existing deployments do not inherit later variable changes.
