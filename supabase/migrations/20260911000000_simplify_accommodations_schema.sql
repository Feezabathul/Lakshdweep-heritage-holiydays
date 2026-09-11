-- Safe migration to simplify public.accommodations schema fields
alter table if exists public.accommodations
  add column if not exists accommodation_type text,
  add column if not exists description_points text[],
  add column if not exists updated_at timestamptz default timezone('utc', now());


-- Drop NOT NULL constraints on legacy fields if present so inserts with only simplified fields work seamlessly
alter table if exists public.accommodations
  alter column name drop not null,
  alter column category drop not null,
  alter column island drop not null,
  alter column description drop not null,
  alter column location drop not null,
  alter column price drop not null,
  alter column capacity drop not null,
  alter column amenities drop not null,
  alter column image_url drop not null,
  alter column gallery_images drop not null,
  alter column status drop not null;

-- Grant public read access to anon role for public site
grant select on table public.accommodations to anon;
grant select, insert, update, delete on table public.accommodations to authenticated;

drop policy if exists "Anyone can view accommodations" on public.accommodations;
create policy "Anyone can view accommodations"
  on public.accommodations for select using (true);

DROP TRIGGER IF EXISTS accommodations_set_updated_at ON public.accommodations;

-- Backfill data for existing legacy rows if any exist
-- Note: amenities is jsonb, so use jsonb_array_length() and cast to text[] via jsonb_array_elements_text().
--       description_points is text[], so array_length() is correct for it.
update public.accommodations
set
  accommodation_type = coalesce(nullif(accommodation_type, ''), nullif(category, ''), 'Homestay'),
  description_points = case
    when description_points is not null and array_length(description_points, 1) > 0 then description_points
    when amenities is not null and jsonb_typeof(amenities) = 'array' and jsonb_array_length(amenities) > 0 then array(select jsonb_array_elements_text(amenities))
    else array['Beach front location', 'Comfortable stays', 'Authentic hospitality']
  end
where accommodation_type is null or description_points is null;

