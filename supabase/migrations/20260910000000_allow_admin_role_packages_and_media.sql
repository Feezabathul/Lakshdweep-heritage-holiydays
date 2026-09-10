-- Allow the admin role used by the admin portal to manage packages and website media.
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.packages to authenticated;
grant select on table public.packages to anon;

drop policy if exists "Anyone can view packages" on public.packages;
create policy "Anyone can view packages"
  on public.packages for select using (true);

insert into public.packages (name, duration, price, image_url, description)
select seed.name, seed.duration, seed.price, seed.image_url, seed.description
from (values
  ('Kalpeni Island Adventure Package', '3 Nights / 4 Days', 11399, '/images/kalpeni_island.jpg', 'Thrill-filled itinerary with Sightseeing and Water Adventure'),
  ('Agatti Island Adventure Package', '3 Nights / 4 Days', 12499, '/images/agatti_island.jpg', 'Explore the Beauty of Gateway of Lakshadweep'),
  ('Honeymoon in Paradise.(Agatti/ Kavaratti/ Kalpeni)', '3 Nights / 4 Days', 29999, '/images/honeymoon.jpg', 'Secluded premium, private beach candlelight dinner & sunset cruise.'),
  ('Family Island Holiday(Agatti/ Kavaratti/Kalpeni).', '3 Nights / 4 Days', 13399, '/images/family_island_holiday.jpg', 'Safe, fun-filled family vacation with shallow lagoon activities.')
) as seed(name, duration, price, image_url, description)
where not exists (
  select 1 from public.packages existing where existing.name = seed.name
);

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
