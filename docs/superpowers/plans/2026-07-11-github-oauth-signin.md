# GitHub OAuth Sign-In Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a working "Continue with GitHub" option to sign-in and sign-up, without duplicating the existing auth form logic a third time.

**Architecture:** Consolidate all sign-in/sign-up UI onto the existing (but currently orphaned) `components/auth/AuthForm.tsx`. Add GitHub OAuth there, then rewire `app/signin/page.tsx` and `app/signup/page.tsx` to render it instead of their own hand-rolled duplicate `<form>`s. `AuthForm` is already used by `components/auth/AuthGate.tsx` (the "sign in to apply" modal), so that surface gets GitHub sign-in for free. `app/auth/callback/route.ts` already exchanges an OAuth code for a session and redirects to a `next` param — it needs no changes.

**Tech Stack:** Next.js 16 App Router, React 19, `@supabase/ssr` (`supabase.auth.signInWithOAuth`), Tailwind v4 utility classes, Vitest + Testing Library.

## Global Constraints

- Supabase OAuth provider id is exactly `'github'` (must match the provider Supabase project settings, already configured by the user).
- Use `window.location.origin` for the OAuth `redirectTo` base, not `NEXT_PUBLIC_SITE_URL` — that env var is unreliable (see `app/signup/page.tsx`'s existing `emailRedirectTo` usage) and this app already had one outage from an unguarded env var in auth-adjacent code.
- Leave the existing disabled "Continue with Google (coming soon)" button untouched — it stays disabled, GitHub is added alongside it, above it.
- Leave `app/auth/callback/route.ts` untouched — it is already provider-agnostic.
- No new npm dependencies. This lucide-react version has no GitHub brand icon, so use an inline SVG.
- New test files follow the existing `__tests__` subdirectory convention (see `components/__tests__/JobCard.test.tsx`).
- Do not change the behavior of the still-unused disabled Google button, or add Google OAuth.

---

### Task 1: Add GitHub OAuth to `AuthForm`

**Files:**
- Modify: `components/auth/AuthForm.tsx` (currently 165 lines, full contents below)
- Test: `components/auth/__tests__/AuthForm.test.tsx` (new)

**Interfaces:**
- Consumes: `createClient` from `@/lib/supabase/client` (existing, unchanged — returns an object with `.auth.signInWithOAuth`, `.auth.signInWithPassword`, `.auth.signUp`); `useRouter`, `useSearchParams`, `usePathname` from `next/navigation`.
- Produces: `AuthForm` default export, unchanged signature `({ mode: 'signin' | 'signup' }) => JSX.Element`. Internally: a button with accessible name "Continue with GitHub" that calls `supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } })` where `redirectTo` is `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`, and `next` is `params.get('next') ?? (pathname is /signin or /signup ? '/dashboard' : pathname)`. Later tasks (2, 3) rely on this default export and its `mode` prop only — no other exports change.

- [ ] **Step 1: Write the failing tests**

Create `components/auth/__tests__/AuthForm.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '../AuthForm'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  signInWithOAuth: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  pathname: '/signin',
  searchParams: new URLSearchParams(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
  useSearchParams: () => mocks.searchParams,
  usePathname: () => mocks.pathname,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mocks.signInWithOAuth,
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
    },
  }),
}))

describe('AuthForm', () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.refresh.mockReset()
    mocks.signInWithOAuth.mockReset().mockResolvedValue({ error: null })
    mocks.signInWithPassword.mockReset().mockResolvedValue({ error: null })
    mocks.signUp.mockReset().mockResolvedValue({ error: null })
    mocks.pathname = '/signin'
    mocks.searchParams = new URLSearchParams()
  })

  it('renders an enabled Continue with GitHub button', () => {
    render(<AuthForm mode="signin" />)
    expect(
      screen.getByRole('button', { name: /continue with github/i })
    ).toBeEnabled()
  })

  it('still renders the disabled Google placeholder', () => {
    render(<AuthForm mode="signin" />)
    expect(screen.getByRole('button', { name: /google/i })).toBeDisabled()
  })

  it('calls signInWithOAuth with the github provider on click', async () => {
    render(<AuthForm mode="signin" />)
    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))

    await waitFor(() => expect(mocks.signInWithOAuth).toHaveBeenCalledTimes(1))
    const call = mocks.signInWithOAuth.mock.calls[0][0]
    expect(call.provider).toBe('github')
    expect(call.options.redirectTo).toContain('/auth/callback?next=%2Fdashboard')
  })

  it('includes an explicit next param in the GitHub redirect when present', async () => {
    mocks.searchParams = new URLSearchParams('next=/jobs/abc123')
    render(<AuthForm mode="signin" />)
    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))

    await waitFor(() => expect(mocks.signInWithOAuth).toHaveBeenCalledTimes(1))
    const call = mocks.signInWithOAuth.mock.calls[0][0]
    expect(call.options.redirectTo).toContain(
      `/auth/callback?next=${encodeURIComponent('/jobs/abc123')}`
    )
  })

  it('uses the current path as the GitHub redirect target when embedded outside signin/signup', async () => {
    mocks.pathname = '/jobs/abc123'
    render(<AuthForm mode="signin" />)
    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))

    await waitFor(() => expect(mocks.signInWithOAuth).toHaveBeenCalledTimes(1))
    const call = mocks.signInWithOAuth.mock.calls[0][0]
    expect(call.options.redirectTo).toContain(
      `/auth/callback?next=${encodeURIComponent('/jobs/abc123')}`
    )
  })

  it('shows an error message when signInWithOAuth fails', async () => {
    mocks.signInWithOAuth.mockResolvedValue({
      error: { message: 'OAuth provider not enabled' },
    })
    render(<AuthForm mode="signin" />)
    fireEvent.click(screen.getByRole('button', { name: /continue with github/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'OAuth provider not enabled'
    )
  })

  it('still redirects to /dashboard after password sign-in with no next param', async () => {
    render(<AuthForm mode="signin" />)
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/dashboard'))
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run components/auth/__tests__/AuthForm.test.tsx`
Expected: FAIL — no element found with accessible name matching `/continue with github/i` (the button doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Replace the full contents of `components/auth/AuthForm.tsx` with:

```tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const errorRef = useRef<HTMLParagraphElement>(null)

  const next =
    params.get('next') ??
    (pathname === '/signin' || pathname === '/signup' ? '/dashboard' : pathname)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (mode === 'signup') {
      const confirm = formData.get('confirmPassword') as string
      if (password !== confirm) {
        setError('Passwords do not match.')
        setLoading(false)
        setTimeout(() => errorRef.current?.focus(), 0)
        return
      }
    }

    const supabase = createClient()
    const { error: authError } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      setTimeout(() => errorRef.current?.focus(), 0)
      return
    }

    if (mode === 'signup') {
      setSuccess(true)
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  async function handleGithubSignIn() {
    setError(null)
    setGithubLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (authError) {
      setError(authError.message)
      setGithubLoading(false)
      setTimeout(() => errorRef.current?.focus(), 0)
    }
  }

  if (success) {
    return (
      <div className="border border-black px-5 py-6 bg-[#3ecf8e]/10">
        <p className="text-sm font-medium">Check your email to confirm your account</p>
        <p className="text-xs text-black/50 mt-1">
          We sent a confirmation link to your inbox. Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-sm"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com…"
          className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="auth-password"
          name="password"
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          required
          placeholder="Password…"
          minLength={6}
          className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        />
      </div>

      {mode === 'signup' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-confirm-password" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="auth-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Confirm password…"
            minLength={6}
            className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          />
        </div>
      )}

      {error && (
        <p
          ref={errorRef}
          role="alert"
          aria-live="polite"
          tabIndex={-1}
          className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2 outline-none"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || githubLoading}
        className="bg-black text-white px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
      >
        {loading
          ? 'Please wait…'
          : mode === 'signin'
          ? 'Sign In'
          : 'Create Account'}
      </button>

      <div className="border-t border-black pt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={loading || githubLoading}
          className="w-full border border-black px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-150 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.004.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.014 2.896-.014 3.29 0 .319.192.694.801.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12Z" />
          </svg>
          {githubLoading ? 'Redirecting…' : 'Continue with GitHub'}
        </button>

        <button
          type="button"
          disabled
          className="w-full border border-black px-4 py-2.5 text-sm font-medium opacity-40 cursor-not-allowed"
          aria-label="Continue with Google (coming soon)"
        >
          Continue with Google
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/auth/__tests__/AuthForm.test.tsx`
Expected: PASS — all 7 tests green.

- [ ] **Step 5: Commit**

```bash
git add components/auth/AuthForm.tsx components/auth/__tests__/AuthForm.test.tsx
git commit -m "Add GitHub OAuth sign-in to AuthForm"
```

---

### Task 2: Wire `/signin` to `AuthForm`

**Files:**
- Modify: `app/signin/page.tsx` (currently 107 lines, full contents below)

**Interfaces:**
- Consumes: `AuthForm` default export from `@/components/auth/AuthForm` (from Task 1), prop `mode="signin"`.
- Produces: `SignInPage` default export — now a server component (no `'use client'`), same route `/signin`, same visible heading/copy/cross-link.

- [ ] **Step 1: Replace the page contents**

Replace the full contents of `app/signin/page.tsx` with:

```tsx
import { Suspense } from 'react'
import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export default function SignInPage() {
  return (
    <div className="px-6 py-16">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <p className="text-sm text-black/50 mb-8">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-black underline hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Create one
          </Link>
        </p>
        <Suspense fallback={null}>
          <AuthForm mode="signin" />
        </Suspense>
      </div>
    </div>
  )
}
```

This removes the page's own `useState`/`useRouter`/`createClient` usage and inline `<form>` — that logic now lives in `AuthForm`. `Suspense` is required because `AuthForm` calls `useSearchParams()`, which forces client-side rendering for its subtree; without a boundary, Next.js fails the build with "useSearchParams() should be wrapped in a suspense boundary".

- [ ] **Step 2: Build to verify no Suspense/CSR-bailout error**

Run: `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=test npx next build`
Expected: build succeeds, no "should be wrapped in a suspense boundary" message, `/signin` appears in the route list.

- [ ] **Step 3: Commit**

```bash
git add app/signin/page.tsx
git commit -m "Use shared AuthForm on the signin page"
```

---

### Task 3: Wire `/signup` to `AuthForm`

**Files:**
- Modify: `app/signup/page.tsx` (currently 148 lines, full contents below)

**Interfaces:**
- Consumes: `AuthForm` default export from `@/components/auth/AuthForm` (from Task 1), prop `mode="signup"`.
- Produces: `SignUpPage` default export — now a server component, same route `/signup`, same visible heading/copy/cross-link. The post-signup "check your email" confirmation view is now owned by `AuthForm`'s internal `success` state (already implemented in Task 1) instead of a duplicate local branch.

- [ ] **Step 1: Replace the page contents**

Replace the full contents of `app/signup/page.tsx` with:

```tsx
import { Suspense } from 'react'
import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export default function SignUpPage() {
  return (
    <div className="px-6 py-16">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-sm text-black/50 mb-8">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="text-black underline hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Sign in
          </Link>
        </p>
        <Suspense fallback={null}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build to verify no Suspense/CSR-bailout error**

Run: `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=test npx next build`
Expected: build succeeds, `/signup` appears in the route list.

- [ ] **Step 3: Commit**

```bash
git add app/signup/page.tsx
git commit -m "Use shared AuthForm on the signup page"
```

---

### Task 4: Full verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: confidence the feature works end-to-end — no new interfaces for later tasks (this is the last task).

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass, including the 7 new `AuthForm` tests and every pre-existing test (`JobCard`, `JobGrid`, `PayWhatYouWishField`).

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors. If ESLint flags unused imports in `app/signin/page.tsx` or `app/signup/page.tsx`, they were missed in Task 2/3 — remove them.

- [ ] **Step 3: Full production build**

Run: `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=test npx next build`
Expected: succeeds, `/signin` and `/signup` both listed in the route output, no Suspense warnings.

- [ ] **Step 4: Manual smoke test**

Run:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=test npx next start -p 3411 &
sleep 2
curl -s http://localhost:3411/signin | grep -o 'Continue with GitHub'
curl -s http://localhost:3411/signup | grep -o 'Continue with GitHub'
kill %1
```
Expected: both `curl` calls print `Continue with GitHub` (confirms the button renders server-side in the initial HTML for both pages).

- [ ] **Step 5: Note remaining manual check for the user**

The real GitHub OAuth handshake can't be exercised in this environment (it needs the actual Supabase project's GitHub client id/secret and a real browser redirect). Tell the user to click "Continue with GitHub" on the deployed `/signin` page once this ships, and confirm it lands them on `/dashboard` after authorizing.

- [ ] **Step 6: Push**

```bash
git push origin main
```

(Only after confirming with the user, per standard practice for pushing to shared branches.)
