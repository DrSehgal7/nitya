# Owner dashboard

`/owner` is the private publishing studio for Nitya. Unauthenticated visitors are redirected to `/owner/sign-in`; Google sign-in succeeds only when the returned email exactly matches `OWNER_EMAIL`.

## Messages inbox

Public contact-form notes appear at the top of `/owner` under **Messages**. Only name and note are required; email, Instagram, and reason for writing may be blank. Use **Refresh inbox** to load new submissions without leaving the page. Deleting a message permanently removes its private Blob record.

The previous FormSubmit handoff is no longer used. Notes submitted before this inbox was deployed are not imported; if FormSubmit accepted one, it would only be in the configured email account.

## Editable content

- Annual running kilometres and the as-of date.
- Monthly savings and people positively impacted.
- Habits, including icon, description, a flexible status, saved amount, and last update. Habit
  percentages are intentionally not collected or shown.
- Public goals, including category, current update, last update, and any number of checklist
  milestones. A goal's overall status and completion are calculated from those milestones.
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
