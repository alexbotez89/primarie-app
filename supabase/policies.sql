alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.requests enable row level security;
alter table public.request_updates enable row level security;

drop policy if exists "authenticated staff can read departments" on public.departments;
create policy "authenticated staff can read departments"
on public.departments
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
  )
);

drop policy if exists "user can read own profile" on public.profiles;
create policy "user can read own profile"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "authenticated staff can read requests" on public.requests;
create policy "authenticated staff can read requests"
on public.requests
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
  )
);

drop policy if exists "authenticated staff can insert requests" on public.requests;
create policy "authenticated staff can insert requests"
on public.requests
for insert
with check (true);

drop policy if exists "authenticated staff can update requests" on public.requests;
create policy "authenticated staff can update requests"
on public.requests
for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
  )
);

drop policy if exists "public can insert request updates" on public.request_updates;
create policy "public can insert request updates"
on public.request_updates
for insert
with check (true);

drop policy if exists "authenticated staff can insert updates" on public.request_updates;
create policy "authenticated staff can insert updates"
on public.request_updates
for insert
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
  )
);

drop policy if exists "authenticated staff can read updates" on public.request_updates;
create policy "authenticated staff can read updates"
on public.request_updates
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
  )
);