-- Keep profiles private while allowing authenticated users to read their own role.
alter table if exists public.profiles enable row level security;

grant usage on schema public to authenticated;
grant select on table public.profiles to authenticated;
revoke all on table public.profiles from anon;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());
