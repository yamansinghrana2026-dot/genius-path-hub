# PJN Educare — Supabase Setup

Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/tvjdlkbrpjmjjyceqmdl/sql) **once** before using the site.

## 1. Tables, RLS & Storage

```sql
-- ============================================================
-- COURSES
-- ============================================================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('IIT-JEE','NEET','CUET','NDA','Govt Jobs')),
  description text,
  fees integer not null default 0,
  duration text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.courses enable row level security;

create policy "Courses are public-readable when active"
  on public.courses for select using (is_active = true);

create policy "Authenticated can manage courses"
  on public.courses for all to authenticated using (true) with check (true);

-- ============================================================
-- LEADS
-- ============================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 100),
  phone text not null check (length(phone) between 8 and 20),
  course text,
  message text check (message is null or length(message) <= 500),
  status text not null default 'new'
    check (status in ('new','contacted','interested','converted','cold')),
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;

-- Anyone can submit a lead (contact form)
create policy "Anyone can insert leads"
  on public.leads for insert to anon, authenticated with check (true);

-- Only admins can read/update/delete
create policy "Authenticated can read leads"
  on public.leads for select to authenticated using (true);
create policy "Authenticated can update leads"
  on public.leads for update to authenticated using (true);
create policy "Authenticated can delete leads"
  on public.leads for delete to authenticated using (true);

-- ============================================================
-- RESULTS
-- ============================================================
create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  exam text,
  marks text,
  rank text,
  image_url text,
  year integer,
  created_at timestamptz not null default now()
);
alter table public.results enable row level security;

create policy "Results are public-readable"
  on public.results for select using (true);
create policy "Authenticated can manage results"
  on public.results for all to authenticated using (true) with check (true);

-- ============================================================
-- SETTINGS (single row)
-- ============================================================
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  phone text,
  whatsapp text,
  email text,
  hero_heading text,
  hero_subheading text,
  logo_url text,
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;

create policy "Settings are public-readable"
  on public.settings for select using (true);
create policy "Authenticated can manage settings"
  on public.settings for all to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE BUCKET for student result photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('results', 'results', true)
on conflict (id) do nothing;

create policy "Results bucket public read"
  on storage.objects for select using (bucket_id = 'results');
create policy "Authenticated can upload result photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'results');
create policy "Authenticated can delete result photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'results');
```

## 2. Create your admin user

In **Authentication → Users → Add user**, create a user with email + password. That user can sign in at `/admin/login`.

## 3. Disable public signups (recommended)

In **Authentication → Providers → Email**, turn off "Enable email signups" so only admins you create manually can log in.

## Done!

Visit `/` for the public site, `/admin/login` to manage everything.
