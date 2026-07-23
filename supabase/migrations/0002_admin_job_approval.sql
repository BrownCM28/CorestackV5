-- Admin job approval flow: grant the admin (matched by email, mirroring the
-- ADMIN_EMAIL app check) read/write access to jobs regardless of status or
-- owner — the existing policies only ever grant access to active jobs or a
-- user's own jobs.
--
-- No column/type change needed here: the live `jobs.status` column is
-- `text` with a check constraint (jobs_status_check) that already allows
-- 'active' | 'pending' | 'closed' — it does not match this repo's
-- migrations/0001_init.sql, which defines status as a `job_status` enum
-- without 'pending'. The two schema files in this repo have diverged from
-- what's actually live; this migration only assumes the check-constraint
-- version (confirmed against the live database on 2026-07-23).

CREATE POLICY "Admin can view all jobs"
  ON jobs FOR SELECT
  USING ((auth.jwt() ->> 'email') = 'charlesbmorrisey@gmail.com');

CREATE POLICY "Admin can update any job"
  ON jobs FOR UPDATE
  USING ((auth.jwt() ->> 'email') = 'charlesbmorrisey@gmail.com');
