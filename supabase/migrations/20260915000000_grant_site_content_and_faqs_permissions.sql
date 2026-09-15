-- Grant permissions on site_content and faqs to anon and authenticated roles
-- This allows the live site to read content and admin users to edit, delete, and save content.

grant usage on schema public to anon, authenticated;

-- Site content table permissions
grant select on table public.site_content to anon;
grant select, insert, update, delete on table public.site_content to authenticated;

-- FAQs table permissions
grant select on table public.faqs to anon;
grant select, insert, update, delete on table public.faqs to authenticated;

-- Ensure is_admin() helper function exists and has proper permissions
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- Update RLS policies to use is_admin() helper function
drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Admins can modify site content" on public.site_content;
create policy "Admins can modify site content"
  on public.site_content for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can read faqs" on public.faqs;
create policy "Anyone can read faqs"
  on public.faqs for select
  using (true);

drop policy if exists "Admins can modify faqs" on public.faqs;
create policy "Admins can modify faqs"
  on public.faqs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
