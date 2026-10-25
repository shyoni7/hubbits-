# HabitFlow

A calm, minimal web app for tracking daily habits. Built with Next.js, Tailwind CSS and Supabase, and deployed on Vercel.

**Live site:** https://hubbits.vercel.app

## Features

- Email and password accounts (Supabase Auth) with email confirmation
- Create, edit, archive and delete habits (name, emoji, color, days per week)
- One tap to check off today, with instant (optimistic) feedback
- Current streak, best streak and a 30 day history grid for every habit
- Daily progress ring, weekly completion and longest active streak
- Every user sees only their own data, enforced by Row Level Security

## Setup

Requirements: Node.js 20 or newer, npm, and a Supabase project.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env.local
   ```

   Fill in both values from Supabase, under **Project Settings > API Keys**:

   - `NEXT_PUBLIC_SUPABASE_URL`: the project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the publishable key (`sb_publishable_...`)

   Never use the secret or `service_role` key. `.env.local` is git-ignored.

3. Create the database tables: open your Supabase project, go to **SQL Editor**, paste the contents of `supabase/migrations/001_init.sql` and click **Run**. Run every file in `supabase/migrations/` in order. The files are safe to run more than once.

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000. If the variables are missing, the app shows a setup message instead of crashing.

## Scripts

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server             |
| `npm run build` | Production build (must pass)     |
| `npm run lint`  | Run ESLint                       |
| `npm test`      | Run unit tests (Vitest)          |

## Supabase Auth URLs

In Supabase, open **Authentication > URL Configuration**:

- **Site URL**: your live site, `https://hubbits.vercel.app`
- **Redirect URLs**, add:
  - `https://hubbits.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (for local development)

The confirmation email links to `/auth/callback`, which signs the user in and opens the dashboard.

### Confirmation email template (recommended)

By default the confirmation link only signs the user in automatically when it is opened in the same browser they signed up in. To make it work from any device (for example signing up on a laptop and opening the email on a phone), open **Authentication > Emails > Confirm signup** in Supabase and change the link to:

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/dashboard">Confirm your email</a>
```

## Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel (**Add New > Project**). `vercel.json` sets the Next.js framework preset, so no build settings are needed.
2. Under **Settings > Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Deploy, then set the Supabase Auth URLs above to your Vercel domain.
