-- Original, SEO-targeted editorial content, hosted at /news/[slug]. Separate
-- from the existing `news` table (external press links only, no body
-- content) -- see lib/api.ts's getNews(), which merges both into one feed
-- for the ticker, home sidebar, and /news page.
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  body text not null,
  category text,
  author text not null default 'Corestack Team',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table articles enable row level security;

create policy "Public read articles" on articles for select using (true);
