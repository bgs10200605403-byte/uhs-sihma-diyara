-- UHS Sihma Diyara: Supabase schema
-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'महत्वपूर्ण सूचना',
  description text,
  notice_date date not null default current_date,
  pdf_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.alumni_registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  passing_year integer,
  class_name text,
  email text,
  phone text,
  profession text,
  city text,
  message text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.notices enable row level security;
alter table public.contact_messages enable row level security;
alter table public.alumni_registrations enable row level security;

-- Public can only read published notices.
drop policy if exists "public read published notices" on public.notices;
create policy "public read published notices"
on public.notices for select to anon, authenticated
using (is_published = true);

-- Authenticated admin users can manage notices.
drop policy if exists "authenticated manage notices" on public.notices;
create policy "authenticated manage notices"
on public.notices for all to authenticated
using (true) with check (true);

-- Public can submit forms, but cannot read them.
drop policy if exists "public insert contact messages" on public.contact_messages;
create policy "public insert contact messages"
on public.contact_messages for insert to anon, authenticated
with check (true);

drop policy if exists "authenticated read contact messages" on public.contact_messages;
create policy "authenticated read contact messages"
on public.contact_messages for select to authenticated
using (true);

drop policy if exists "authenticated update contact messages" on public.contact_messages;
create policy "authenticated update contact messages"
on public.contact_messages for update to authenticated
using (true) with check (true);

-- Public can submit alumni registration, but cannot read it.
drop policy if exists "public insert alumni registrations" on public.alumni_registrations;
create policy "public insert alumni registrations"
on public.alumni_registrations for insert to anon, authenticated
with check (true);

drop policy if exists "authenticated read alumni registrations" on public.alumni_registrations;
create policy "authenticated read alumni registrations"
on public.alumni_registrations for select to authenticated
using (true);

drop policy if exists "authenticated update alumni registrations" on public.alumni_registrations;
create policy "authenticated update alumni registrations"
on public.alumni_registrations for update to authenticated
using (true) with check (true);

-- Seed only clearly-labelled sample notices.
insert into public.notices (title, category, description, notice_date, is_published)
select 'वास्तविक विद्यालय सूचना यहाँ प्रकाशित की जाएगी', 'महत्वपूर्ण सूचना', 'यह प्रारंभिक उदाहरण है। Admin panel से इसे बदलें या हटाएँ।', current_date, true
where not exists (select 1 from public.notices);

drop policy if exists "authenticated delete notices" on public.notices;
create policy "authenticated delete notices"
on public.notices for delete to authenticated
using (true);

drop policy if exists "authenticated delete contact messages" on public.contact_messages;
create policy "authenticated delete contact messages"
on public.contact_messages for delete to authenticated
using (true);

drop policy if exists "authenticated update alumni registrations" on public.alumni_registrations;
create policy "authenticated update alumni registrations"
on public.alumni_registrations for update to authenticated
using (true) with check (true);
