'use client';

import { create } from 'zustand';
import { Movie, TVShow } from '@/shared/tmdb/types';
import { supabase } from '@/features/auth/utils/supabase-client';
import {
  addFavoriteAction,
  removeFavoriteAction,
} from '@/features/favorites/actions';

type FavoriteEntry = {
  id: number;
  addedAt: string;
  type: 'movie' | 'tv';
  title: string; // movie.title or tv.name
  poster_path: string | null;
};

interface FavoritesState {
  items: Record<number, FavoriteEntry>;
  add: (item: Movie | TVShow, type: 'movie' | 'tv') => void;
  remove: (id: number) => void;
  isFavorite: (id: number) => boolean;
  getAll: () => FavoriteEntry[];
  clear: () => void;
  setFromServer: (items: FavoriteEntry[]) => void;
}

const syncIfAuthenticated = async (action: () => Promise<void>) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await action();
  } catch {
    return;
  }
};

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  items: {},

  add: (item, type) => {
    set((state) => ({
      items: {
        ...state.items,
        [item.id]: {
          id: item.id,
          addedAt: new Date().toISOString(),
          type,
          title: 'title' in item ? item.title : item.name,
          poster_path: item.poster_path,
        },
      },
    }));

    void syncIfAuthenticated(() =>
      addFavoriteAction({
        id: item.id,
        type,
        title: 'title' in item ? item.title : item.name,
        poster_path: item.poster_path,
      })
    );
  },

  remove: (id) => {
    set((state) => {
      const { [id]: removed, ...rest } = state.items;
      return { items: rest };
    });

    void syncIfAuthenticated(() => removeFavoriteAction({ id }));
  },

  isFavorite: (id) => id in get().items,

  getAll: () => Object.values(get().items),

  clear: () => {
    set({ items: {} });
  },

  setFromServer: (items) => {
    const nextItems: Record<number, FavoriteEntry> = {};
    for (const item of items) {
      nextItems[item.id] = item;
    }

    set({ items: nextItems });
  },
}));
