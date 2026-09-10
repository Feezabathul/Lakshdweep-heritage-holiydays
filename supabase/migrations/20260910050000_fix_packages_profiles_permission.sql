-- Check the caller's admin role without exposing profiles to package RLS evaluation.
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

-- Package management remains restricted to authenticated admin users.
drop policy if exists "Admins can view packages" on public.packages;
drop policy if exists "Admins can insert packages" on public.packages;
drop policy if exists "Admins can update packages" on public.packages;
drop policy if exists "Admins can delete packages" on public.packages;

create policy "Admins can view packages"
  on public.packages for select
  to authenticated
  using (public.is_admin());

create policy "Admins can insert packages"
  on public.packages for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update packages"
  on public.packages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete packages"
  on public.packages for delete
  to authenticated
  using (public.is_admin());
