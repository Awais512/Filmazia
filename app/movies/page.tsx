'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MovieCardPoster } from '@/components/movie';
import { MovieGridSkeleton, Pagination, EmptyState } from '@/components/ui';
import { Select } from '@/components/ui';
import { GENRES, SORT_OPTIONS, ITEMS_PER_PAGE } from '@/lib/constants';
import { Movie, MovieResponse } from '@/lib/tmdb-types';
import { tmdb } from '@/lib/tmdb-api';
import { SearchFilters } from '@/lib/tmdb-types';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'popularity.desc',
  });

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await tmdb.discoverMovies({ ...filters, page });
        setMovies(response.results);
        setTotalPages(Math.min(response.total_pages, 500));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters, page]);

  const handleGenreChange = (genre: string) => {
    setFilters((prev) => ({
      ...prev,
      genre: genre ? Number(genre) : undefined,
    }));
    setPage(1);
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
    setPage(1);
  };

  const handleYearChange = (year: string) => {
    setFilters((prev) => ({
      ...prev,
      year: year ? Number(year) : undefined,
    }));
    setPage(1);
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
            Browse Movies
          </h1>
          <p className="mt-2 text-gray-400">
            Discover {totalPages * ITEMS_PER_PAGE}+ movies
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <Select
              label="Genre"
              options={[
                { value: '', label: 'All Genres' },
                ...GENRES.map((g) => ({ value: String(g.id), label: g.name })),
              ]}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="min-w-[160px]"
            />
          </div>
          <div className="w-full sm:w-auto">
            <Select
              label="Sort By"
              options={SORT_OPTIONS}
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="min-w-[160px]"
            />
          </div>
          <div className="w-full sm:w-auto">
            <Select
              label="Year"
              options={[
                { value: '', label: 'All Years' },
                ...Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return { value: String(year), label: String(year) };
                }),
              ]}
              value={filters.year ? String(filters.year) : ''}
              onChange={(e) => handleYearChange(e.target.value)}
              className="min-w-[140px]"
            />
          </div>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <MovieGridSkeleton count={ITEMS_PER_PAGE} />
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MovieCardPoster movie={movie} />
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
        ) : (
          <EmptyState type="search" />
        )}
      </motion.div>
    </div>
  );
}
