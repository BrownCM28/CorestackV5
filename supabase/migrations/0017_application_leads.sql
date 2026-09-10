-- Anonymous lead capture for the job-detail Apply flow. Replaces the old
-- sign-in-to-apply gate -- a guest submits name + email here instead of
-- creating an account, then gets sent to the employer's apply_target.
--
-- No session exists yet at submission time, so this only grants public
-- INSERT (WITH CHECK (true)). No public SELECT policy -- this table holds
-- PII and should only be read via the service role.
CREATE TABLE application_leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid NOT NULL REFERENCES jobs ON DELETE CASCADE,
  first_name  text NOT NULL,
  last_name   text NOT NULL,
  email       text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE application_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead"
  ON application_leads FOR INSERT WITH CHECK (true);
