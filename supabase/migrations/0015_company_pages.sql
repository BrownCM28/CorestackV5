-- Public-facing company profile pages (app/companies/[slug]). Company page
-- slugs are derived from the company name on jobs (see lib/utils.ts'
-- generateCompanySlug) since jobs.company is free text with no FK to
-- company_profiles -- most companies shown on /companies won't have a
-- claimed profile row at all. This slug is only set/used once an employer
-- actually claims and saves their company profile.
alter table company_profiles add column if not exists slug text unique;

create table if not exists company_updates (
  id uuid primary key default gen_random_uuid(),
  company_profile_id uuid references company_profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table company_updates enable row level security;

create policy "Company updates are publicly readable"
  on company_updates for select
  using (true);

create policy "Users manage own company updates"
  on company_updates for all
  using (
    exists (
      select 1 from company_profiles
      where company_profiles.id = company_updates.company_profile_id
      and company_profiles.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from company_profiles
      where company_profiles.id = company_updates.company_profile_id
      and company_profiles.user_id = auth.uid()
    )
  );
