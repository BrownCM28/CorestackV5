-- migrations/0003_employer_own_jobs_select.sql was never actually applied
-- to the live database, despite existing in this repo -- confirmed by
-- querying pg_policy directly and finding it absent from the live jobs
-- policy list.
--
-- Its absence was the real cause of "new row violates row-level security
-- policy for table jobs" on every job post: createJob() does
-- .insert(...).select().single() (INSERT ... RETURNING). Postgres requires
-- the newly-inserted row to also be visible under an applicable SELECT
-- policy to return it from a RETURNING clause. With only "Active jobs are
-- publicly readable" (status = 'active') and the admin-only policy in
-- place, a user could never see their own freshly-created 'pending' job,
-- so the RETURNING failed -- with the exact same error message Postgres
-- uses for a WITH CHECK failure on the write itself, which is what made
-- this so easy to misdiagnose as the INSERT policy being wrong (it wasn't;
-- confirmed by reproducing an insert without .select(), which succeeded).
--
-- This is a duplicate of 0003's intent, applied here since 0003 itself
-- apparently silently failed to land live.

create policy "Users can view own jobs"
  on public.jobs for select
  using (auth.uid() = posted_by);
