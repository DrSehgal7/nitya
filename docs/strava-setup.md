# Strava sync setup notes

> Automatic synchronization is currently paused. Nitya uses the owner-maintained kilometres and as-of date until API access is available. The script below is retained for a later server-side integration; the verification workflow does not execute it.

The site already links to [Hritik’s public Strava profile](https://www.strava.com/athletes/127677454). Logging into Strava with Gmail creates/authenticates the Strava account, but the Nitya build also needs a private API application authorization before it can read public runs automatically.

The site requests read-only activity access and publishes only activities explicitly marked `Everyone`. It does not publish maps, coordinates, heart rate, private notes, devices, or non-running activities.

## 1. Create the API application

1. Sign in to Strava and open [My API Application](https://www.strava.com/settings/api).
2. Create an application named `Nitya`.
3. Use the public Nitya URL as the website.
4. Set the authorization callback domain to the production Vercel or custom domain.
5. Save the client ID and client secret somewhere private. Never add them to this repository or expose them as `PUBLIC_*` environment variables.

## 2. Authorize Hritik’s account once

Open this URL after replacing `CLIENT_ID` with the API application’s client ID:

```text
https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=https%3A%2F%2Fdrsehgal7.github.io%2Fnitya%2F&approval_prompt=force&scope=read%2Cactivity%3Aread
```

After approval, Strava redirects to Nitya with a `code` query parameter. Exchange that short-lived code for tokens using Strava’s documented OAuth token endpoint. Do not paste the client secret or returned tokens into an issue, chat, commit, or browser-side code.

The returned `refresh_token` is the value needed by the private server-side sync. The access token itself is short-lived and should not be saved in client-side code.

## 3. Add private server variables

If this integration is reactivated, add these as sensitive Vercel environment variables—not public variables:

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REFRESH_TOKEN`

## 4. Test the dormant sync locally

Run `npm run sync:strava` only in a trusted environment containing those variables. The command should report how many public runs were included and update the privacy-filtered snapshot.

No scheduled workflow currently runs this command. A production schedule or webhook should be designed only after Strava API access is available and the server-side storage model is approved. If Strava is unavailable, the dated manual snapshot remains visible instead of breaking the page.

Vercel can host a webhook receiver later, but authentication, privacy filtering, replay protection, rate limits, and token rotation must be handled before enabling one.

Strava can return a newer refresh token during token refresh. If a future sync returns `401`, repeat the one-time authorization and replace `STRAVA_REFRESH_TOKEN` with the newest value; do not expose it in client-side code.

## Privacy checks

- Keep intended website activities set to `Everyone` in Strava.
- Confirm that Followers-Only and Only You activities do not appear after a deployment.
- Review public activity names; activity titles are published exactly as written, limited to 120 characters.
- Revoke the Nitya application in Strava if the connection should stop.

Official references:

- [Strava authentication](https://developers.strava.com/docs/authentication/)
- [List athlete activities](https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities)
- [Strava rate limits](https://developers.strava.com/docs/rate-limits/)
- [Strava API brand guidelines](https://developers.strava.com/guidelines/)
