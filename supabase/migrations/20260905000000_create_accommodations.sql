create table if not exists public.accommodations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  island text not null,
  description text not null default '',
  location text not null default '',
  price numeric(12, 2) not null default 0 check (price >= 0),
  capacity integer not null default 1 check (capacity > 0),
  amenities text[] not null default '{}',
  image_url text not null default '',
  gallery_images text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'inactive')),
  badge text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Safely add columns that may be missing if the table already existed
alter table public.accommodations
  add column if not exists island text not null default '';

alter table public.accommodations
  add column if not exists location text not null default '';

alter table public.accommodations
  add column if not exists price numeric(12, 2) not null default 0;

alter table public.accommodations
  add column if not exists capacity integer not null default 1;

alter table public.accommodations
  add column if not exists amenities text[] not null default '{}';

alter table public.accommodations
  add column if not exists image_url text not null default '';

alter table public.accommodations
  add column if not exists gallery_images text[] not null default '{}';

alter table public.accommodations
  add column if not exists badge text;

-- Only create indexes when the required columns exist
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'accommodations'
      and column_name  = 'island'
  ) then
    if not exists (
      select 1 from pg_indexes
      where schemaname = 'public'
        and tablename  = 'accommodations'
        and indexname  = 'accommodations_island_idx'
    ) then
      create index accommodations_island_idx on public.accommodations (island);
    end if;
  end if;

  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and tablename  = 'accommodations'
      and indexname  = 'accommodations_status_idx'
  ) then
    create index accommodations_status_idx on public.accommodations (status);
  end if;
end;
$$;

alter table public.accommodations enable row level security;

drop policy if exists "Authenticated users can view accommodations" on public.accommodations;
drop policy if exists "Authenticated users can insert accommodations" on public.accommodations;
drop policy if exists "Authenticated users can update accommodations" on public.accommodations;
drop policy if exists "Authenticated users can delete accommodations" on public.accommodations;

create policy "Authenticated users can view accommodations"
  on public.accommodations for select to authenticated using (true);

create policy "Authenticated users can insert accommodations"
  on public.accommodations for insert to authenticated with check (true);

create policy "Authenticated users can update accommodations"
  on public.accommodations for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete accommodations"
  on public.accommodations for delete to authenticated using (true);

create or replace function public.set_accommodations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists accommodations_set_updated_at on public.accommodations;
create trigger accommodations_set_updated_at
before update on public.accommodations
for each row execute function public.set_accommodations_updated_at();

insert into public.accommodations (name, category, island, description, badge)
values
  ('Homestay', 'BEACH FRONT HOMESTAY', 'Agatti', 'Experience Lakshadweep like a local with comfortable beach-front stays and warm island hospitality.', null),
  ('Resort', 'BEACH RESORT', 'Agatti', 'Relax in a beautiful beach resort with premium surroundings and modern tropical comfort.', 'PREMIUM STAY'),
  ('Standard Rooms', 'BEACH FRONT STANDARD ROOMS', 'Agatti', 'Clean, comfortable and practical beach-front rooms for a convenient island stay.', null)
on conflict do nothing;
