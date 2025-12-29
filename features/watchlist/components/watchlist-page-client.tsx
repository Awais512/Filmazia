'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWatchlistStore } from '@/store';
import { MovieCardPoster } from '@/features/movies';
import { TVShowCardPoster } from '@/features/tv';
import { MovieGridSkeleton, EmptyState, Pagination, Select, Button } from '@/shared/ui';
import { Movie, TVShow } from '@/shared/tmdb/types';
import { ITEMS_PER_PAGE } from '@/shared/config';
import { getWatchlistContent } from '@/app/actions';

interface WatchlistClientProps {
  // Future: could pass initial data from server if we add database support
}

export function WatchlistClient({}: WatchlistClientProps) {
  const { hydrated, store } = useWatchlistStoreHydrated();
  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  // Memoize to prevent new array reference on each render
  const watchlistItems = useMemo(() => Object.values(store.items), [store.items]);
  const totalPages = Math.ceil(watchlistItems.length / ITEMS_PER_PAGE);

  // Fetch items using optimized server action
  useEffect(() => {
    if (!hydrated) return;
    if (watchlistItems.length === 0) return;

    let cancelled = false;

    const fetchItems = async () => {
      setLoading(true);

      try {
        const itemsToFetch = watchlistItems
          .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
          .map((item) => ({
            id: item.id,
            type: (item.type || 'movie') as 'movie' | 'tv',
          }));

        const { movies, tvShows } = await getWatchlistContent(itemsToFetch);

        if (cancelled) return;

        // Combine and sort
        const fetchedItems: (Movie | TVShow)[] = [...movies, ...tvShows];

        if (sortBy === 'date') {
          fetchedItems.sort((a, b) => {
            const dateA = 'release_date' in a ? a.release_date : a.first_air_date;
            const dateB = 'release_date' in b ? b.release_date : b.first_air_date;
            return new Date(dateB || '').getTime() - new Date(dateA || '').getTime();
          });
        } else {
          fetchedItems.sort((a, b) => b.vote_average - a.vote_average);
        }

        setItems(fetchedItems);
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
  }, [hydrated, watchlistItems.length, page, sortBy]);

  const handleRemove = (id: number) => {
    store.remove(id);
  };

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="space-y-8">
          <div className="h-12 w-48 bg-cinematic-gray rounded animate-pulse" />
          <MovieGridSkeleton count={ITEMS_PER_PAGE} />
        </div>
      </div>
    );
  }

  if (watchlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <EmptyState
          type="watchlist"
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
              My Watchlist
            </h1>
            <p className="mt-2 text-gray-400">
              {watchlistItems.length} items saved
            </p>
          </div>
          <Select
            options={[
              { value: 'date', label: 'Added Date' },
              { value: 'rating', label: 'Rating' },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
            className="w-40"
          />
        </div>

        {loading ? (
          <MovieGridSkeleton count={Math.min(watchlistItems.length, ITEMS_PER_PAGE)} />
        ) : (
          <>
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

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="mt-12"
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

// Hydration hook for watchlist store
function useWatchlistStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);
  const store = useWatchlistStore();

  useEffect(() => {
    const check = () => {
      try {
        const data = localStorage.getItem('filmazia-watchlist');
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
