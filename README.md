# HabitFlow

A calm, minimal web app for tracking daily habits. Built with Next.js, Tailwind CSS and Supabase, and deployed on Vercel.

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

3. Start the dev server:

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
