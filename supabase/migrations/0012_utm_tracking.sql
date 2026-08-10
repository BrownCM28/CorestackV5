-- Cold-outreach campaign attribution: utm_* params are captured from the
-- landing URL by middleware (first-touch, cs_utm cookie) and attached to
-- the profile row once onboarding completes -- see lib/utm.ts and
-- components/onboarding/OnboardingFlow.tsx. No new RLS policy needed, the
-- existing "Users can manage their own profile" policy already covers the
-- onboarding page's UPDATE.

ALTER TABLE profiles
  ADD COLUMN utm_source text,
  ADD COLUMN utm_medium text,
  ADD COLUMN utm_campaign text,
  ADD COLUMN utm_content text;
