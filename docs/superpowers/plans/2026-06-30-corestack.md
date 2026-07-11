# Corestack — Implementation Plan

**Date:** 2026-06-30  
**Branch:** feature/corestack-build  
**Spec:** `docs/superpowers/specs/2026-06-29-corestack-design.md`

## Goal

Build the Corestack data-center job board: Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui + Supabase. All routes functional, auth gated, design system applied, seed data wired, README complete.

## Architecture

RSC + Server Actions. Server Components call `lib/api.ts` for reads. Writes go through `app/actions/`. No component imports Supabase directly. Client components: JobFilters, PayWhatYouWishField, PostJobForm, AuthForm, AuthGate, NewsTicker, DashboardTabs, SignOutTile.

## Tech Stack

- Next.js 15 App Router, TypeScript strict, Tailwind CSS
- shadcn/ui (all border-radius overridden to 0)
- Supabase: `@supabase/supabase-js`, `@supabase/ssr`
- react-markdown (job description rendering)
- Vitest + React Testing Library (unit tests)

## Design System Constants

- Background: `#ffffff`
- Text/borders: `#000000`
- Accent: `#3ecf8e`
- Border radius: `0` globally
- Default button: white bg, 1px black border, black text → hover: `bg-[#3ecf8e]`
- CTA button: black bg, white text → hover: `bg-[#3ecf8e]`
- Focus ring: `focus-visible:ring-2 focus-visible:ring-[#3ecf8e]`
- Transition: `transition-colors duration-150` only

---

## Task T01: Scaffold Next.js + shadcn/ui

**Files created:** All root project files via create-next-app, then shadcn init, then install extra deps.

### Steps

1. Run in `/Users/charlie.brown.tmp/stack-v1/Corestack-v1/`:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes 2>&1 | head -50
   ```
   If it asks about the existing directory, answer yes to proceed.

2. Install extra dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr react-markdown
   npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```

3. Init shadcn/ui (choose "New York" style, zinc base color):
   ```bash
   npx shadcn@latest init --yes --defaults
   ```
   Install needed primitives:
   ```bash
   npx shadcn@latest add button input label select slider dialog tabs badge toast --yes
   ```

4. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

5. Create `vitest.config.ts`:
   ```ts
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'
   import path from 'path'
   export default defineConfig({
     plugins: [react()],
     test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'] },
     resolve: { alias: { '@': path.resolve(__dirname, '.') } },
   })
   ```

6. Create `vitest.setup.ts`:
   ```ts
   import '@testing-library/jest-dom'
   ```

7. Add to `package.json` scripts:
   ```json
   "test": "vitest run",
   "test:watch": "vitest"
   ```

**Commit:** `chore: scaffold Next.js 15 + shadcn/ui + Supabase deps`

---

## Task T02: Design System — globals.css + tailwind.config

**Files:** `app/globals.css`, `tailwind.config.ts`

### Steps

1. Replace `app/globals.css` with:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     :root {
       --background: 0 0% 100%;
       --foreground: 0 0% 0%;
       --accent: 153 60% 53%;
       --radius: 0rem;
     }

     * {
       border-radius: 0 !important;
     }

     h1, h2, h3 {
       text-wrap: balance;
     }

     body {
       background-color: #ffffff;
       color: #000000;
     }
   }

   @keyframes scroll-x {
     from { transform: translateX(0); }
     to { transform: translateX(-50%); }
   }

   .ticker-track {
     display: flex;
     white-space: nowrap;
     animation: scroll-x 40s linear infinite;
   }

   .ticker-track:hover {
     animation-play-state: paused;
   }

   @media (prefers-reduced-motion: reduce) {
     .ticker-track {
       animation: none;
     }
   }
   ```

2. Update `tailwind.config.ts` to extend theme:
   ```ts
   import type { Config } from 'tailwindcss'

   const config: Config = {
     darkMode: ['class'],
     content: [
       './pages/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
       './app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {
         colors: {
           accent: '#3ecf8e',
           border: '#000000',
         },
         borderRadius: {
           DEFAULT: '0',
           none: '0',
           sm: '0',
           md: '0',
           lg: '0',
           xl: '0',
           full: '0',
         },
         fontFamily: {
           mono: ['var(--font-geist-mono)', 'monospace'],
         },
       },
     },
     plugins: [require('tailwindcss-animate')],
   }
   export default config
   ```

**Commit:** `style: design system — zero radius, accent #3ecf8e, ticker animation`

---

## Task T03: lib/types.ts + lib/constants.ts

**Files:** `lib/types.ts`, `lib/constants.ts`

### Steps

1. Write `lib/types.ts`:
   ```ts
   export type Category =
     | 'operations'
     | 'construction'
     | 'electrical_power'
     | 'cooling_mechanical'
     | 'networking'

   export type JobStatus = 'active' | 'closed' | 'draft'
   export type ProfileRole = 'seeker' | 'employer'
   export type ResourceType = 'cert' | 'school' | 'program'

   export interface Job {
     id: string
     title: string
     company: string
     location: string
     category: Category
     remote: boolean
     description: string
     salary_min: number | null
     salary_max: number | null
     apply_target: string
     posted_by: string | null
     created_at: string
     status: JobStatus
     paid_amount_cents: number
   }

   export interface Application {
     id: string
     job_id: string
     applicant_id: string
     created_at: string
   }

   export interface SavedJob {
     id: string
     job_id: string
     user_id: string
     created_at: string
   }

   export interface NewsItem {
     id: string
     headline: string
     source: string
     url: string
     excerpt: string | null
     published_at: string
   }

   export interface Resource {
     id: string
     name: string
     type: ResourceType
     provider: string
     url: string
     description: string | null
   }

   export interface Profile {
     id: string
     display_name: string | null
     role: ProfileRole
     created_at: string
   }

   export interface JobFilters {
     category?: Category
     location?: string
     remote?: boolean
     search?: string
   }

   export interface CreateJobPayload {
     title: string
     company: string
     location: string
     category: Category
     remote: boolean
     description: string
     salary_min: number | null
     salary_max: number | null
     apply_target: string
     paid_amount_cents: number
   }

   export type ApplicationWithJob = Application & { job: Job }
   export type SavedJobWithJob = SavedJob & { job: Job }
   ```

2. Write `lib/constants.ts`:
   ```ts
   import type { Category } from './types'

   export const CATEGORY_LABELS: Record<Category, string> = {
     operations: 'Operations',
     construction: 'Construction',
     electrical_power: 'Electrical / Power',
     cooling_mechanical: 'Cooling / Mechanical',
     networking: 'Networking',
   }

   export const CATEGORY_LIST: Category[] = [
     'operations',
     'construction',
     'electrical_power',
     'cooling_mechanical',
     'networking',
   ]

   export const PRICE_MIN = 5
   export const PRICE_MAX = 500
   export const PRICE_DEFAULT = 99
   ```

3. Write test `lib/__tests__/types.test.ts` — just verify constants are well-formed:
   ```ts
   import { describe, it, expect } from 'vitest'
   import { CATEGORY_LABELS, CATEGORY_LIST, PRICE_DEFAULT } from '../constants'

   describe('constants', () => {
     it('CATEGORY_LIST has 5 items', () => {
       expect(CATEGORY_LIST).toHaveLength(5)
     })
     it('every category has a label', () => {
       CATEGORY_LIST.forEach(c => expect(CATEGORY_LABELS[c]).toBeTruthy())
     })
     it('PRICE_DEFAULT is 99', () => {
       expect(PRICE_DEFAULT).toBe(99)
     })
   })
   ```

4. Run `npm test` — should pass.

**Commit:** `feat: domain types and category constants`

---

## Task T04: Supabase clients

**Files:** `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/middleware.ts`

### Steps

1. Create `lib/supabase/server.ts`:
   ```ts
   import { createServerClient } from '@supabase/ssr'
   import { cookies } from 'next/headers'

   export async function createClient() {
     const cookieStore = await cookies()
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           getAll() {
             return cookieStore.getAll()
           },
           setAll(cookiesToSet) {
             try {
               cookiesToSet.forEach(({ name, value, options }) =>
                 cookieStore.set(name, value, options)
               )
             } catch {
               // Ignore in RSC context
             }
           },
         },
       }
     )
   }
   ```

2. Create `lib/supabase/client.ts`:
   ```ts
   import { createBrowserClient } from '@supabase/ssr'

   export function createClient() {
     return createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
   }
   ```

3. Create `lib/supabase/middleware.ts`:
   ```ts
   import { createServerClient } from '@supabase/ssr'
   import { type NextRequest, NextResponse } from 'next/server'

   export async function updateSession(request: NextRequest) {
     let supabaseResponse = NextResponse.next({ request })

     const supabase = createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           getAll() {
             return request.cookies.getAll()
           },
           setAll(cookiesToSet) {
             cookiesToSet.forEach(({ name, value }) =>
               request.cookies.set(name, value)
             )
             supabaseResponse = NextResponse.next({ request })
             cookiesToSet.forEach(({ name, value, options }) =>
               supabaseResponse.cookies.set(name, value, options)
             )
           },
         },
       }
     )

     const { data: { user } } = await supabase.auth.getUser()
     return { response: supabaseResponse, user }
   }
   ```

**Commit:** `feat: Supabase server/client/middleware helpers`

---

## Task T05: Root middleware.ts

**File:** `middleware.ts`

### Steps

1. Write `middleware.ts`:
   ```ts
   import { type NextRequest, NextResponse } from 'next/server'
   import { updateSession } from '@/lib/supabase/middleware'

   export async function middleware(request: NextRequest) {
     const { response, user } = await updateSession(request)

     if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
       const url = request.nextUrl.clone()
       url.pathname = '/signin'
       url.searchParams.set('next', request.nextUrl.pathname)
       return NextResponse.redirect(url)
     }

     return response
   }

   export const config = {
     matcher: [
       '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
     ],
   }
   ```

**Commit:** `feat: middleware — dashboard guard + session refresh`

---

## Task T06: Database migration

**File:** `supabase/migrations/0001_init.sql`

### Steps

1. Create `supabase/migrations/0001_init.sql` with full schema, RLS policies, and trigger:

```sql
-- Enums
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
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

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
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Authenticated users can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = posted_by);
CREATE POLICY "Users can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = posted_by);

-- applications
CREATE TABLE applications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        uuid NOT NULL REFERENCES jobs ON DELETE CASCADE,
  applicant_id  uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, applicant_id)
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = applicant_id);

-- saved_jobs
CREATE TABLE saved_jobs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid NOT NULL REFERENCES jobs ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, user_id)
);
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved jobs" ON saved_jobs
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- news
CREATE TABLE news (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline      text NOT NULL,
  source        text NOT NULL,
  url           text NOT NULL,
  excerpt       text,
  published_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);

-- resources
CREATE TABLE resources (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  type         text NOT NULL CHECK (type IN ('cert', 'school', 'program')),
  provider     text NOT NULL,
  url          text NOT NULL,
  description  text
);
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (true);

-- Auto-create profile on sign-up
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

**Commit:** `feat: database migration — schema, RLS, trigger`

---

## Task T07: Seed data

**File:** `supabase/seed.sql`

Write a full seed script with:
- 30 jobs (6 per category): Operations, Construction, Electrical/Power, Cooling/Mechanical, Networking
- Companies: Equinix, CyrusOne, Iron Mountain, QTS, Flexential, AWS, Google, Meta, Microsoft, Oracle, Turner Construction, PCL Construction, Faith Technologies, Rosendin Electric, Zayo Group, Lumen Technologies, Vertiv, Schneider Electric, ABB, Black Box Corporation
- Locations: Ashburn VA, Dallas TX, Phoenix AZ, Atlanta GA, Columbus OH, Remote
- Salary ranges realistic per role type
- 12 news items with real data center industry content
- 9 resources including Meta's Data Center Technician Training Program

Note: seed inserts without a `posted_by` (NULL — seeded jobs have no owner). RLS allows SELECT on active jobs for anon.

**Commit:** `feat: seed data — 30 jobs, 12 news, 9 resources`

---

## Task T08: lib/api.ts

**File:** `lib/api.ts`

### Steps

All functions use the server Supabase client. Functions throw on error.

```ts
import { createClient } from '@/lib/supabase/server'
import type {
  Job, JobFilters, NewsItem, Resource,
  ApplicationWithJob, SavedJobWithJob
} from '@/lib/types'

export async function getJobs(filters?: JobFilters): Promise<Job[]> { ... }
export async function getJob(id: string): Promise<Job> { ... }
export async function getNews(): Promise<NewsItem[]> { ... }
export async function getResources(): Promise<Resource[]> { ... }
export async function getUserApplications(): Promise<ApplicationWithJob[]> { ... }
export async function getUserSavedJobs(): Promise<SavedJobWithJob[]> { ... }
export async function getPostedJobs(): Promise<Job[]> { ... }
```

For `getJobs`: apply filters — category, location (ilike), remote, search (ilike on title+company). Order by created_at desc.

For `getUserApplications`, `getUserSavedJobs`, `getPostedJobs`: get current user first, throw if not authenticated.

Write tests in `lib/__tests__/api.test.ts` mocking the Supabase client.

**Commit:** `feat: lib/api.ts — typed data access layer`

---

## Task T09: Server actions

**Files:** `app/actions/jobs.ts`, `app/actions/applications.ts`, `app/actions/saved.ts`

### Steps

All use `'use server'` directive. Use server Supabase client. Revalidate cache after writes.

**`app/actions/jobs.ts`:**
```ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Job, JobStatus, CreateJobPayload } from '@/lib/types'

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...payload, posted_by: user.id, status: 'active' })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/jobs')
  return data
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/jobs')
  revalidatePath('/dashboard')
}
```

**`app/actions/applications.ts`:**
```ts
'use server'
import { createClient } from '@/lib/supabase/server'

export async function applyToJob(jobId: string): Promise<{ apply_target: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get apply_target first
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('apply_target')
    .eq('id', jobId)
    .single()
  if (jobError) throw jobError

  // Record application (ignore duplicate)
  await supabase
    .from('applications')
    .upsert({ job_id: jobId, applicant_id: user.id }, { onConflict: 'job_id,applicant_id' })

  return { apply_target: job.apply_target }
}
```

**`app/actions/saved.ts`:**
```ts
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SavedJob } from '@/lib/types'

export async function saveJob(jobId: string): Promise<SavedJob> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('saved_jobs')
    .insert({ job_id: jobId, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/dashboard')
  return data
}

export async function unsaveJob(jobId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('job_id', jobId)
    .eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/dashboard')
}
```

**Commit:** `feat: server actions — jobs, applications, saved`

---

## Task T10: MosaicNav component

**Files:** `components/nav/MosaicNav.tsx`, `components/nav/SignOutTile.tsx`

### Design

Grid of square/rectangular tiles, zero gap, 1px black borders. Logo tile fixed top-left. Each tile is a `<Link>`. Hover: `bg-black text-white`. Active route: `bg-black text-white`. Sign-out tile: client component (needs `useRouter`).

Mobile: tiles collapse to a row that wraps, or show hamburger at < 768px. Keep functional.

### Tiles
- Logo: "CORESTACK" (fixed, no hover effect)
- Jobs (link to /jobs)
- Post a Job (link to /post, CTA style)
- News (link to /news)
- Resources (link to /resources)
- Dashboard (link to /dashboard, auth-only — conditionally shown)
- Sign In / Sign Out (toggle based on session)

### Steps

1. `MosaicNav.tsx` is a server component that reads the session:
   ```tsx
   import Link from 'next/link'
   import { createClient } from '@/lib/supabase/server'
   import SignOutTile from './SignOutTile'

   export default async function MosaicNav() {
     const supabase = await createClient()
     const { data: { user } } = await supabase.auth.getUser()
     // render tile grid
   }
   ```

2. `SignOutTile.tsx` is a client component:
   ```tsx
   'use client'
   import { useRouter } from 'next/navigation'
   import { createClient } from '@/lib/supabase/client'

   export default function SignOutTile() {
     const router = useRouter()
     async function signOut() {
       const supabase = createClient()
       await supabase.auth.signOut()
       router.push('/')
       router.refresh()
     }
     return (
       <button onClick={signOut} className="...">
         Sign Out
       </button>
     )
   }
   ```

3. Mosaic tile CSS:
   - Container: `grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] h-12 border-b border-black`
   - Each tile: `flex items-center justify-center px-4 border-r border-black text-sm font-medium transition-colors duration-150 hover:bg-black hover:text-white`
   - Logo tile: `px-5 font-bold tracking-widest text-xs bg-black text-white` (always inverted)
   - Post a Job tile: CTA — black bg white text by default, hover: accent green

**Commit:** `feat: MosaicNav + SignOutTile`

---

## Task T11: NewsTicker component

**File:** `components/nav/NewsTicker.tsx`

### Design

Full-width strip, `overflow: hidden`, `white-space: nowrap`. Inner list duplicated for seamless loop via CSS `scroll-x` keyframe. Pauses on hover. Reduced-motion fallback: static list.

### Steps

```tsx
'use client'
import type { NewsItem } from '@/lib/types'

interface Props { items: NewsItem[] }

export default function NewsTicker({ items }: Props) {
  const doubled = [...items, ...items]

  return (
    <div
      className="w-full overflow-hidden border-b border-black bg-white py-2 text-xs"
      aria-label="Industry news ticker"
    >
      {/* Reduced motion: static list */}
      <ul className="hidden motion-reduce:flex flex-wrap gap-4 px-4">
        {items.map(item => (
          <li key={item.id}>
            <a href={item.url} target="_blank" rel="noopener noreferrer"
               className="hover:text-[#3ecf8e] transition-colors duration-150">
              {item.headline}
            </a>
          </li>
        ))}
      </ul>

      {/* Scrolling ticker */}
      <div className="ticker-track motion-reduce:hidden">
        {doubled.map((item, i) => (
          <span key={`${item.id}-${i}`} className="px-6">
            <a href={item.url} target="_blank" rel="noopener noreferrer"
               className="hover:text-[#3ecf8e] transition-colors duration-150"
               tabIndex={i < items.length ? 0 : -1}>
              {item.headline}
            </a>
            <span className="mx-4 text-black/30" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
```

Write test: renders items, duplicate items have `tabIndex={-1}`.

**Commit:** `feat: NewsTicker — scrolling + reduced-motion fallback`

---

## Task T12: JobCard + JobGrid components

**Files:** `components/jobs/JobCard.tsx`, `components/jobs/JobGrid.tsx`

### JobCard design

Sharp border card. Shows: title (bold), company, location, category badge, remote badge, salary range (tabular-nums), days-ago posted. Link to `/jobs/[id]`. Hover: border shifts to accent.

```tsx
import Link from 'next/link'
import type { Job } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'
import { formatSalary, daysAgo } from '@/lib/utils'

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}
          className="block border border-black p-5 transition-colors duration-150 hover:border-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e]">
      <div className="flex items-start justify-between gap-2 min-w-0">
        <h3 className="font-semibold truncate min-w-0">{job.title}</h3>
        <span className="text-xs border border-black px-2 py-0.5 whitespace-nowrap flex-shrink-0">
          {CATEGORY_LABELS[job.category]}
        </span>
      </div>
      <p className="text-sm text-black/70 mt-1 truncate min-w-0">{job.company} · {job.location}</p>
      {(job.salary_min || job.salary_max) && (
        <p className="text-sm tabular-nums mt-2">{formatSalary(job.salary_min, job.salary_max)}</p>
      )}
      <div className="flex items-center gap-2 mt-3">
        {job.remote && (
          <span className="text-xs border border-black px-2 py-0.5">Remote</span>
        )}
        <span className="text-xs text-black/50 ml-auto">{daysAgo(job.created_at)}</span>
      </div>
    </Link>
  )
}
```

Add `lib/utils.ts` with `formatSalary(min, max)` and `daysAgo(dateStr)` helpers.

### JobGrid

Simple responsive grid wrapper:
```tsx
import JobCard from './JobCard'
import type { Job } from '@/lib/types'

export default function JobGrid({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return <p className="py-12 text-center text-sm text-black/50">No jobs found.</p>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-black">
      {jobs.map(job => (
        <div key={job.id} className="border-r border-b border-black">
          <JobCard job={job} />
        </div>
      ))}
    </div>
  )
}
```

Write tests: JobCard renders title, company, salary; JobGrid renders N cards and shows empty state.

**Commit:** `feat: JobCard + JobGrid components`

---

## Task T13: JobFilters component (client, URL-synced)

**File:** `components/jobs/JobFilters.tsx`

### Steps

Client component. Uses `useRouter` + `useSearchParams`. Dropdowns for category and location; remote toggle; search input. On change, calls `router.replace` with updated search params to keep URL in sync.

```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { CATEGORY_LABELS, CATEGORY_LIST } from '@/lib/constants'
import type { Category } from '@/lib/types'

export default function JobFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const update = useCallback((key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`/jobs?${next.toString()}`)
  }, [router, params])

  return (
    <div className="flex flex-wrap gap-0 border border-black" role="search" aria-label="Filter jobs">
      {/* Search input */}
      <input
        type="search"
        placeholder="Search jobs…"
        defaultValue={params.get('search') ?? ''}
        onChange={e => update('search', e.target.value || null)}
        className="border-r border-black px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none min-w-48"
        aria-label="Search jobs"
      />
      {/* Category select */}
      <select
        value={params.get('category') ?? ''}
        onChange={e => update('category', e.target.value || null)}
        className="border-r border-black px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none bg-white"
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {CATEGORY_LIST.map(c => (
          <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
        ))}
      </select>
      {/* Remote toggle */}
      <label className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={params.get('remote') === 'true'}
          onChange={e => update('remote', e.target.checked ? 'true' : null)}
          className="focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
        />
        Remote only
      </label>
    </div>
  )
}
```

Write test: updates URL when category changes.

**Commit:** `feat: JobFilters — URL-synced client filters`

---

## Task T14: AuthForm + AuthGate components

**Files:** `components/auth/AuthForm.tsx`, `components/auth/AuthGate.tsx`

### AuthForm

Client component. Props: `mode: 'signin' | 'signup'`. Uses Supabase browser client. Honors `?next=` param on redirect. Shows spinner while submitting. Inline error messages.

```tsx
'use client'
import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push(params.get('next') ?? '/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          ref={emailRef}
          id="email" name="email" type="email" autoComplete="email" required
          placeholder="you@example.com…"
          className="border border-black px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input
          id="password" name="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required
          placeholder="Password…"
          className="border border-black px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
      >
        {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  )
}
```

### AuthGate

Client component wrapping the Apply button. Checks session on mount. Signed out → shadcn `<Dialog>` with `AuthForm`. Signed in → calls `applyToJob` server action → `window.open(apply_target)` + shows success message.

**Commit:** `feat: AuthForm + AuthGate components`

---

## Task T15: PayWhatYouWishField + PostJobForm

**Files:** `components/post/PayWhatYouWishField.tsx`, `components/post/PostJobForm.tsx`

### PayWhatYouWishField

Slider + numeric input synced. Min $5, Max $500, Default $99.

```tsx
'use client'
import { useState } from 'react'
import { PRICE_MIN, PRICE_MAX, PRICE_DEFAULT } from '@/lib/constants'

export default function PayWhatYouWishField({ onChange }: { onChange?: (v: number) => void }) {
  const [value, setValue] = useState(PRICE_DEFAULT)

  function handleChange(v: number) {
    const clamped = Math.max(PRICE_MIN, Math.min(PRICE_MAX, v))
    setValue(clamped)
    onChange?.(clamped)
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium" htmlFor="price-input">
        Listing price — ${value}
      </label>
      <input
        type="range"
        min={PRICE_MIN} max={PRICE_MAX}
        value={value}
        onChange={e => handleChange(Number(e.target.value))}
        className="w-full accent-[#3ecf8e]"
        aria-label="Listing price slider"
      />
      <input
        id="price-input"
        type="number"
        inputMode="numeric"
        min={PRICE_MIN} max={PRICE_MAX}
        value={value}
        onChange={e => handleChange(Number(e.target.value))}
        className="w-24 border border-black px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none tabular-nums"
        aria-label="Listing price"
      />
    </div>
  )
}
```

### PostJobForm

Client form. Fields: title, company, location, category (select), remote (checkbox), description (textarea — markdown accepted), salary_min, salary_max, apply_target (URL or email), PayWhatYouWishField. Inline validation. On submit: saves draft to `sessionStorage` → `router.push('/post/confirm')`.

Write tests: PayWhatYouWishField slider syncs numeric input; clamps to min/max.

**Commit:** `feat: PayWhatYouWishField + PostJobForm`

---

## Task T16: DashboardTabs component

**File:** `components/dashboard/DashboardTabs.tsx`

Client component with three tabs: Applications, Saved, My Listings. Uses shadcn Tabs. Each tab content is passed as a prop (server-rendered). Tab state synced to URL `?tab=` param.

```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  applications: React.ReactNode
  saved: React.ReactNode
  listings: React.ReactNode
}

export default function DashboardTabs({ applications, saved, listings }: Props) {
  const params = useSearchParams()
  const router = useRouter()
  const tab = params.get('tab') ?? 'applications'

  return (
    <Tabs value={tab} onValueChange={t => router.replace(`/dashboard?tab=${t}`)}>
      <TabsList className="border-b border-black w-full justify-start rounded-none bg-transparent gap-0 p-0">
        <TabsTrigger value="applications" className="...">Applications</TabsTrigger>
        <TabsTrigger value="saved" className="...">Saved</TabsTrigger>
        <TabsTrigger value="listings" className="...">My Listings</TabsTrigger>
      </TabsList>
      <TabsContent value="applications">{applications}</TabsContent>
      <TabsContent value="saved">{saved}</TabsContent>
      <TabsContent value="listings">{listings}</TabsContent>
    </Tabs>
  )
}
```

**Commit:** `feat: DashboardTabs — URL-synced client tabs`

---

## Task T17: Root layout

**File:** `app/layout.tsx`

RSC. Imports MosaicNav (server component) and NewsTicker (client component). Fetches news for ticker. Footer.

```tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import MosaicNav from '@/components/nav/MosaicNav'
import NewsTicker from '@/components/nav/NewsTicker'
import { getNews } from '@/lib/api'
import './globals.css'

export const metadata: Metadata = {
  title: 'Corestack — Data Center Jobs',
  description: 'The job board for the people building the cloud.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const news = await getNews()
  return (
    <html lang="en">
      <body>
        <header>
          <MosaicNav />
          <NewsTicker items={news} />
        </header>
        <main>{children}</main>
        <footer className="border-t border-black mt-16 py-8 px-6 text-sm text-black/50">
          <p>© {new Date().getFullYear()} Corestack. Built for the data center industry.</p>
        </footer>
      </body>
    </html>
  )
}
```

**Commit:** `feat: root layout — MosaicNav + NewsTicker + footer`

---

## Task T18: Homepage

**File:** `app/page.tsx`

RSC. Fetches recent 12 jobs. Sections: hero, stats strip, JobGrid, second CTA.

Hero: bold headline "The job board for the people building the cloud." + "Post a Job" CTA button (black bg, white text, hover accent).

Stats strip: total active jobs, number of companies, number of categories. Tabular-nums. Sharp borders.

Second CTA: "Building a team?" block with Post a Job button.

```tsx
import Link from 'next/link'
import { getJobs } from '@/lib/api'
import JobGrid from '@/components/jobs/JobGrid'

export default async function HomePage() {
  const jobs = await getJobs()
  const recent = jobs.slice(0, 12)
  const companies = new Set(jobs.map(j => j.company)).size

  return (
    <div>
      {/* Hero */}
      <section className="px-6 py-20 border-b border-black">
        <h1 className="text-5xl font-bold tracking-tight max-w-2xl">
          The job board for the people building the cloud.
        </h1>
        <p className="mt-4 text-lg text-black/70 max-w-xl">
          Operations, construction, power, cooling, and networking roles across the data center industry.
        </p>
        <div className="mt-8 flex gap-0">
          <Link href="/post"
                className="bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e]">
            Post a Job
          </Link>
          <Link href="/jobs"
                className="border border-black px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e]">
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="flex border-b border-black" aria-label="Site statistics">
        <div className="flex-1 border-r border-black px-8 py-6">
          <p className="text-3xl font-bold tabular-nums">{jobs.length}</p>
          <p className="text-sm text-black/60 mt-1">Open roles</p>
        </div>
        <div className="flex-1 border-r border-black px-8 py-6">
          <p className="text-3xl font-bold tabular-nums">{companies}</p>
          <p className="text-sm text-black/60 mt-1">Companies hiring</p>
        </div>
        <div className="flex-1 px-8 py-6">
          <p className="text-3xl font-bold tabular-nums">5</p>
          <p className="text-sm text-black/60 mt-1">Job categories</p>
        </div>
      </section>

      {/* Recent listings */}
      <section className="px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Recent Openings</h2>
        <JobGrid jobs={recent} />
        <div className="mt-8">
          <Link href="/jobs"
                className="border border-black px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e]">
            View All Jobs →
          </Link>
        </div>
      </section>

      {/* Second CTA */}
      <section className="border-t border-black px-6 py-16 bg-black text-white">
        <h2 className="text-3xl font-bold">Building a team?</h2>
        <p className="mt-3 text-white/70">Post your opening to reach data center professionals across the industry.</p>
        <Link href="/post"
              className="mt-6 inline-block bg-white text-black px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e]">
          Post a Job
        </Link>
      </section>
    </div>
  )
}
```

**Commit:** `feat: homepage — hero, stats, recent listings, CTA`

---

## Task T19: Jobs browse page

**File:** `app/jobs/page.tsx`

RSC. Reads `searchParams` → calls `getJobs(filters)`. Renders `JobFilters` + `JobGrid`. Wraps `JobFilters` in `<Suspense>` (needs useSearchParams).

```tsx
import { Suspense } from 'react'
import { getJobs } from '@/lib/api'
import JobGrid from '@/components/jobs/JobGrid'
import JobFilters from '@/components/jobs/JobFilters'
import type { JobFilters as Filters, Category } from '@/lib/types'

interface Props {
  searchParams: Promise<{ category?: string; location?: string; remote?: string; search?: string }>
}

export default async function JobsPage({ searchParams }: Props) {
  const sp = await searchParams
  const filters: Filters = {
    ...(sp.category ? { category: sp.category as Category } : {}),
    ...(sp.location ? { location: sp.location } : {}),
    ...(sp.remote === 'true' ? { remote: true } : {}),
    ...(sp.search ? { search: sp.search } : {}),
  }
  const jobs = await getJobs(filters)

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>
      <Suspense fallback={null}>
        <JobFilters />
      </Suspense>
      <div className="mt-8">
        <JobGrid jobs={jobs} />
      </div>
    </div>
  )
}
```

**Commit:** `feat: jobs browse page with URL-synced filters`

---

## Task T20: Job detail page

**File:** `app/jobs/[id]/page.tsx`

RSC. Calls `getJob(id)`. Renders markdown description via `react-markdown`. Shows AuthGate for Apply. Salary with tabular-nums. Category badge. Remote badge. Posted date.

```tsx
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { getJob } from '@/lib/api'
import { CATEGORY_LABELS } from '@/lib/constants'
import AuthGate from '@/components/auth/AuthGate'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let job
  try { job = await getJob(id) } catch { notFound() }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="border border-black p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-black/70 mt-1">{job.company} · {job.location}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <span className="border border-black px-3 py-1 text-xs">{CATEGORY_LABELS[job.category]}</span>
            {job.remote && <span className="border border-black px-3 py-1 text-xs">Remote</span>}
          </div>
        </div>

        {(job.salary_min || job.salary_max) && (
          <p className="mt-4 tabular-nums font-medium">
            {formatSalary(job.salary_min, job.salary_max)}
          </p>
        )}

        <div className="mt-8 prose prose-sm max-w-none prose-headings:font-bold prose-a:text-[#3ecf8e]">
          <ReactMarkdown>{job.description}</ReactMarkdown>
        </div>

        <div className="mt-8 pt-8 border-t border-black">
          <AuthGate jobId={job.id} />
        </div>
      </div>
    </div>
  )
}
```

Install `@tailwindcss/typography` and add to tailwind plugins.

**Commit:** `feat: job detail page — markdown description + AuthGate`

---

## Task T21: Post job + confirm pages

**Files:** `app/post/page.tsx`, `app/post/confirm/page.tsx`

### Post page

Thin wrapper rendering `PostJobForm`.

### Confirm page

Client component. Reads draft from `sessionStorage`. Shows job summary. "Complete Post — $X" button calls `createJob` server action → `router.push('/jobs/[id]')`. Spinner during submission.

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJob } from '@/app/actions/jobs'
import type { CreateJobPayload } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/constants'

export default function ConfirmPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<CreateJobPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('corestack_draft')
    if (raw) setDraft(JSON.parse(raw))
    else router.replace('/post')
  }, [router])

  if (!draft) return null

  async function handlePost() {
    if (!draft) return
    setLoading(true)
    setError(null)
    try {
      const job = await createJob(draft)
      sessionStorage.removeItem('corestack_draft')
      router.push(`/jobs/${job.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const dollars = (draft.paid_amount_cents / 100).toFixed(0)

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Review Your Listing</h1>
      <div className="border border-black p-6 flex flex-col gap-3">
        <p className="font-semibold text-lg">{draft.title}</p>
        <p className="text-black/70">{draft.company} · {draft.location}</p>
        <p className="text-sm">{CATEGORY_LABELS[draft.category]}{draft.remote ? ' · Remote' : ''}</p>
        <p className="text-sm font-medium tabular-nums mt-2">Listing fee: ${dollars}</p>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        onClick={handlePost}
        disabled={loading}
        className="mt-6 w-full bg-black text-white px-6 py-3 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#3ecf8e]"
      >
        {loading ? 'Posting…' : `Complete Post — $${dollars}`}
      </button>
    </div>
  )
}
```

**Commit:** `feat: post job flow — form + mock checkout confirm`

---

## Task T22: Auth pages

**Files:** `app/signin/page.tsx`, `app/signup/page.tsx`

Simple RSC shells rendering AuthForm with the appropriate mode. Link between the two pages.

**Commit:** `feat: sign in + sign up pages`

---

## Task T23: Dashboard page

**File:** `app/dashboard/page.tsx`

RSC. Fetches all three data sets in parallel. Passes server-rendered content to `DashboardTabs`. Middleware already handles the auth redirect.

```tsx
import { getUserApplications, getUserSavedJobs, getPostedJobs } from '@/lib/api'
import DashboardTabs from '@/components/dashboard/DashboardTabs'
import { unsaveJob, updateJobStatus } from '@/app/actions/...'

export default async function DashboardPage() {
  const [applications, saved, listings] = await Promise.all([
    getUserApplications(),
    getUserSavedJobs(),
    getPostedJobs(),
  ])

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <DashboardTabs
        applications={<ApplicationsList items={applications} />}
        saved={<SavedList items={saved} />}
        listings={<ListingsList items={listings} />}
      />
    </div>
  )
}
```

Each sub-list includes an empty state with a CTA. Saved items have an unsave button (server action form). Listings have close/reopen toggle (server action form).

**Commit:** `feat: dashboard page — applications, saved, listings tabs`

---

## Task T24: News + Resources pages

**Files:** `app/news/page.tsx`, `app/resources/page.tsx`

### News page

RSC. `getNews()`. Card grid: headline, source, date, excerpt, external link.

### Resources page

RSC. `getResources()`. Cards grouped by type. Types: Programs, Certifications, Schools. Each card: name, provider, description, link.

**Commit:** `feat: news + resources pages`

---

## Task T25: Vitest tests

**Files:** `lib/__tests__/api.test.ts`, `components/__tests__/JobCard.test.tsx`, `components/__tests__/PayWhatYouWishField.test.tsx`, `components/__tests__/NewsTicker.test.tsx`

Mock Supabase client in tests. Test:
- `getJobs` applies filters correctly
- `getJob` throws on not found
- JobCard renders all fields
- JobCard truncates long titles
- PayWhatYouWishField clamps slider to min/max, syncs inputs
- NewsTicker duplicates items, second set has tabIndex={-1}

Run `npm test` — all passing.

**Commit:** `test: Vitest test suite for api, JobCard, PayWhatYouWishField, NewsTicker`

---

## Task T26: README.md

**File:** `README.md`

Write a concise README covering:
1. What Corestack is
2. Prerequisites (Node 18+, npm, Supabase project)
3. Setup: clone → install → env vars → run dev
4. Supabase setup: create project, paste URL+key into `.env.local`, run migration, run seed
5. Architecture note: `lib/api.ts` data boundary
6. Available routes

**Commit:** `docs: README — setup, Supabase, architecture`
