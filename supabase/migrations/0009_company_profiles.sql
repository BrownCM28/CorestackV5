-- Company profiles table (employer dashboard "Company Profile" card)
create table company_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  company_name text,
  tagline text,
  logo_url text,
  about text,
  industry_focus text[],
  founded_year integer,
  headquarters text,
  markets text[],
  total_mw_capacity text,
  num_data_centers integer,
  careers_url text,
  website_url text,
  linkedin_url text,
  hiring_contact_email text,
  hiring_categories text[],
  avg_hires_per_year integer,
  interested_in_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table company_profiles enable row level security;

create policy "Users manage own company profile"
  on company_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage bucket for company logos, uploaded to company-assets/{user_id}/logo.png
insert into storage.buckets (id, name, public)
values ('company-assets', 'company-assets', true)
on conflict (id) do nothing;

create policy "Company assets are publicly readable"
  on storage.objects for select
  using (bucket_id = 'company-assets');

create policy "Users manage own company assets"
  on storage.objects for insert
  with check (
    bucket_id = 'company-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own company assets"
  on storage.objects for update
  using (
    bucket_id = 'company-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own company assets"
  on storage.objects for delete
  using (
    bucket_id = 'company-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
