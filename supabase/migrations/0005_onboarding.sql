-- Required post-signup onboarding: capture user type, interests, and
-- referral source, and gate the rest of the app on completion.
--
-- profiles already has a row per user (auto-created by handle_new_user()
-- on signup, id-only) with RLS policy "Users can manage their own profile"
-- (FOR ALL USING auth.uid() = id) — no new RLS policy needed, the
-- onboarding page's own UPDATE is already covered.

ALTER TABLE profiles
  ADD COLUMN user_type text,
  ADD COLUMN interested_categories text[],
  ADD COLUMN preferred_markets text[],
  ADD COLUMN company_name text,
  ADD COLUMN search_urgency text,
  ADD COLUMN referral_source text,
  ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_user_type_check
    CHECK (user_type IS NULL OR user_type IN ('job_seeker', 'employer'));

ALTER TABLE profiles
  ADD CONSTRAINT profiles_referral_source_check
    CHECK (referral_source IS NULL OR referral_source IN ('linkedin', 'google', 'word_of_mouth', 'other'));

-- Valid urgency values differ by user_type, so the constraint checks both
-- columns together rather than search_urgency alone.
ALTER TABLE profiles
  ADD CONSTRAINT profiles_search_urgency_check
    CHECK (
      search_urgency IS NULL
      OR (user_type = 'job_seeker' AND search_urgency IN ('active', 'open', 'browsing'))
      OR (user_type = 'employer' AND search_urgency IN ('hiring_now', 'next_quarter', 'exploring'))
    );
