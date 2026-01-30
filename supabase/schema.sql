create extension if not exists "pgcrypto";

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  teacher_name text not null,
  subject text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  nickname text not null,
  review_text text,
  user_id uuid references auth.users(id),
  is_approved boolean not null default false,
  is_rejected boolean not null default false,
  approved_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists reviews_school_idx on reviews (school);
create index if not exists reviews_approved_idx on reviews (is_approved);

alter table reviews enable row level security;

create policy "public can insert reviews"
on reviews
for insert
to anon, authenticated
with check (true);

create policy "public can read approved reviews"
on reviews
for select
to anon, authenticated
using (is_approved = true);

create policy "authenticated can read own reviews"
on reviews
for select
to authenticated
using (user_id = auth.uid());
