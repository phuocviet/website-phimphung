-- Run in Supabase SQL editor.
-- One row per user: what that user is currently/last watching.
-- This data is intentionally PUBLIC-READABLE (powers the "bubbles" on the homepage).
-- Only the owner can write/delete their own row. user_favorite_movies stays private.

create table if not exists public.user_activity (
  user_id     uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  username    text not null,
  movie_slug  text not null,
  movie_name  text not null,
  poster_url  text,
  updated_at  timestamptz not null default now()
);

create index if not exists user_activity_updated_idx
  on public.user_activity (updated_at desc);

alter table public.user_activity enable row level security;

create policy "anyone can read activity"
  on public.user_activity for select
  to anon, authenticated
  using (true);

create policy "insert own activity"
  on public.user_activity for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "update own activity"
  on public.user_activity for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own activity"
  on public.user_activity for delete
  to authenticated
  using (auth.uid() = user_id);
