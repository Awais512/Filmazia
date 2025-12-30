'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Movie, TVShow, FavoriteFolder } from '@/shared/tmdb/types';
import { generateId } from '@/shared/utils';
import { createClient } from '@/features/auth/utils/supabase-client';
import {
  addFavoriteAction,
  createFavoriteFolderAction,
  deleteFavoriteFolderAction,
  removeFavoriteAction,
  removeFavoriteFromFolderAction,
  renameFavoriteFolderAction,
} from '@/features/favorites/actions';

type FavoriteEntry = {
  id: number;
  addedAt: string;
  folderId?: string;
  type: 'movie' | 'tv';
  title: string; // movie.title or tv.name
  poster_path: string | null;
};

interface FavoritesState {
  items: Record<number, FavoriteEntry>;
  folders: Record<string, FavoriteFolder>;
  add: (item: Movie | TVShow, type: 'movie' | 'tv', folderId?: string) => void;
  remove: (id: number) => void;
  createFolder: (name: string) => string;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, name: string) => void;
  addToFolder: (item: Movie | TVShow, type: 'movie' | 'tv', folderId: string) => void;
  removeFromFolder: (movieId: number, folderId: string) => void;
  isFavorite: (id: number) => boolean;
  getMovieFolder: (id: number) => string | undefined;
  getAll: () => FavoriteEntry[];
  getAllFolders: () => FavoriteFolder[];
  clear: () => void;
  setFromServer: (items: FavoriteEntry[], folders: FavoriteFolder[]) => void;
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

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: {},
      folders: {},

      add: (item, type, folderId) => {
        set((state) => ({
          items: {
            ...state.items,
            [item.id]: {
              id: item.id,
              addedAt: new Date().toISOString(),
              folderId,
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
            folderId,
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

      createFolder: (name) => {
        const folderId = generateId();
        set((state) => ({
          folders: {
            ...state.folders,
            [folderId]: {
              id: folderId,
              name,
              movieIds: [],
              createdAt: new Date().toISOString(),
            },
          },
        }));

        void syncIfAuthenticated(() =>
          createFavoriteFolderAction({ id: folderId, name })
        );

        return folderId;
      },

      deleteFolder: (folderId) => {
        set((state) => {
          // Clear folderId reference from all items that belong to this folder
          const updatedItems = { ...state.items };
          Object.keys(updatedItems).forEach((key) => {
            const numKey = parseInt(key);
            if (updatedItems[numKey]?.folderId === folderId) {
              updatedItems[numKey] = { ...updatedItems[numKey], folderId: undefined };
            }
          });

          // Remove the folder
          const { [folderId]: removed, ...restFolders } = state.folders;

          return { items: updatedItems, folders: restFolders };
        });

        void syncIfAuthenticated(() => deleteFavoriteFolderAction({ id: folderId }));
      },

      renameFolder: (folderId, name) => {
        set((state) => ({
          folders: {
            ...state.folders,
            [folderId]: { ...state.folders[folderId], name },
          },
        }));

        void syncIfAuthenticated(() =>
          renameFavoriteFolderAction({ id: folderId, name })
        );
      },

      addToFolder: (item, type, folderId) => {
        set((state) => {
          const currentIds = state.folders[folderId]?.movieIds || [];
          const uniqueIds = Array.from(new Set([...currentIds, item.id]));
          return {
            folders: {
              ...state.folders,
              [folderId]: {
                ...state.folders[folderId],
                movieIds: uniqueIds,
              },
            },
          };
        });
        get().add(item, type, folderId);
      },

      removeFromFolder: (movieId, folderId) => {
        set((state) => {
          // Remove from folder's movieIds
          const folder = state.folders[folderId];
          if (!folder) return state;

          const updatedFolders = {
            ...state.folders,
            [folderId]: {
              ...folder,
              movieIds: folder.movieIds.filter((id) => id !== movieId),
            },
          };

          // Also clear the folderId from the item
          const updatedItems = {
            ...state.items,
            [movieId]: { ...state.items[movieId], folderId: undefined },
          };

          return { folders: updatedFolders, items: updatedItems };
        });

        void syncIfAuthenticated(() =>
          removeFavoriteFromFolderAction({ id: movieId, folderId })
        );
      },

      isFavorite: (id) => id in get().items,

      getMovieFolder: (id) => get().items[id]?.folderId,

      getAll: () => Object.values(get().items),

      getAllFolders: () => Object.values(get().folders),

      clear: () => {
        set({ items: {}, folders: {} });
      },

      setFromServer: (items, folders) => {
        const nextItems: Record<number, FavoriteEntry> = {};
        for (const item of items) {
          nextItems[item.id] = item;
        }

        const nextFolders: Record<string, FavoriteFolder> = {};
        for (const folder of folders) {
          nextFolders[folder.id] = folder;
        }

        set({ items: nextItems, folders: nextFolders });
      },
    }),
    {
      name: 'filmazia-favorites',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        if (persistedState && typeof persistedState === 'object') {
          const typedState = persistedState as {
            items?: Record<number, unknown>;
            folders?: Record<string, FavoriteFolder>;
          };
          const migratedItems: Record<number, FavoriteEntry> = {};
          if (typedState.items) {
            for (const [id, item] of Object.entries(typedState.items)) {
              const numId = Number(id);
              const typedItem = item as Record<string, unknown>;
              // Migrate old data: add type, title, poster_path defaults
              migratedItems[numId] = {
                id: numId,
                addedAt: (typedItem.addedAt as string) || new Date().toISOString(),
                folderId: typedItem.folderId as string | undefined,
                type: (typedItem.type as 'movie' | 'tv') || 'movie',
                title: (typedItem.title as string) || (typedItem.name as string) || 'Unknown',
                poster_path: (typedItem.poster_path as string | null) || null,
              };
            }
          }
          return {
            ...currentState,
            items: migratedItems,
            folders: (typedState.folders as Record<string, FavoriteFolder>) || {},
          };
        }
        return currentState;
      },
    }
  )
);
