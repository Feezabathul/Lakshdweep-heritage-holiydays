-- Allow the authenticated Supabase role to reach the existing admin tables.
-- RLS policies below still control which authenticated users may act.
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.packages to authenticated;
grant select, insert, update, delete on table public.bookings to authenticated;
grant select, insert, update, delete on table public.accommodations to authenticated;
grant select, insert, update, delete on table public.islands to authenticated;

-- Only authorized admin profiles may use Packages.
alter table public.packages enable row level security;
drop policy if exists "Admins can view packages" on public.packages;
drop policy if exists "Admins can insert packages" on public.packages;
drop policy if exists "Admins can update packages" on public.packages;
drop policy if exists "Admins can delete packages" on public.packages;

create policy "Admins can view packages"
  on public.packages for select to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can insert packages"
  on public.packages for insert to authenticated with check (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can update packages"
  on public.packages for update to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can delete packages"
  on public.packages for delete to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );

-- Only authorized admin profiles may use Bookings.
alter table public.bookings enable row level security;
drop policy if exists "Admins can view bookings" on public.bookings;
drop policy if exists "Admins can insert bookings" on public.bookings;
drop policy if exists "Admins can update bookings" on public.bookings;
drop policy if exists "Admins can delete bookings" on public.bookings;

create policy "Admins can view bookings"
  on public.bookings for select to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can insert bookings"
  on public.bookings for insert to authenticated with check (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can update bookings"
  on public.bookings for update to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can delete bookings"
  on public.bookings for delete to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );

-- Restrict Accommodations and Islands administration to admin.
alter table public.accommodations enable row level security;
drop policy if exists "Authenticated users can view accommodations" on public.accommodations;
drop policy if exists "Authenticated users can insert accommodations" on public.accommodations;
drop policy if exists "Authenticated users can update accommodations" on public.accommodations;
drop policy if exists "Authenticated users can delete accommodations" on public.accommodations;

create policy "Admins can view accommodations"
  on public.accommodations for select to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can insert accommodations"
  on public.accommodations for insert to authenticated with check (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can update accommodations"
  on public.accommodations for update to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can delete accommodations"
  on public.accommodations for delete to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );

alter table public.islands enable row level security;
drop policy if exists "Admins can view islands" on public.islands;
drop policy if exists "Admins can insert islands" on public.islands;
drop policy if exists "Admins can update islands" on public.islands;
drop policy if exists "Admins can delete islands" on public.islands;

create policy "Admins can view islands"
  on public.islands for select to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can insert islands"
  on public.islands for insert to authenticated with check (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can update islands"
  on public.islands for update to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
create policy "Admins can delete islands"
  on public.islands for delete to authenticated using (
    exists (select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin')
  );
