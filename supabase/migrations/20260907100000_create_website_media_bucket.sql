-- Migration: Create website-media Storage bucket with role-based RLS policies
-- Safe to re-run: uses IF NOT EXISTS / DO blocks throughout.

-- 1. Create the bucket (public = true so images are readable without auth)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  5242880, -- 5 MB per file
  array['image/jpeg','image/jpg','image/png','image/webp']
)
on conflict (id) do update set
  public            = excluded.public,
  file_size_limit   = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Drop any stale policies so this migration is idempotent
drop policy if exists "Public can read website media"         on storage.objects;
drop policy if exists "Admins can upload website media"       on storage.objects;
drop policy if exists "Admins can delete website media"       on storage.objects;
drop policy if exists "Admins can update website media"       on storage.objects;

-- 3. Public read: anyone may read objects inside website-media
create policy "Public can read website media"
  on storage.objects for select
  using (bucket_id = 'website-media');

-- 4. Admin upload: only super_admin or manager may insert objects
create policy "Admins can upload website media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'website-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('super_admin', 'manager')
    )
  );

-- 5. Admin delete: only super_admin or manager may delete objects
create policy "Admins can delete website media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'website-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('super_admin', 'manager')
    )
  );

-- 6. Admin update (needed so storage upsert works properly)
create policy "Admins can update website media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'website-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('super_admin', 'manager')
    )
  )
  with check (
    bucket_id = 'website-media'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('super_admin', 'manager')
    )
  );
