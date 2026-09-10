-- Use one administrative role for the project: admin.
-- This updates the existing profile only; it does not create an Auth user.
insert into public.profiles (id, role)
values ('b1589851-9a8e-49b8-9649-f66c553e778f', 'admin')
on conflict (id) do update
set role = 'admin';

-- Packages: public reads remain available; package management requires admin.
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

-- Site content and FAQs require admin.
drop policy if exists "Admins can modify site content" on public.site_content;
create policy "Admins can modify site content"
  on public.site_content for all to authenticated using (
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

drop policy if exists "Admins can modify faqs" on public.faqs;
create policy "Admins can modify faqs"
  on public.faqs for all to authenticated using (
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

-- Bookings require admin.
drop policy if exists "Admins can view bookings" on public.bookings;
drop policy if exists "Admins can insert bookings" on public.bookings;
drop policy if exists "Admins can update bookings" on public.bookings;
drop policy if exists "Admins can delete bookings" on public.bookings;

create policy "Admins can view bookings"
  on public.bookings for select to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can insert bookings"
  on public.bookings for insert to authenticated with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update bookings"
  on public.bookings for update to authenticated using (
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

create policy "Admins can delete bookings"
  on public.bookings for delete to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Accommodations require admin.
drop policy if exists "Admins can view accommodations" on public.accommodations;
drop policy if exists "Admins can insert accommodations" on public.accommodations;
drop policy if exists "Admins can update accommodations" on public.accommodations;
drop policy if exists "Admins can delete accommodations" on public.accommodations;

create policy "Admins can view accommodations"
  on public.accommodations for select to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can insert accommodations"
  on public.accommodations for insert to authenticated with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update accommodations"
  on public.accommodations for update to authenticated using (
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

create policy "Admins can delete accommodations"
  on public.accommodations for delete to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Website media remains publicly readable; changes require admin and only apply
-- to the website-media bucket.
drop policy if exists "Admins can upload website media" on storage.objects;
drop policy if exists "Admins can delete website media" on storage.objects;
drop policy if exists "Admins can update website media" on storage.objects;

create policy "Admins can upload website media"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'website-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can delete website media"
  on storage.objects for delete to authenticated using (
    bucket_id = 'website-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update website media"
  on storage.objects for update to authenticated using (
    bucket_id = 'website-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    bucket_id = 'website-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );