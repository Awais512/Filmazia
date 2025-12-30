import { create } from 'zustand';
import { Movie, TVShow } from '@/lib/tmdb-types';

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
}

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
  },

  remove: (id) => {
    set((state) => {
      const { [id]: removed, ...rest } = state.items;
      return { items: rest };
    });
  },

  isFavorite: (id) => id in get().items,

  getAll: () => Object.values(get().items),

  clear: () => {
    set({ items: {} });
  },
}));
