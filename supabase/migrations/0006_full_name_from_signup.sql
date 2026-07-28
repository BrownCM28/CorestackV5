-- Capture the full name collected on the signup form. It's passed as
-- options.data.full_name in supabase.auth.signUp(), which lands in
-- auth.users.raw_user_meta_data immediately (no session/RLS needed) --
-- this just has the profile-creation trigger copy it across so it's on
-- the profiles row from the moment it's created, regardless of whether
-- the user ever completes OTP verification or onboarding.
--
-- Matches the live handle_new_user() definition in supabase/schema.sql
-- (public.profiles(id) with a `full_name text` column), not the stale
-- migrations/0001_init.sql version -- see 0002_admin_job_approval.sql's
-- note on the two having diverged from what's actually live.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;
