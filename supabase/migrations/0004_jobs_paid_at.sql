-- Posting-fee checkout: a job is inserted as soon as checkout starts
-- (status: 'pending'), but shouldn't be visible to admin review or count
-- as a real listing until Stripe actually confirms payment. paid_at is
-- set by the Stripe webhook, not by the client, so it can't be spoofed.

ALTER TABLE jobs ADD COLUMN paid_at timestamptz;
