'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/store';
import { MovieCardPoster } from '@/features/movies';
import { TVShowCardPoster } from '@/features/tv';
import { MovieGridSkeleton, EmptyState, Button } from '@/shared/ui';
import { Movie, TVShow } from '@/shared/tmdb/types';
import { getFavoritesContent } from '@/app/actions';

export function FavoritesClient() {
  const store = useFavoritesStore();
  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoize to prevent new array reference on each render
  const favoriteItems = useMemo(() => Object.values(store.items), [store.items]);

  // Fetch items using optimized server action
  useEffect(() => {
    if (favoriteItems.length === 0) return;

    let cancelled = false;

    const fetchItems = async () => {
      setLoading(true);

      try {
        const itemsToFetch = favoriteItems.map((item) => ({
          id: item.id,
          type: (item.type || 'movie') as 'movie' | 'tv',
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
  }, [favoriteItems.length]);

  const handleRemove = (id: number) => {
    store.remove(id);
  };

  if (favoriteItems.length === 0) {
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
          <div />
        </div>

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

    </div>
  );
}
