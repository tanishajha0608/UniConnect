# UniConnect

Split rides with UCR students going the same way. Post where you're leaving from, where you're going and a time window; UniConnect ranks students heading the same way, lets you request to split, and handles the chat and fare split. Only verified `@ucr.edu` emails can sign in.

## What's in the MVP

- **Sign in by email link**, restricted to `@ucr.edu`. No passwords. Links expire in 15 minutes and are rate limited.
- **Post a trip** from preset campus pickups to airports, transit, shopping and cities (`src/lib/places.ts`).
- **Matching** (`src/lib/matching.ts`): a database filter (nearby destination, overlapping time ±3 h) then a 0 to 100 score: time 35, destination 25, pickup 15, detour 15, group fit 10. Matches scoring 50+ are shown with reasons. All weights live in `MATCH_CONFIG` so they can be tuned.
- **Request and accept**: accepting creates a ride group (or adds to an existing one, up to 6 riders), with email alerts.
- **Ride page**: members, chat (polls every 5 s), one rider books, enters the fare, and everyone sees their share with a prefilled Venmo pay link. Riders mark themselves paid.
- **Safety**: first name + last initial until matched, report and block, auto-suspend after 3 reports from different people, `/admin` review queue, "text a friend your ride details", terms page. Trips are deleted 90 days after they end.

## Stack

Next.js 16 (App Router, server actions) · TypeScript · Tailwind CSS 4 · MongoDB + Mongoose · Resend · Vitest. Deploys to Vercel.

## Run it locally

```bash
npm install
cp .env.example .env.local   # set MONGODB_URI (Atlas free cluster or local mongod)
npm run dev
```

Open http://localhost:3000, sign in with any `@ucr.edu` address. Without `RESEND_API_KEY`, the sign-in link shows on the page and in the terminal.

Add your own email to `ADMIN_EMAILS` to see `/admin`.

## Checks

```bash
npm test          # matching, fare split, email and time-zone unit tests
npm run lint
npm run typecheck
npm run build
```

## Deploy (Vercel + Atlas)

1. Create a free MongoDB Atlas cluster, add a database user, and allow access from anywhere (Vercel uses changing IPs). Copy the connection string.
2. Create a Resend account, verify your sending domain, and create an API key.
3. Import this repo in Vercel and set the variables from `.env.example`, with `APP_URL` set to your Vercel or custom domain.
4. Deploy. The free Vercel Hobby plan is for non-commercial use, so move to Pro before adding ads.

## Not built yet

Push/SMS notifications, recurring trips, ratings, driver mode with gas split, Google Places search for custom addresses, and analytics/A-B testing of match thresholds. See the PRD for the full plan.
