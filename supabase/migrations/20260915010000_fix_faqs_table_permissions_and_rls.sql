-- Migration: Fix permission denied for table faqs
-- 1. Grants table-level privileges to anon and authenticated roles
-- 2. Ensures the current admin user(s) have role = 'admin' in public.profiles
-- 3. Sets safe RLS policies: public read for live website, and admin-only write operations.

-- Schema & Table Grants
grant usage on schema public to anon, authenticated;
grant select on table public.faqs to anon, authenticated;
grant insert, update, delete on table public.faqs to authenticated;
grant select on table public.profiles to authenticated;

-- Ensure existing auth users have role = 'admin' in profiles table
insert into public.profiles (id, role)
select id, 'admin'
from auth.users
on conflict (id) do update
set role = 'admin';

-- Auto-assign admin role in profiles for any newly created auth user
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'admin')
  on conflict (id) do update
  set role = 'admin';
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

-- Ensure RLS is active on faqs
alter table public.faqs enable row level security;

-- Drop any previous or conflicting policies on faqs
drop policy if exists "Anyone can read faqs" on public.faqs;
drop policy if exists "Allow public read access on faqs" on public.faqs;
drop policy if exists "Public read faqs" on public.faqs;
drop policy if exists "Authenticated users can write faqs" on public.faqs;
drop policy if exists "Admins can modify faqs" on public.faqs;
drop policy if exists "Admins can insert faqs" on public.faqs;
drop policy if exists "Admins can update faqs" on public.faqs;
drop policy if exists "Admins can delete faqs" on public.faqs;

-- Define security-definer helper function is_admin()
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- Policy 1: Public read access for the live website
create policy "Allow public read access on faqs"
  on public.faqs for select
  using (true);

-- Policy 2: Admin INSERT (only users with profiles.role = 'admin')
create policy "Admins can insert faqs"
  on public.faqs for insert
  to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy 3: Admin UPDATE (only users with profiles.role = 'admin')
create policy "Admins can update faqs"
  on public.faqs for update
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy 4: Admin DELETE (only users with profiles.role = 'admin')
create policy "Admins can delete faqs"
  on public.faqs for delete
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
