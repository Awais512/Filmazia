'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MovieCardPoster } from '@/features/movies';
import { TVShowCardPoster } from '@/features/tv';
import { MovieGridSkeleton, EmptyState, Input } from '@/shared/ui';
import { useUIStore } from '@/store';
import { debounce } from '@/shared/utils';
import { MovieResponse, TVShowResponse } from '@/shared/tmdb/types';
import { searchContent } from '@/app/actions';

interface SearchClientProps {
  initialQuery: string;
  initialResults?: {
    movies: MovieResponse;
    tvShows: TVShowResponse;
  };
}

export function SearchClient({ initialQuery, initialResults }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { recentSearches, addRecentSearch } = useUIStore();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{
    movies: MovieResponse;
    tvShows: TVShowResponse;
  } | null>(initialResults || null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        setSearched(false);
        return;
      }

      setLoading(true);
      try {
        const response = await searchContent(searchQuery);
        setResults(response);
        setSearched(true);
        addRecentSearch(searchQuery);

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('q', searchQuery);
        router.push(`?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [addRecentSearch, router, searchParams]
  );

  useEffect(() => {
    if (initialQuery && !initialResults) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch, initialResults]);

  const handleSearch = (value: string) => {
    setQuery(value);
    performSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setSearched(false);

    // Clear URL params
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    performSearch(search);
  };

  const totalResults = (results?.movies.total_results || 0) + (results?.tvShows.total_results || 0);
  const allResults = [
    ...(results?.movies.results || []).map((m) => ({ ...m, type: 'movie' as const })),
    ...(results?.tvShows.results || []).map((s) => ({ ...s, type: 'tv' as const })),
  ].sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            Search
          </h1>
          <p className="mt-2 text-gray-400">
            Find movies and TV shows
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-xl">
          <Input
            placeholder="Search by title..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={handleClear}
            icon="search"
          />
        </div>

        {/* Results */}
        {loading ? (
          <MovieGridSkeleton count={10} />
        ) : results ? (
          <>
            <p className="text-gray-400">
              {totalResults} results for "{query}"
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {allResults.map((item, index) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {'title' in item ? (
                    <MovieCardPoster movie={item as any} />
                  ) : (
                    <TVShowCardPoster show={item as any} />
                  )}
                </motion.div>
              ))}
            </div>
          </>
        ) : searched ? (
          <EmptyState type="search" />
        ) : recentSearches.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleRecentSearch(search)}
                  className="px-4 py-2 bg-cinematic-gray rounded-lg text-sm text-gray-300 hover:text-white hover:bg-cinematic-light transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
