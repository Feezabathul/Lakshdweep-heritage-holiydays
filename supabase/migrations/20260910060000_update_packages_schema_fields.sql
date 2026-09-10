-- Ensure public.packages schema has only required fields: name, description, duration, price, image_url, inclusions, exclusions.
alter table if exists public.packages
  add column if not exists inclusions text[],
  add column if not exists exclusions text[];

alter table if exists public.packages
  drop column if exists island_id,
  drop column if exists island,
  drop column if exists category,
  drop column if exists itinerary;
