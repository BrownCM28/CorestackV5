-- Jobs table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  location text not null,
  category text not null,
  remote boolean default false,
  description text,
  salary_min integer,
  salary_max integer,
  apply_target text,
  posted_by uuid references auth.users(id),
  status text default 'active' check (status in ('active', 'pending', 'closed')),
  is_featured boolean default false,
  is_hot boolean default false,
  paid_amount_cents integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.jobs enable row level security;

-- Anyone can read active jobs
create policy "Active jobs are publicly readable"
  on public.jobs for select
  using (status = 'active');

-- Authenticated users can insert jobs
create policy "Authenticated users can post jobs"
  on public.jobs for insert
  with check (auth.uid() = posted_by);

-- Users can update their own jobs
create policy "Users can update own jobs"
  on public.jobs for update
  using (auth.uid() = posted_by);

-- Saved jobs table
create table public.saved_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, job_id)
);

alter table public.saved_jobs enable row level security;

create policy "Users can manage their own saved jobs"
  on public.saved_jobs for all
  using (auth.uid() = user_id);

-- Job alerts table
create table public.job_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  keywords text,
  location text,
  category text,
  frequency text default 'weekly' check (frequency in ('daily', 'weekly')),
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.job_alerts enable row level security;

create policy "Users can manage their own job alerts"
  on public.job_alerts for all
  using (auth.uid() = user_id);

-- Behavioral events table (acquisition asset — track every user action)
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  session_id text not null,
  event_type text not null,
  metadata jsonb,
  path text,
  referrer text,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

-- Anyone (including anonymous) can insert events
create policy "Anyone can insert events"
  on public.events for insert
  with check (true);

-- Only the owning user can read their events
create policy "Users can read own events"
  on public.events for select
  using (auth.uid() = user_id);

-- Candidate profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  title text,
  location text,
  bio text,
  resume_url text,
  linkedin_url text,
  years_experience integer,
  open_to_work boolean default false,
  profile_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are readable by all"
  on public.profiles for select
  using (profile_visible = true);

create policy "Users can manage their own profile"
  on public.profiles for all
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
