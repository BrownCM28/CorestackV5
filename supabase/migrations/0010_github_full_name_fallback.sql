-- The live handle_new_user() trigger (0006_full_name_from_signup.sql) only
-- reads raw_user_meta_data->>'full_name', which is correct for email
-- signup (passed explicitly as options.data.full_name) and for Google
-- OAuth (Supabase normalizes Google's `name` claim into `full_name`).
--
-- GitHub OAuth does not populate a `full_name` key the same way -- its
-- raw_user_meta_data instead carries `name` (GitHub's profile display
-- name, often set) and `user_name` (the GitHub handle, always set).
-- Without this fallback, every GitHub sign-up landed with full_name = null.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'user_name'
    )
  );
  return new;
end;
$$ language plpgsql security definer;
