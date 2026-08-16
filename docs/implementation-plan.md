# Nitya public site — implementation plan

Status: **Vercel migration prepared; deployment and owner dashboard authentication pending**  
Stack: **Next.js 16, React 19, TypeScript, Vercel server runtime**  
Target: **Vercel production URL to be assigned**

## Product direction

Nitya is a personal public ledger and an invitation, not a fundraising campaign. It explains Hritik's mission, the habits behind it, how giving is handled, the next races, and how someone can help or meet for coffee.

The implementation uses the supplied artifact as its editorial direction: oversized Instrument Serif display type, Manrope body type, deep charcoal as the default theme, warm paper as the optional light theme, brick-red accents, thin borders, purposeful icons, and restrained runner motion.

## Implemented routes

- `/` — the complete artifact story, repeated animated day counters and runners, illustrated commitment, founder story, initiatives, money handling and ledger, animated goals, horizontal race timeline, winding checkpoint trail, private spending analyser, live Strava/kilometre sponsor pairing, Google-account-protected race voting, six-card habit challenge, Instagram, and coffee/help form.
- `/owner` — a no-index reserved owner dashboard; authentication and form persistence are the next implementation phase.
- `/privacy/` — plain-language form, Strava, and external-link privacy details.
- `/thanks/` — form success page.
- Static not-found page, sitemap, robots, sharing card, and favicon.

## Public-data rules

- Public totals and impact wording follow the owner-supplied artifact and must receive an explicit factual review before launch; `₹X` remains a visible placeholder until the baseline is entered.
- Every race date links to an official organiser and is maintained in typed source data.
- Strava publishes only activities visible to everyone and only name, date, distance, moving time, elevation, type, and activity URL.
- Maps, coordinates, heart rate, devices, notes, and private/followers-only activities are excluded.
- Spending-analyser values stay in the visitor's browser.
- The contact form collects only the details needed to reply and requires explicit consent.

## Race calendar decision

The race calendar belongs in the homepage story. A horizontal season overview leads into a winding trail map where every typed race becomes a checkpoint, links to its official organiser, and participates in the next-race countdown.

Confirmed calendar:

| Race                        |  Distance | Date              | Official source                      |
| --------------------------- | --------: | ----------------- | ------------------------------------ |
| Ladakh Marathon             | 42.195 km | 13 September 2026 | `ladakhmarathon.com`                 |
| Vedanta Delhi Half Marathon | 21.097 km | 18 October 2026   | `vedantadelhihalfmarathon.procam.in` |
| Tata Steel World 25K        |     25 km | 20 December 2026  | `tatasteelworld25k.procam.in`        |
| Tata Mumbai Marathon        | 42.195 km | 17 January 2027   | `tatamumbaimarathon.procam.in`       |

Suggested follow-up: TCS World 10K Bengaluru on 25 April 2027—a shorter speed-focused goal after the marathon block.

## Technical delivery

- Server-capable Next.js deployment at the domain root on Vercel.
- Typed content in `src/data` with race validation tests.
- CSS custom properties for persistent light/dark themes, with dark as the first-visit default.
- Dated manual running snapshot with the dormant privacy-filtered Strava sync retained for later.
- Reserved owner dashboard with server-side authorization to be implemented after Vercel setup and field review.
- FormSubmit email delivery with honeypot and direct Instagram/email alternatives.
- Vitest unit tests and Playwright desktop/mobile smoke tests.
- GitHub Actions verification plus Vercel Git deployments and previews.

## Review and launch gates

1. **Local owner review:** design, copy, light/dark themes, mobile layout, race details, and public fields.
2. **Real-data review:** replace blank ledger values only with verified records and an agreed methodology.
3. **Vercel connection:** import the repository, set the canonical production URL, and review the generated domain.
4. **Owner dashboard:** agree all owner-managed fields, then add the single-owner login, validated forms, and persistence.
5. **Integration activation:** approve FormSubmit's activation email; keep Strava manual until its API access is available.
6. **Release candidate:** test the Vercel production URL, authentication boundary, links, metadata, form, and mobile layouts.
7. **Public launch:** owner explicitly approves the content and data; tag the reviewed commit.

## Later phases

- A dated, itemised public ledger with supporting records.
- Moderated community/provider profiles; never auto-publish submissions.
- Race reports and past results.
- Near-real-time Strava webhooks through a small serverless receiver, only if the hourly build sync is too slow.
- Contributions only after payment, receipts, reconciliation, refunds, legal language, and cause verification are designed.
