-- Run in Supabase SQL editor
create extension if not exists "pgcrypto";

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text not null,
  tenure text,
  template_content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lor_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null,
  tenure text not null,
  template_id uuid not null references public.templates(id) on delete restrict,
  token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists lor_users_email_name_uq
on public.lor_users (lower(email), lower(name));

create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('super_admin', 'admin'))
);

-- Function to check if a user is an admin (bypasses RLS)
create or replace function public.is_admin(uid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  return exists (select 1 from public.admins a where a.id = uid);
end;
$$;

-- Function to check if a user is a super_admin (bypasses RLS)
create or replace function public.is_super_admin(uid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  return exists (select 1 from public.admins a where a.id = uid and a.role = 'super_admin');
end;
$$;

alter table public.templates enable row level security;
alter table public.lor_users enable row level security;
alter table public.admins enable row level security;

drop policy if exists "templates read for admin" on public.templates;
create policy "templates read for admin"
on public.templates for select
using (public.is_admin(auth.uid()));

drop policy if exists "templates write for admin" on public.templates;
create policy "templates write for admin"
on public.templates for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "lor_users read for admin" on public.lor_users;
create policy "lor_users read for admin"
on public.lor_users for select
using (public.is_admin(auth.uid()));

drop policy if exists "lor_users write for admin" on public.lor_users;
create policy "lor_users write for admin"
on public.lor_users for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admins self read" on public.admins;
create policy "admins self read"
on public.admins for select
using (id = auth.uid());

drop policy if exists "admins managed by super_admin" on public.admins;
create policy "admins managed by super_admin"
on public.admins for all
using (
  public.is_super_admin(auth.uid())
)
with check (
  public.is_super_admin(auth.uid())
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_templates_updated_at on public.templates;
create trigger trg_templates_updated_at
before update on public.templates
for each row execute function public.touch_updated_at();

drop trigger if exists trg_lor_users_updated_at on public.lor_users;
create trigger trg_lor_users_updated_at
before update on public.lor_users
for each row execute function public.touch_updated_at();