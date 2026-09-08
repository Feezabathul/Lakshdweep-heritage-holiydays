alter table if exists public.islands
  add column if not exists image_url text not null default '',
  add column if not exists gallery_images text[] not null default '{}',
  add column if not exists activities text[] not null default '{}',
  add column if not exists location text not null default '',
  add column if not exists status text not null default 'active',
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

-- Guard index creation: only create if the status column exists
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'islands'
      and column_name  = 'status'
  ) then
    if not exists (
      select 1 from pg_indexes
      where schemaname = 'public'
        and tablename  = 'islands'
        and indexname  = 'islands_status_idx'
    ) then
      create index islands_status_idx on public.islands (status);
    end if;
  end if;
end;
$$;

create or replace function public.set_islands_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists islands_set_updated_at on public.islands;
create trigger islands_set_updated_at
before update on public.islands
for each row execute function public.set_islands_updated_at();
