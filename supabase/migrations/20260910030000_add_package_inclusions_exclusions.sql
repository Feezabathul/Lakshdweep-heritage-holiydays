-- Add the package detail fields without changing existing package data or policies.
alter table if exists public.packages
  add column if not exists inclusions text[],
  add column if not exists exclusions text[];