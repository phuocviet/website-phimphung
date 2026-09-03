import { useState, useEffect, useCallback } from 'react';
import type { WatchHistoryItem } from '../types/movie';

const STORAGE_KEY = 'phem_history';

export function useHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const saveWatchHistory = useCallback((item: Omit<WatchHistoryItem, 'watchedAt'>) => {
    setHistory((prev) => {
      const filtered = prev.filter((i) => i.slug !== item.slug);
      const newEntry: WatchHistoryItem = {
        ...item,
        watchedAt: Date.now(),
      };
      return [newEntry, ...filtered].slice(0, 30); // keep max 30 items
    });
  }, []);

  const removeFromHistory = useCallback((slug: string) => {
    setHistory((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    saveWatchHistory,
    removeFromHistory,
    clearHistory,
  };
}

