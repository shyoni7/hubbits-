# HabitFlow

A web app for tracking daily habits.

@AGENTS.md

## Product

- Public landing page at `/` that explains the app, with Sign up and Log in buttons.
- Accounts with email + password via Supabase Auth: sign up, log in, log out. If Supabase requires email confirmation, show "Check your inbox" after sign up.
- Private `/dashboard`: create, edit, archive and delete habits. A habit has a name, emoji, color and a target of days per week.
- Each day the user checks off the habits they did. Show the current streak, best streak and a 30 day history grid for every habit, and the weekly completion percentage at the top of the page.
- Every user sees only their own data.

### Definitions

- **Streak**: consecutive days the habit was checked. If today is not checked yet, counting starts from yesterday, so an unchecked today does not break the streak. The weekly target does not affect streaks.
- **Week**: starts on Sunday.
- **Weekly completion**: for each active habit, check-ins from Sunday to today capped at its weekly target, summed and divided by the sum of the targets.
- **Today**: the calendar date in the user's time zone (browser time zone stored in a `tz` cookie).

## Design (current style, easy to change later)

- Dark, calm and minimal: near-black background, one bright accent color (`#3ECF8E`), rounded cards, soft shadows, Inter font, subtle animations.
- UI language: English. (Switching to Hebrew means translating the copy and setting `dir="rtl"`.)
- Fully responsive (mobile first) and accessible: labels, visible focus states, good contrast, respect `prefers-reduced-motion`.
- All colors and fonts are design tokens defined in one place: the `@theme` block in `app/globals.css`. Components use token utilities (`bg-surface`, `text-accent`) and never hard-code colors, so the whole look changes from that one file.

## Quality bar

- `npm run build` must pass (no TypeScript or lint errors) before a task counts as done. Also run `npm run lint` and `npm test`.
- Small, clear commits.
- Keep `README.md` updated with install and deploy instructions.

## Tech stack (must deploy to Vercel with zero extra config)

- Next.js (latest stable, App Router) + TypeScript + Tailwind CSS, npm, at the repo root.
- Supabase via `@supabase/supabase-js` + `@supabase/ssr`.
- `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server), and `proxy.ts` at the root (called `middleware.ts` before Next.js 16) that refreshes the session on every request.
- No separate backend server: only Server Components, Server Actions and Route Handlers.
- Next.js 16 runs with Cache Components: anything that reads cookies or the database renders inside a `<Suspense>` boundary (or a route with `loading.tsx`).

## Environment variables

- Only these two. Never write keys in code, and never use the secret or `service_role` key:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `.env.example` with empty values is committed. Local files (`.env*.local`) stay out of git.
- If the variables are missing, the app shows a friendly setup message instead of crashing.

## Folders

`app/` `components/` `lib/supabase/` `supabase/migrations/` `public/` `proxy.ts` `CLAUDE.md`

## Database rules

- Every schema change is a numbered SQL file in `supabase/migrations/` (e.g. `001_init.sql`). The owner runs them manually in the Supabase SQL Editor, so they must be safe to run more than once.
- Row Level Security is enabled on every table, with policies so each user can access only their own rows.
- All reads and writes go through the Supabase server client and rely on RLS. Server Actions validate every input.
