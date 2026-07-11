# Corestack — Design Spec

**Date:** 2026-06-29  
**Status:** Approved  

## Overview

Corestack is a niche job board for the data center industry: operations, construction, electrical/power, cooling/mechanical, and networking. The front end is built with Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui, backed by Supabase (Postgres + Auth). Payments are stubbed (mock checkout, no real Stripe). All data access is behind a typed `lib/api.ts` module.

---

## Architecture

**Approach: RSC + Server Actions (Option A)**

- Server Components handle all reads via `lib/api.ts` server functions (Supabase server client).
- Writes go through Next.js Server Actions (`app/actions/`).
- Client components are confined to interactive islands: `JobFilters`, `PayWhatYouWishField`, `PostJobForm`, `AuthForm`, `AuthGate`, `NewsTicker`, dashboard tab switcher.
- No component imports Supabase directly — all calls go through `lib/api.ts` or server actions.

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx                  # root layout: MosaicNav + NewsTicker + footer
│   ├── page.tsx                    # homepage
│   ├── jobs/
│   │   ├── page.tsx                # browse/listings (searchParams: category, location, remote, search)
│   │   └── [id]/page.tsx           # job detail
│   ├── post/
│   │   ├── page.tsx                # post a job form
│   │   └── confirm/page.tsx        # mock checkout confirmation
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/
│   │   └── page.tsx                # tabs: Applications / Saved / My Listings
│   ├── news/page.tsx
│   ├── resources/page.tsx
│   └── actions/
│       ├── jobs.ts                 # createJob, updateJobStatus server actions
│       ├── applications.ts         # applyToJob server action
│       └── saved.ts                # saveJob, unsaveJob server actions
├── components/
│   ├── nav/
│   │   ├── MosaicNav.tsx           # grid of square tiles, hover invert/accent
│   │   └── NewsTicker.tsx          # full-width scrolling ticker, pauses on hover
│   ├── jobs/
│   │   ├── JobCard.tsx             # title, company, location, category, salary, date
│   │   ├── JobFilters.tsx          # client — updates URL query params
│   │   └── JobGrid.tsx             # grid wrapper
│   ├── post/
│   │   ├── PayWhatYouWishField.tsx # client — slider + numeric input, $5–$500, default $99
│   │   └── PostJobForm.tsx         # client — full post-job form with inline validation
│   ├── auth/
│   │   ├── AuthForm.tsx            # client — sign in + sign up, honors ?next= param
│   │   └── AuthGate.tsx            # client — wraps Apply button, shows sign-in dialog if signed out
│   └── ui/                         # shadcn primitives (all border-radius: 0)
├── lib/
│   ├── supabase/
│   │   ├── server.ts               # createServerClient (RSC / Server Actions)
│   │   ├── client.ts               # createBrowserClient (client components)
│   │   └── middleware.ts           # updateSession helper
│   ├── api.ts                      # ALL data access — typed functions wrapping Supabase
│   └── types.ts                    # Database type map + domain types
├── middleware.ts                    # protects /dashboard, refreshes session cookies
├── supabase/
│   ├── migrations/
│   │   └── 0001_init.sql           # schema + RLS policies + trigger
│   └── seed.sql                    # 25–35 jobs, 10–15 news, 8–10 resources
├── .env.local                       # NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY (blank)
└── README.md
```

---

## Design System

**Inspiration:** Vercel / Geist — clean, high-contrast, generous whitespace, sharp edges.

**Palette:**
- Background: `#ffffff`
- Text / borders / primary: `#000000`
- Accent (hover, focus ring): `#3ecf8e`

**Border radius:** `0` globally. Set `--radius: 0` in CSS vars, override shadcn, apply `* { border-radius: 0 !important }` in `@layer base` as belt-and-suspenders.

**Buttons:**
- Default: white background, 1px black border, black text
- Hover: background shifts to `#3ecf8e`, text stays black — `hover:bg-accent hover:text-black`
- Heavy CTA only (e.g. hero "Post a Job", nav "Post a Job"): black bg + white text, hover shifts to accent
- Transition: `transition-colors duration-150` only — never `transition: all`

**Focus ring:** `focus-visible:ring-2 focus-visible:ring-[#3ecf8e] ring-offset-0` — applied via Tailwind base layer, consistent on all interactive elements. Never stripped without replacement.

**Typography:**
- `text-wrap: balance` on `h1`–`h3` via base layer
- `tabular-nums` for salary columns and numeric counts
- Real ellipsis `…`, curly quotes, non-breaking spaces where appropriate

**MosaicNav:**
- CSS grid of fixed-height rectangular tiles, zero gap, 1px black borders between tiles
- Each tile is a `<Link>` — hover: `bg-black text-white` or `bg-accent text-black` (logo tile fixed)
- Collapses to icon-only or hamburger drawer on mobile
- Sign-out tile visible only when session exists

**NewsTicker:**
- Full-width strip below nav, `overflow: hidden`, `white-space: nowrap`
- Inner list duplicated for seamless CSS `@keyframes scroll-x` loop using `transform: translateX`
- `@media (prefers-reduced-motion: reduce)`: animation removed, static fallback list shown
- `animation-play-state: paused` on hover

---

## Database Schema

```sql
-- Enum
CREATE TYPE job_category AS ENUM (
  'operations', 'construction', 'electrical_power', 'cooling_mechanical', 'networking'
);
CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE profile_role AS ENUM ('seeker', 'employer');

-- profiles
CREATE TABLE profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name  text,
  role          profile_role NOT NULL DEFAULT 'seeker',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- jobs
CREATE TABLE jobs (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title              text NOT NULL,
  company            text NOT NULL,
  location           text NOT NULL,
  category           job_category NOT NULL,
  remote             boolean NOT NULL DEFAULT false,
  description        text NOT NULL,
  salary_min         integer,
  salary_max         integer,
  apply_target       text NOT NULL,
  posted_by          uuid REFERENCES profiles ON DELETE SET NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),
  status             job_status NOT NULL DEFAULT 'active',
  paid_amount_cents  integer NOT NULL DEFAULT 0
);

-- applications
CREATE TABLE applications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        uuid NOT NULL REFERENCES jobs ON DELETE CASCADE,
  applicant_id  uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, applicant_id)
);

-- saved_jobs
CREATE TABLE saved_jobs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid NOT NULL REFERENCES jobs ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, user_id)
);

-- news
CREATE TABLE news (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline      text NOT NULL,
  source        text NOT NULL,
  url           text NOT NULL,
  excerpt       text,
  published_at  timestamptz NOT NULL DEFAULT now()
);

-- resources
CREATE TABLE resources (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  type         text NOT NULL CHECK (type IN ('cert', 'school', 'program')),
  provider     text NOT NULL,
  url          text NOT NULL,
  description  text
);
```

**Trigger — auto-create profile on signup:**
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, display_name, role)
  VALUES (new.id, new.email, 'seeker');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**RLS Policies:**
- `jobs`: anon + authed SELECT where status = 'active'; authed INSERT where posted_by = auth.uid(); owner UPDATE/DELETE own rows
- `applications`: authed INSERT where applicant_id = auth.uid(); authed SELECT own rows only
- `saved_jobs`: authed INSERT/DELETE/SELECT where user_id = auth.uid()
- `profiles`: authed SELECT/UPDATE own row; INSERT via trigger only
- `news`, `resources`: public SELECT, no client writes

---

## Data Layer

### `lib/types.ts`

```ts
export type Category = 'operations' | 'construction' | 'electrical_power' | 'cooling_mechanical' | 'networking'
export type JobStatus = 'active' | 'closed' | 'draft'
export type ProfileRole = 'seeker' | 'employer'

export interface Job {
  id: string; title: string; company: string; location: string;
  category: Category; remote: boolean; description: string;
  salary_min: number | null; salary_max: number | null; apply_target: string;
  posted_by: string | null; created_at: string; status: JobStatus; paid_amount_cents: number;
}
export interface Application { id: string; job_id: string; applicant_id: string; created_at: string }
export interface SavedJob    { id: string; job_id: string; user_id: string; created_at: string }
export interface NewsItem    { id: string; headline: string; source: string; url: string; excerpt: string | null; published_at: string }
export interface Resource    { id: string; name: string; type: 'cert' | 'school' | 'program'; provider: string; url: string; description: string | null }
export interface Profile     { id: string; display_name: string | null; role: ProfileRole; created_at: string }
```

### `lib/api.ts` — exported functions

```
// Jobs (server — RSC)
getJobs(filters?)           → Job[]
getJob(id)                  → Job

// Server Actions (app/actions/)
createJob(payload)          → Job
updateJobStatus(id, status) → void
applyToJob(jobId)           → { apply_target: string }   // records application, returns redirect target
saveJob(jobId)              → SavedJob
unsaveJob(jobId)            → void

// Dashboard (server — RSC, scoped to auth.uid())
getUserApplications()       → (Application & { job: Job })[]
getUserSavedJobs()          → (SavedJob & { job: Job })[]
getPostedJobs()             → Job[]

// News & Resources (server — RSC)
getNews()                   → NewsItem[]
getResources()              → Resource[]
```

Components call server actions for mutations. RSCs call `lib/api.ts` directly for reads. No component imports `supabase`.

---

## Pages

### `/` — Homepage
RSC. Latest 12 jobs + latest 6 news for ticker. Sections: hero ("The job board for the people building the cloud" + "Post a Job" CTA), stats strip (job count, category count, company count — derived from data), `JobGrid` of recent listings, second CTA block.

### `/jobs` — Browse
RSC. Reads `searchParams` (category, location, remote, search) → `getJobs(filters)`. `JobFilters` client component updates URL via `router.replace`. `JobGrid` below. Simple load-more pagination.

### `/jobs/[id]` — Job Detail
RSC. `getJob(id)`. Full markdown description rendered via `react-markdown`. `AuthGate` wraps Apply button: signed out → sign-in dialog with `?next=/jobs/[id]`; signed in → `applyToJob` server action → `window.open(apply_target)` + toast. Saved-job toggle alongside.

### `/post` — Post a Job
Client form. Inline validation. `PayWhatYouWishField`: slider + numeric input synced, $5–$500, default $99. On valid submit → saves draft to `sessionStorage` → `router.push('/post/confirm')`.

### `/post/confirm` — Mock Checkout
Client page. Reads draft from `sessionStorage`. Shows job summary + chosen amount. "Complete Post — $X" button → `createJob` server action → redirects to `/jobs/[id]`. Spinner during submission.

### `/signin` + `/signup`
`AuthForm` client component. Supabase `signInWithPassword` / `signUp`. Honors `?next=` param. OAuth provider button slots present but disabled.

### `/dashboard`
Middleware-protected RSC shell. Client tab switcher. Three tabs, each server-rendered:
- **Applications:** `getUserApplications()` — title, company, date, link to job
- **Saved:** `getUserSavedJobs()` — card layout, unsave action
- **My Listings:** `getPostedJobs()` — status badge, close/reopen action
All tabs have empty states with CTAs.

### `/news`
RSC. `getNews()`. Card grid: headline, source, date, excerpt, external link.

### `/resources`
RSC. `getResources()`. Cards grouped by type (Programs, Certifications, Schools). Meta's data center technician training program in seed data.

---

## Auth Flow

**Supabase clients:**
- `lib/supabase/server.ts` — `createServerClient` with `cookies()` from `next/headers`
- `lib/supabase/client.ts` — `createBrowserClient`
- `lib/supabase/middleware.ts` — `updateSession(request)` refreshes cookie on every request

**`middleware.ts`:**
- Matcher: all routes except `_next/static`, `_next/image`, `favicon.ico`
- Calls `updateSession` on every request
- Redirects unauthenticated requests to `/dashboard` → `/signin?next=/dashboard`

**Sign-up:** `signUp` → trigger creates profile → session cookie set → redirect to `next` or `/dashboard`

**Sign-in:** `signInWithPassword` → session cookie set → redirect to `next` or `/dashboard`

**Apply gate:** `AuthGate` checks session on mount. Signed out → shadcn `<Dialog>` with `AuthForm`. Signed in → `applyToJob` server action → `window.open(apply_target)` + toast.

**Sign-out:** Mosaic nav tile (auth-only) → `supabase.auth.signOut()` → `router.push('/')`

---

## Accessibility & Quality

Follows Vercel Web Interface Guidelines throughout:
- Semantic HTML: `<button>` for actions, `<Link>/<a>` for navigation, never `<div onClick>`
- Icon-only buttons: `aria-label` required
- Every form control has a real `<label>`
- Decorative icons: `aria-hidden="true"`
- Hierarchical headings per page
- Async updates: `aria-live="polite"` on toast/status regions
- `focus-visible:ring-2 ring-[#3ecf8e]` on all interactive elements
- Form inputs: correct `type`, `inputmode`, `autocomplete`; inline errors adjacent to field; first error focused on submit
- Submit button: enabled until request starts, then shows spinner
- Placeholders end with `…`; paste never blocked
- `prefers-reduced-motion`: ticker falls back to static list; no hover animations
- `tabular-nums` on all salary/count columns
- Truncate long strings with `line-clamp` + `min-w-0` on flex children
- URL reflects filter, tab, and pagination state at all times

---

## Seed Data

- **Jobs:** 25–35 across all five categories; companies include hyperscalers, colos (Equinix, CyrusOne, Iron Mountain), and contractors; locations cover Ashburn VA, Dallas TX, Phoenix AZ, Atlanta GA, Columbus OH, plus remote; salary ranges realistic for each role
- **News:** 10–15 items with realistic data center industry headlines, sources, and dates
- **Resources:** 8–10 entries including Meta's Data Center Technician Training Program, Schneider Electric training, BICSI certifications, CompTIA Server+, trade schools with data center programs

---

## Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Data architecture | RSC + Server Actions | Best SEO, least moving parts, idiomatic App Router |
| Apply flow | Record + redirect | Writes to `applications` table then opens `apply_target` |
| Job description input | Markdown textarea | No extra deps; rendered via `react-markdown` on detail page |
| Default pay-what-you-wish | $99 | Mid-range anchor for niche board |
| Default button style | White bg + black border | Secondary/outlined; heavy CTA uses black bg + white text |
| Payments | Stubbed mock checkout | Placeholder for future Stripe integration |
| OAuth | Slots present, disabled | Easy to enable later without structural changes |
