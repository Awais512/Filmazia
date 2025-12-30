import { create } from 'zustand';
import { Movie, TVShow, FavoriteFolder } from '@/lib/tmdb-types';
import { generateId } from '@/lib/utils';

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
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
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
      },

      remove: (id) => {
        set((state) => {
          const { [id]: removed, ...rest } = state.items;
          return { items: rest };
        });
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
      },

      renameFolder: (folderId, name) => {
        set((state) => ({
          folders: {
            ...state.folders,
            [folderId]: { ...state.folders[folderId], name },
          },
        }));
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
      },

      isFavorite: (id) => id in get().items,

      getMovieFolder: (id) => get().items[id]?.folderId,

      getAll: () => Object.values(get().items),

      getAllFolders: () => Object.values(get().folders),

  clear: () => {
    set({ items: {}, folders: {} });
  },
}));
