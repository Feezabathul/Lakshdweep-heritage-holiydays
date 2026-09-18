-- Allow anyone (public anon visitors and authenticated users) to view packages on the public site.
grant select on table public.packages to anon;
grant select on table public.packages to authenticated;

drop policy if exists "Anyone can view packages" on public.packages;
create policy "Anyone can view packages"
  on public.packages for select
  using (true);
