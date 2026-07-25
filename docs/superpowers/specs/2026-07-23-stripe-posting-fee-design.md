# Stripe Posting Fee Checkout

Date: 2026-07-23

## Problem

`/post/confirm` collects a "pay what you wish" price but never charges it —
the page says outright "This is a mock checkout — no payment will be
charged," and clicking "Complete Post" calls `createJob` directly with no
payment gate at all.

## Approach

Stripe Checkout (hosted redirect), not embedded Payment Element — least
code, PCI scope stays with Stripe, matches the existing single-button
confirm flow.

The job is created immediately (`status: 'pending'`, new `paid_at: null`
column) when checkout starts, not deferred until payment succeeds. Stripe
Checkout Session metadata is capped at 500 characters per value, nowhere
near enough for a job description, so there's no way to carry the full
draft through the redirect without persisting it server-side first — and
reusing the `jobs` table for that (rather than a separate staging table)
means the existing admin/employer pages need only a `paid_at` filter, not
a duplicate data model. The webhook is the source of truth for payment:
it's what actually sets `paid_at`, not the redirect back to the site.

## New secrets (never `NEXT_PUBLIC_`)

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY` — full RLS bypass; only ever used server-side
  in the webhook, which has no user session to scope a normal client to.

## Schema

```sql
ALTER TABLE jobs ADD COLUMN paid_at timestamptz;
```

Nullable, no default. `createJob` already omits `paid_at` on insert, so it
lands `NULL` with no code change there.

## Flow

1. `/post/confirm` → "Complete Post" calls a new `startJobCheckout(payload)`
   server action: inserts the job via the existing `createJob` action
   (`status: 'pending'`, `paid_at` stays null), creates a Stripe Checkout
   Session for `paid_amount_cents` with `metadata: { job_id }`, redirects
   to Stripe.
2. **Pay** → Stripe redirects to a new static `/post/success` page.
   Independently, Stripe fires `checkout.session.completed` at
   `app/api/webhooks/stripe/route.ts`, which verifies the signature and
   sets `paid_at = now()` on that job via the service-role client. This
   webhook call is the actual fulfillment step, not the redirect.
3. **Cancel** → Stripe redirects to `/dashboard/employer?checkout=canceled`.
   The job row already exists (unpaid), so there's no duplicate-draft risk
   on retry — the employer dashboard is the one retry path via "Resume
   checkout" (new `resumeJobCheckout(jobId)` action: same session-creation
   logic, pointed at the existing row instead of inserting a new one).

## Gating unpaid jobs out of view

- `/admin`'s query gets `AND paid_at IS NOT NULL` — an unpaid job can never
  enter the approval queue.
- Public `/jobs` needs no change: it already requires `status = 'active'`,
  and a job can't reach `active` without first passing admin approval,
  which now transitively requires payment. No job can be admin-approved
  while `paid_at` is null, because it's invisible to the admin query.

## Employer dashboard

- New "Awaiting Payment" badge (muted, distinct from "Pending" — "Pending"
  now specifically means paid and awaiting admin review) when
  `paid_at === null`.
- "Resume checkout" button shown alongside Edit/Close when unpaid.

## Out of scope

- Embedded Payment Element / any non-redirect checkout UI.
- A way to discard/delete an abandoned unpaid draft (it just sits there,
  harmless, until resumed or closed).
- Refunds, partial payments, or any post-payment money-movement flow.
- Any change to the public `/jobs` listing query.
