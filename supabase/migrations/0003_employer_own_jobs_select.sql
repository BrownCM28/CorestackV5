-- Employer dashboard: employers need to see their own jobs regardless of
-- status (pending/closed), not just active ones. The only existing SELECT
-- policy on jobs requires status = 'active', which silently hides an
-- employer's own pending/closed listings from themselves (same class of
-- gap fixed for the admin approval flow in 0002_admin_job_approval.sql,
-- scoped here to the owning user instead of the admin email).

CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = posted_by);
