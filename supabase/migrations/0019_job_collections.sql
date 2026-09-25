-- Lightweight tagging for featured job collections (e.g. "Texas Data
-- Center Construction") that get their own sub-page at
-- /jobs/collections/[slug] and a button in the /jobs page's featured-
-- collections bar. Nullable and generic on purpose: adding a new
-- collection later is just tagging jobs with a new slug and adding an
-- entry to FEATURED_COLLECTIONS in lib/constants.ts -- no new column or
-- migration needed.
ALTER TABLE jobs ADD COLUMN collection text;
CREATE INDEX jobs_collection_idx ON jobs (collection) WHERE collection IS NOT NULL;
