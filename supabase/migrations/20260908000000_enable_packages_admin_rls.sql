-- Enable Packages CRUD for the admin role.
alter table if exists public.packages enable row level security;

drop policy if exists "Admins can view packages" on public.packages;
drop policy if exists "Admins can insert packages" on public.packages;
drop policy if exists "Admins can update packages" on public.packages;
drop policy if exists "Admins can delete packages" on public.packages;

create policy "Admins can view packages"
  on public.packages for select to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can insert packages"
  on public.packages for insert to authenticated with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update packages"
  on public.packages for update to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can delete packages"
  on public.packages for delete to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
