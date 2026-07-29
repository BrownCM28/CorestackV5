-- The live "Authenticated users can post jobs" INSERT policy on jobs was
-- rejecting inserts even when posted_by exactly matched auth.uid() --
-- confirmed by reproducing it directly: created a fresh, fully-confirmed
-- test user via the service-role admin API, signed in with the real anon
-- key (bypassing the app/Next.js entirely), verified getUser() returned
-- that same id, then attempted the identical insert createJob() does with
-- posted_by set to that id. Got the same 42501 "new row violates row-level
-- security policy" every time.
--
-- This means the live policy doesn't actually match schema.sql's
-- documented `with check (auth.uid() = posted_by)` -- the same class of
-- schema.sql/live divergence already noted in 0002_admin_job_approval.sql.
-- Drop-and-recreate rather than ALTER, since we don't know what the live
-- definition currently and incorrectly is.

drop policy if exists "Authenticated users can post jobs" on public.jobs;

create policy "Authenticated users can post jobs"
  on public.jobs for insert
  with check (auth.uid() = posted_by);
