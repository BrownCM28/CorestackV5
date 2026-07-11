# GitHub OAuth Sign-In

Date: 2026-07-11

## Problem

GitHub is enabled as an auth provider in Supabase, but there is no way to
sign in with it anywhere in the app. `/signin` and `/signup` only offer
email/password, plus a permanently disabled "Continue with Google (coming
soon)" placeholder.

## Current state

- `app/signin/page.tsx` and `app/signup/page.tsx` each hand-roll their own
  `<form>` with duplicated email/password logic, error handling, and a
  disabled Google button.
- `components/auth/AuthForm.tsx` is a separate, more complete implementation
  of the same email/password form (`mode="signin" | "signup"`, `next`-param
  redirect handling, disabled Google button) — but it is *not* used by
  either page. Its only consumer today is `components/auth/AuthGate.tsx`,
  a modal shown when a guest tries to apply to a job.
- `app/auth/callback/route.ts` already exchanges an OAuth `code` for a
  session and redirects to a `next` query param (defaulting to `/`). It is
  provider-agnostic and requires no changes.

## Approach

Consolidate on `AuthForm.tsx` as the single implementation of sign-in/up,
used by both standalone pages and the existing modal. This avoids adding a
third duplicate copy of the auth form and gives GitHub sign-in to the job
application modal for free.

### `components/auth/AuthForm.tsx`

- Add `usePathname()` alongside the existing `useSearchParams()`.
- Compute a shared redirect target:
  ```ts
  const next =
    params.get('next') ??
    (pathname === '/signin' || pathname === '/signup' ? '/dashboard' : pathname)
  ```
  Used by both the password-flow redirect (replacing today's hardcoded
  `/dashboard`) and the new GitHub OAuth `redirectTo`, so "return to where
  you started" works consistently, including from the job-application
  modal.
- Add a `githubLoading` state, independent from the existing `loading`
  (password submit) state. Both the password submit button and the GitHub
  button are disabled while either is in flight.
- Add `handleGithubSignIn()`:
  ```ts
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
    }
  }
  ```
  On success the browser navigates away to GitHub, so no further state
  change is needed.
- Replace the disabled-Google-only block with: an enabled "Continue with
  GitHub" button (inline SVG mark — this lucide-react version ships no
  brand icons) above the existing disabled "Continue with Google (coming
  soon)" button, which is left untouched.
- Errors from `signInWithOAuth` surface through the existing `error`
  `role="alert"` region, same as password-auth errors.

### `app/signin/page.tsx` / `app/signup/page.tsx`

Keep the page chrome (heading, cross-link between signin/signup, layout),
delete the inline `<form>` (and, for signup, the local `success` branch —
`AuthForm` already owns that), and render `<AuthForm mode="signin" />` /
`<AuthForm mode="signup" />` instead.

## Data flow

1. User clicks "Continue with GitHub" on `/signin`, `/signup`, or inside
   the `AuthGate` modal on a job page.
2. `AuthForm` calls `supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } })`;
   browser redirects to GitHub's consent screen.
3. GitHub redirects back to Supabase, which redirects to
   `${origin}/auth/callback?code=...&next=...`.
4. The existing callback route exchanges the code for a session (unchanged)
   and redirects to `next`.

## Error handling

- `signInWithOAuth` errors (e.g. provider misconfigured) surface via the
  existing `error` alert region.
- Callback code-exchange failures already redirect to
  `/signin?error=auth_callback_failed` (pre-existing behavior, unchanged).
  Surfacing that query param as a visible message is a pre-existing gap,
  out of scope here.

## Testing

- New `components/auth/__tests__/AuthForm.test.tsx` (matching the existing
  `__tests__` convention): GitHub button renders and is enabled; clicking
  it calls `signInWithOAuth` with the correct `provider` and `redirectTo`;
  a `signInWithOAuth` error surfaces in the alert region.
- Manual verification: run the dev server and confirm both `/signin` and
  `/signup` render correctly with the new button, and that the
  job-application modal (`AuthGate`) still works.

## Out of scope

- Enabling the Google option.
- Fixing the pre-existing gap where `error=auth_callback_failed` isn't
  shown as a visible message on `/signin`.
- Making every existing redirect-to-`/signin` call site (middleware,
  `NavAuth`, `SaveJobButton`, protected dashboard pages) pass a `next`
  param. Today none of them do, so "return to where you started" only
  takes effect when `AuthForm` is rendered on a page other than
  `/signin`/`/signup` itself (e.g. the `AuthGate` modal) or when a caller
  explicitly links to `/signin?next=...`.
