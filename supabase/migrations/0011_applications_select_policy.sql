-- AuthGate now checks whether the current user has already applied to a
-- job (to persist the "applied" confirmation across reloads/new tabs),
-- which requires a SELECT policy scoped to the applicant. The original
-- 0001_init.sql already defines this policy, but per this project's
-- established pattern (see 0003_employer_own_jobs_select.sql /
-- 0008_jobs_view_own_select_policy.sql) some of that file's policies never
-- actually landed on the live database. This is a no-op if it's already
-- there -- Postgres will just error on the duplicate, which is safe to
-- ignore.
create policy "Users can view own applications"
  on applications for select
  using (auth.uid() = applicant_id);
