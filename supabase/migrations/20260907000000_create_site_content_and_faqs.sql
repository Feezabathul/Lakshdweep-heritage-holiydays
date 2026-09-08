-- Migration: Create Site Content & FAQs tables for Content Management
create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists faqs_display_order_idx on public.faqs (display_order);
create index if not exists faqs_is_enabled_idx on public.faqs (is_enabled);

alter table public.site_content enable row level security;
alter table public.faqs enable row level security;

-- Policies for site_content
drop policy if exists "Anyone can read site content" on public.site_content;
drop policy if exists "Authenticated users can write site content" on public.site_content;

create policy "Anyone can read site content"
  on public.site_content for select using (true);

create policy "Admins can modify site content"
  on public.site_content for all to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('super_admin', 'manager')
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('super_admin', 'manager')
    )
  );

-- Policies for faqs
drop policy if exists "Anyone can read faqs" on public.faqs;
drop policy if exists "Authenticated users can write faqs" on public.faqs;

create policy "Anyone can read faqs"
  on public.faqs for select using (true);

create policy "Admins can modify faqs"
  on public.faqs for all to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('super_admin', 'manager')
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('super_admin', 'manager')
    )
  );

-- Triggers for updated_at
create or replace function public.set_site_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_site_content_updated_at();

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at
before update on public.faqs
for each row execute function public.set_site_content_updated_at();

-- Seed initial default content
insert into public.site_content (key, value)
values
  ('homepage_hero_heading', 'Discover Paradise, Beyond the Ordinary.'),
  ('homepage_hero_description', 'Curated island escapes, water adventures, and unforgettable travel experiences with end-to-end permit support.'),
  ('homepage_cta_text', 'Explore Packages'),
  ('homepage_about_text', 'With over a decade of dedicated service, Lakshadweep Heritage Holidays specializes in crafting effortless, unforgettable island vacations. We take care of every detail—from entry permits and inter-island boat transfers to beachfront resort stays and aquatic excursions.'),
  ('homepage_why_choose_us', 'Navigating Lakshadweep permits, vessel schedules, and island accommodations requires deep local knowledge. As native islanders based in Agatti, Kavaratti & Kalpeni, we make your journey seamless from Kochi/ Goa to your final island footprint.'),
  ('about_heading', 'Authentic Lakshadweep Hospitality by Native Islanders'),
  ('about_description', 'Lakshadweep Heritage Holidays is a premier, registered island travel agency in Lakshadweep. Founded with a vision to make this untouched Indian archipelago accessible, comfortable, and memorable for travelers. We understand that visiting Lakshadweep requires careful planning — from securing mandatory entry permits and coordinating vessel movements to selecting eco-friendly beach resorts. Our native team manages every detail behind the scenes, so you can simply step onto the white sands and relax.'),
  ('about_image', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=85'),
  ('contact_phone', '9037532124'),
  ('contact_whatsapp', '9037532124'),
  ('contact_email', 'lakshadweepheritageholidays@gmail.com'),
  ('contact_address', 'lakshadweep heritage holidays kavaratti island'),
  ('contact_business_hours', 'Mon – Sat: 8:00 AM – 9:00 PM IST')
on conflict (key) do nothing;

insert into public.faqs (question, answer, display_order, is_enabled)
values
  (
    'How do I get an entry permit to visit Lakshadweep?',
    'An entry permit issued by the Lakshadweep Administration is mandatory for all Indian tourists. Lakshadweep Heritage Holidays handles 100% of your permit process! You only need to submit your valid ID proof (Aadhaar/Passport) and Passport Size Photo. We process all government paperwork seamlessly.',
    1,
    true
  ),
  (
    'What is the best time to visit Lakshadweep?',
    'The ideal time is from September to May. During these months, the sea is calm, lagoons are turquoise blue with high underwater visibility, and temperature ranges comfortably between 22°C to 32°C. June to September is the monsoon season with Rough Sea and rainfall.',
    2,
    true
  ),
  (
    'What is included in your travel packages?',
    'Our all-inclusive packages cover: Lakshadweep Entry Permit approval & documentation · Airport pickup & inter-island high-speed boat transfers · AC Standard Beach Front Rooms / Beach resorts / cottages accommodation · Breakfast, Lunch & Dinner (Fresh sea food & vegetarian options) · Complimentary snorkelling, Glass bottomed boat ride & kayaking sessions · 24/7 Local island guide support.',
    3,
    true
  ),
  (
    'Are water sports suitable for non-swimmers?',
    'Yes! Activities like Glass-bottomed boat ride, kayaking, shallow lagoon snorkelling, and Discovery Scuba Diving are 100% safe for non-swimmers. Certified life jackets are mandatory and certified PADI divemasters accompany you individually in shallow waters.',
    4,
    true
  )
on conflict do nothing;
