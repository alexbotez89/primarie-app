create extension if not exists pgcrypto;

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('admin', 'operator')),
  department_id uuid references public.departments(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  citizen_name text not null,
  citizen_email text not null,
  citizen_phone text,
  title text not null,
  description text not null,
  category text not null,
  status text not null check (status in ('Nouă', 'În verificare', 'Alocată', 'În lucru', 'Rezolvată', 'Respinsă', 'Escaladată')) default 'Nouă',
  priority text not null check (priority in ('Scăzută', 'Medie', 'Ridicată', 'Critică')) default 'Medie',
  district text not null,
  address text,
  latitude double precision,
  longitude double precision,
  channel text not null check (channel in ('web', 'telefonic', 'mobil', 'email')) default 'web',
  department_id uuid references public.departments(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  public_visible boolean not null default true,
  estimated_resolution_date date,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.request_updates (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  type text not null check (type in ('created', 'status_changed', 'comment_public', 'comment_internal', 'assignment_changed', 'priority_changed')),
  message text not null,
  is_public boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists requests_set_updated_at on public.requests;

create trigger requests_set_updated_at
before update on public.requests
for each row
execute function public.set_updated_at();

insert into public.departments (name, email)
values
  ('Drumuri', 'drumuri@primarie.local'),
  ('Iluminat public', 'iluminat@primarie.local'),
  ('Salubritate', 'salubritate@primarie.local'),
  ('Spații verzi', 'spatiiverzi@primarie.local'),
  ('Mobilitate urbană', 'mobilitate@primarie.local')
on conflict (name) do nothing;