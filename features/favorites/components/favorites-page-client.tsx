'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/store';
import { MovieCardPoster } from '@/features/movies';
import { TVShowCardPoster } from '@/features/tv';
import { MovieGridSkeleton, EmptyState, Modal, Button, Input } from '@/shared/ui';
import { Movie, TVShow } from '@/shared/tmdb/types';
import { Folder, FolderPlus, Trash2 } from 'lucide-react';
import { getFavoritesContent } from '@/app/actions';

interface FavoritesClientProps {
  // Future: could pass initial data from server if we add database support
}

export function FavoritesClient({}: FavoritesClientProps) {
  const { hydrated, store } = useFavoritesStoreHydrated();
  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Memoize to prevent new array reference on each render
  const favoriteItems = useMemo(() => Object.values(store.items), [store.items]);
  const allFolders = useMemo(() => Object.values(store.folders), [store.folders]);

  // Fetch items using optimized server action
  useEffect(() => {
    if (!hydrated) return;
    if (favoriteItems.length === 0) return;

    let cancelled = false;

    const fetchItems = async () => {
      setLoading(true);

      try {
        const itemsToFetch = favoriteItems
          .filter((item) => !activeFolder || item.folderId === activeFolder)
          .map((item) => ({
            id: item.id,
            type: (item.type || 'movie') as 'movie' | 'tv',
            folderId: item.folderId,
          }));

        if (itemsToFetch.length === 0) {
          if (!cancelled) {
            setItems([]);
            setLoading(false);
          }
          return;
        }

        const { movies, tvShows } = await getFavoritesContent(itemsToFetch);

        if (!cancelled) {
          // Combine movies and TV shows
          const fetchedItems: (Movie | TVShow)[] = [...movies, ...tvShows];
          setItems(fetchedItems);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, [hydrated, favoriteItems.length, activeFolder]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      store.createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleRemove = (id: number) => {
    store.remove(id);
  };

  const handleDeleteFolder = (folderId: string) => {
    store.deleteFolder(folderId);
  };

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="space-y-8">
          <div className="h-12 w-48 bg-cinematic-gray rounded animate-pulse" />
          <MovieGridSkeleton count={10} />
        </div>
      </div>
    );
  }

  if (favoriteItems.length === 0 && allFolders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <EmptyState
          type="favorites"
          className="[&_.button-container]:flex [&_.button-container]:gap-3"
          customActions={
            <div className="flex gap-3">
              <Link href="/movies">
                <Button>Browse Movies</Button>
              </Link>
              <Link href="/tv">
                <Button variant="outline">Browse TV Shows</Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              My Favorites
            </h1>
            <p className="mt-2 text-gray-400">
              {favoriteItems.length} items favorited
            </p>
          </div>
          <Button onClick={() => setShowCreateFolder(true)} className="gap-2">
            <FolderPlus className="w-4 h-4" />
            New Collection
          </Button>
        </div>

        {allFolders.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFolder(null)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeFolder === null
                  ? 'bg-accent-amber text-cinematic-black'
                  : 'bg-cinematic-gray text-gray-300 hover:text-white'
              }`}
            >
              <Folder className="w-4 h-4" />
              All
            </button>
            {allFolders.map((folder) => (
              <div
                key={folder.id}
                className="group flex items-center gap-1"
              >
                <button
                  onClick={() => setActiveFolder(folder.id)}
                  className={`px-4 py-2 rounded-l-lg flex items-center gap-2 transition-colors ${
                    activeFolder === folder.id
                      ? 'bg-accent-amber text-cinematic-black'
                      : 'bg-cinematic-gray text-gray-300 hover:text-white'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  {folder.name}
                </button>
                <button
                  onClick={() => handleDeleteFolder(folder.id)}
                  className="px-2 py-2 bg-cinematic-gray text-gray-400 rounded-r-lg hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <MovieGridSkeleton count={Math.max(favoriteItems.length, 10)} />
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {'title' in item ? (
                  <MovieCardPoster movie={item} />
                ) : (
                  <TVShowCardPoster show={item} />
                )}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState type="favorites" />
        )}
      </motion.div>

      <Modal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        title="Create New Collection"
      >
        <div className="space-y-4">
          <Input
            label="Collection Name"
            placeholder="e.g., Sci-Fi Classics"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowCreateFolder(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Hydration hook for favorites store
function useFavoritesStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);
  const store = useFavoritesStore();

  useEffect(() => {
    const check = () => {
      try {
        const data = localStorage.getItem('filmazia-favorites');
        if (data) {
          JSON.parse(data);
        }
        setHydrated(true);
      } catch (e) {
        setHydrated(true);
      }
    };

    check();
    const timer = setTimeout(check, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { hydrated, store };
}
