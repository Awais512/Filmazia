'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MovieCardPoster } from '@/components/movie';
import { MovieGridSkeleton, EmptyState } from '@/components/ui';
import { Input } from '@/components/ui';
import { SearchResponse } from '@/lib/tmdb-types';
import { tmdb } from '@/lib/tmdb-api';
import { useUIStore } from '@/store';
import { debounce } from '@/lib/utils';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { recentSearches, addRecentSearch } = useUIStore();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        setSearched(false);
        return;
      }

      setLoading(true);
      try {
        const response = await tmdb.searchMovies(searchQuery);
        setResults(response);
        setSearched(true);
        addRecentSearch(searchQuery);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [addRecentSearch]
  );

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const handleSearch = (value: string) => {
    setQuery(value);
    performSearch(value);
  };

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
            Search Movies
          </h1>
          <p className="mt-2 text-gray-400">
            Find your favorite films
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-xl">
          <Input
            placeholder="Search by title, actor, or director..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => {
              setQuery('');
              setResults(null);
              setSearched(false);
            }}
            icon="search"
          />
        </div>

        {/* Results */}
        {loading ? (
          <MovieGridSkeleton count={10} />
        ) : results ? (
          <>
            <p className="text-gray-400">
              {results.total_results} results for "{query}"
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {results.results.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCardPoster movie={movie as any} />
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
                  onClick={() => {
                    setQuery(search);
                    performSearch(search);
                  }}
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
