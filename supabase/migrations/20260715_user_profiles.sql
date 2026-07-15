-- Adds editable account details to BudgetBite's existing public.users table.
-- Run this once in the Supabase SQL Editor before testing profile saves.

alter table public.users
  add column if not exists first_name text,
  add column if not exists last_name text;

-- Preserve names already stored in the legacy `name` column where possible.
update public.users
set
  first_name = coalesce(first_name, nullif(split_part(trim(name), ' ', 1), '')),
  last_name = coalesce(
    last_name,
    nullif(trim(substr(trim(name), length(split_part(trim(name), ' ', 1)) + 1)), '')
  )
where name is not null;

-- Create missing public profile rows for accounts that already exist in Auth.
insert into public.users (user_id, email, name, first_name, last_name)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name', ''),
  coalesce(raw_user_meta_data->>'first_name', ''),
  coalesce(raw_user_meta_data->>'last_name', '')
from auth.users
on conflict (user_id) do nothing;

-- Automatically create a public profile whenever a new Auth account is made.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (user_id, email, name, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  )
  on conflict (user_id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may only read, insert, or edit their own public profile row.
alter table public.users enable row level security;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile"
  on public.users for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.users to authenticated;
