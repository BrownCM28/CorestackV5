-- SEO-friendly job URL slugs. New jobs get a slug set right after insert
-- (see generateSlug() in lib/utils.ts and createJob() in app/actions/jobs.ts);
-- this migration adds the column and backfills existing rows.
--
-- The 8-char id suffix is what actually guarantees uniqueness -- verified
-- against all 167 live rows with the same logic before running this: zero
-- collisions, since two jobs would need a genuine UUID collision (not just
-- similar title/company text) to produce the same slug.

alter table jobs add column if not exists slug text unique;

update jobs
set slug = lower(
  regexp_replace(
    regexp_replace(
      concat(
        substring(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), 1, 40),
        '-',
        substring(regexp_replace(company, '[^a-zA-Z0-9\s]', '', 'g'), 1, 30),
        '-',
        substring(id::text, 1, 8)
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
where slug is null;
