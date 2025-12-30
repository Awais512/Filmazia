'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Movie, TVShow, WatchlistItem } from '@/shared/tmdb/types';
import { createClient } from '@/features/auth/utils/supabase-client';
import {
  addWatchlistAction,
  markWatchlistUnwatchedAction,
  markWatchlistWatchedAction,
  removeWatchlistAction,
} from '@/features/watchlist/actions';

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
  setFromServer: (items: WatchlistEntry[]) => void;
}

const supabase = createClient();

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

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
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

        void syncIfAuthenticated(() =>
          addWatchlistAction({
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

        void syncIfAuthenticated(() => removeWatchlistAction({ id }));
      },

      markAsWatched: (id) => {
        set((state) => ({
          items: {
            ...state.items,
            [id]: { ...state.items[id], watched: true, watchedAt: new Date().toISOString() },
          },
        }));

        void syncIfAuthenticated(() => markWatchlistWatchedAction({ id }));
      },

      markAsUnwatched: (id) => {
        set((state) => ({
          items: {
            ...state.items,
            [id]: { ...state.items[id], watched: false, watchedAt: undefined },
          },
        }));

        void syncIfAuthenticated(() => markWatchlistUnwatchedAction({ id }));
      },

      isInWatchlist: (id) => id in get().items,

      isWatched: (id) => get().items[id]?.watched ?? false,

      getAll: () => Object.values(get().items),

      clear: () => {
        set({ items: {} });
      },

      setFromServer: (items) => {
        const nextItems: Record<number, WatchlistEntry> = {};
        for (const item of items) {
          nextItems[item.id] = item;
        }
        set({ items: nextItems });
      },
    }),
    {
      name: 'filmazia-watchlist',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        if (persistedState && typeof persistedState === 'object' && 'items' in persistedState) {
          const typedState = persistedState as { items: Record<number, unknown> };
          const migratedItems: Record<number, WatchlistEntry> = {};
          for (const [id, item] of Object.entries(typedState.items)) {
            const numId = Number(id);
            const typedItem = item as Record<string, unknown>;
            // Migrate old data: add type, title, poster_path defaults
            migratedItems[numId] = {
              id: numId,
              addedAt: (typedItem.addedAt as string) || new Date().toISOString(),
              watched: (typedItem.watched as boolean) || false,
              watchedAt: typedItem.watchedAt as string | undefined,
              type: (typedItem.type as 'movie' | 'tv') || 'movie',
              title: (typedItem.title as string) || (typedItem.name as string) || 'Unknown',
              poster_path: (typedItem.poster_path as string | null) || null,
            };
          }
          return { ...currentState, items: migratedItems };
        }
        return currentState;
      },
    }
  )
);
