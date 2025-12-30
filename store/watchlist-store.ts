import { create } from 'zustand';
import { Movie, TVShow, WatchlistItem } from '@/lib/tmdb-types';

type WatchlistEntry = WatchlistItem & {
  type: 'movie' | 'tv';
  title: string; // movie.title or tv.name
  poster_path: string | null;
};

interface WatchlistState {
  items: Record<number, WatchlistEntry>;
  add: (item: Movie | TVShow, type: 'movie' | 'tv') => void;
  remove: (id: number) => void;
  markAsWatched: (id: number) => void;
  markAsUnwatched: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  isWatched: (id: number) => boolean;
  getAll: () => WatchlistEntry[];
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>()((set, get) => ({
  items: {},

      add: (item, type) => {
        set((state) => ({
          items: {
            ...state.items,
            [item.id]: {
              id: item.id,
              addedAt: new Date().toISOString(),
              watched: false,
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

      markAsWatched: (id) => {
        set((state) => ({
          items: {
            ...state.items,
            [id]: { ...state.items[id], watched: true, watchedAt: new Date().toISOString() },
          },
        }));
      },

      markAsUnwatched: (id) => {
        set((state) => ({
          items: {
            ...state.items,
            [id]: { ...state.items[id], watched: false, watchedAt: undefined },
          },
        }));
      },

      isInWatchlist: (id) => id in get().items,

      isWatched: (id) => get().items[id]?.watched ?? false,

      getAll: () => Object.values(get().items),

  clear: () => {
    set({ items: {} });
  },
}));
