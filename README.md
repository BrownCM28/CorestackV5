# Corestack

A modern job board and resource discovery platform built with Next.js and Supabase.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS with shadcn components
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Testing:** Vitest with React Testing Library

## Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)
- A Supabase account (free tier works)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd Corestack-v1
npm install
```

### 2. Set up Supabase

1. **Create a project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your **Project URL** and **anon key** (both in Settings > API)

2. **Configure environment**
   - Copy `.env.local.example` to `.env.local` (or create it)
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
     ```

3. **Run migrations**
   - Open the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/migrations/0001_init.sql` and run it
   - Copy the contents of `supabase/seed.sql` and run it

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/jobs` | Browse jobs |
| `/jobs/[id]` | Job details |
| `/news` | News feed |
| `/resources` | Resource library |
| `/post` | Create a new post |
| `/post/confirm` | Post confirmation |
| `/signin` | Sign in page |
| `/signup` | Sign up page |
| `/dashboard` | User dashboard |

## Architecture

### Data Boundary

This project maintains a strict data boundary:

- **Read:** `lib/api.ts` — all database reads go through this module
- **Write:** `app/actions/` — all mutations (create, update, delete) use Server Actions
- **Never:** Components do not import from `@supabase/supabase-js` directly

This keeps logic centralized and makes the data flow predictable.

### Key Files

- `lib/api.ts` — query functions for reads
- `app/actions/` — Server Actions for mutations
- `lib/supabase/` — Supabase client setup (browser + server)
- `lib/types.ts` — shared TypeScript types

## Testing

```bash
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
```

Tests use Vitest and React Testing Library. Test files live alongside source code as `*.test.ts`.

## Development

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint

## Branch Info

This work is on `feature/corestack-build`. Merge to `main` when ready.
# CorestackV5
