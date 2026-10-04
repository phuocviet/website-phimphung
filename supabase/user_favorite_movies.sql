-- Run in Supabase SQL editor (or as a migration).

create table if not exists public.user_favorite_movies (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  movie_id    text not null,            -- movie slug from the movie API
  movie_data  jsonb,                    -- snapshot of the movie card data (MovieItem) used for rendering
  created_at  timestamptz not null default now(),
  constraint user_favorite_movies_user_movie_unique unique (user_id, movie_id)
);

create index if not exists user_favorite_movies_user_created_idx
  on public.user_favorite_movies (user_id, created_at desc);

alter table public.user_favorite_movies enable row level security;

-- Users can only read their own rows
create policy "select own favorites"
  on public.user_favorite_movies for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can only insert rows for themselves
create policy "insert own favorites"
  on public.user_favorite_movies for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can only delete their own rows
create policy "delete own favorites"
  on public.user_favorite_movies for delete
  to authenticated
  using (auth.uid() = user_id);

-- No UPDATE policy: updates are denied by RLS.
