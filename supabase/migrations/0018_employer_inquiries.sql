-- Employer inquiry box on the homepage -- a lower-commitment alternative
-- to the self-serve /post flow for employers who want Corestack to reach
-- out rather than post a listing themselves right away.
--
-- Same shape as application_leads (0017): no session exists at submission
-- time, so this only grants public INSERT (WITH CHECK (true)). No public
-- SELECT policy -- this table holds PII/business leads and should only be
-- read via the service role.
CREATE TABLE employer_inquiries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name  text NOT NULL,
  contact_name  text NOT NULL,
  email         text NOT NULL,
  phone         text,
  message       text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE employer_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an employer inquiry"
  ON employer_inquiries FOR INSERT WITH CHECK (true);
