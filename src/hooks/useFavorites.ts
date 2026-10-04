import { useFavoritesContext } from '../context/FavoritesContext';

// Favorites are now persisted per-user in Supabase (see context/FavoritesContext.tsx).
// The hook keeps the same API used by existing components.
export function useFavorites() {
  return useFavoritesContext();
}
