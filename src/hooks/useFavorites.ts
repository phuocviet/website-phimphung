import { useState, useEffect } from 'react';
import type { FavoriteMovie, MovieItem } from '../types/movie';

const STORAGE_KEY = 'phem_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const isFavorite = (slug: string): boolean => {
    return favorites.some((item) => item.slug === slug);
  };

  const toggleFavorite = (movie: MovieItem) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.slug === movie.slug);
      if (exists) {
        return prev.filter((item) => item.slug !== movie.slug);
      } else {
        const newFav: FavoriteMovie = {
          slug: movie.slug,
          name: movie.name,
          original_name: movie.original_name,
          poster_url: movie.poster_url,
          thumb_url: movie.thumb_url,
          quality: movie.quality,
          year: movie.year,
          savedAt: Date.now(),
        };
        return [newFav, ...prev];
      }
    });
  };

  const removeFavorite = (slug: string) => {
    setFavorites((prev) => prev.filter((item) => item.slug !== slug));
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };
}
