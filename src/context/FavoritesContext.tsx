import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { FavoriteMovie, MovieItem } from '../types/movie';

interface FavoritesContextValue {
  favorites: FavoriteMovie[];
  loading: boolean;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (movie: MovieItem) => void;
  removeFavorite: (slug: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoriteRow {
  movie_id: string;
  movie_data: MovieItem | null;
  created_at: string;
}

function rowToFavorite(row: FavoriteRow): FavoriteMovie & Partial<MovieItem> {
  const m = row.movie_data;
  return {
    ...(m ?? {}),
    slug: row.movie_id,
    name: m?.name ?? row.movie_id,
    original_name: m?.original_name ?? '',
    poster_url: m?.poster_url ?? '',
    thumb_url: m?.thumb_url ?? '',
    quality: m?.quality ?? '',
    year: m?.year ?? '',
    savedAt: new Date(row.created_at).getTime(),
  };
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, openAuthModal } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const userIdRef = useRef<string | null>(null);

  const userId = user?.id ?? null;
  userIdRef.current = userId;

  // Load the current user's favorites (RLS also restricts rows server-side).
  useEffect(() => {
    if (!supabase || !userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from('user_favorite_movies')
      .select('movie_id, movie_data, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Failed to load favorites', error);
        setFavorites(((data as FavoriteRow[]) ?? []).map(rowToFavorite));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isFavorite = useCallback(
    (slug: string) => favorites.some((f) => f.slug === slug),
    [favorites]
  );

  const removeFavorite = useCallback((slug: string) => {
    const uid = userIdRef.current;
    if (!supabase || !uid) return;
    let removed: FavoriteMovie | undefined;
    setFavorites((prev) => {
      removed = prev.find((f) => f.slug === slug);
      return prev.filter((f) => f.slug !== slug);
    });
    supabase
      .from('user_favorite_movies')
      .delete()
      .eq('user_id', uid)
      .eq('movie_id', slug)
      .then(({ error }) => {
        if (error) {
          console.error('Failed to remove favorite', error);
          const r = removed;
          if (r) setFavorites((prev) => [r, ...prev].sort((a, b) => b.savedAt - a.savedAt));
        }
      });
  }, []);

  const toggleFavorite = useCallback(
    (movie: MovieItem) => {
      const uid = userIdRef.current;
      if (!supabase || !uid) {
        openAuthModal();
        return;
      }
      if (favorites.some((f) => f.slug === movie.slug)) {
        removeFavorite(movie.slug);
        return;
      }
      const optimistic: FavoriteMovie & Partial<MovieItem> = {
        ...movie,
        slug: movie.slug,
        name: movie.name,
        original_name: movie.original_name,
        poster_url: movie.poster_url,
        thumb_url: movie.thumb_url,
        quality: movie.quality,
        year: movie.year,
        savedAt: Date.now(),
      };
      setFavorites((prev) => [optimistic, ...prev]);
      supabase
        .from('user_favorite_movies')
        .insert({ user_id: uid, movie_id: movie.slug, movie_data: movie })
        .then(({ error }) => {
          // 23505 = unique violation: already saved, state is already correct
          if (error && error.code !== '23505') {
            console.error('Failed to save favorite', error);
            setFavorites((prev) => prev.filter((f) => f.slug !== movie.slug));
          }
        });
    },
    [favorites, openAuthModal, removeFavorite]
  );

  const value = useMemo(
    () => ({ favorites, loading, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, loading, isFavorite, toggleFavorite, removeFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
