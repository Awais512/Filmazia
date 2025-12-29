'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MovieCardPoster } from '@/features/movies';
import { MovieGridSkeleton, Pagination, EmptyState, Select } from '@/shared/ui';
import { GENRES, SORT_OPTIONS, ITEMS_PER_PAGE } from '@/shared/config';
import { Movie, Genre } from '@/shared/tmdb/types';
import { getMovies } from '@/app/actions';

interface MoviesClientProps {
  initialMovies: Movie[];
  initialTotalPages: number;
  genres: Genre[];
  initialFilters: {
    genre?: number;
    year?: number;
    sortBy: string;
  };
  initialPage: number;
}

export function MoviesClient({
  initialMovies,
  initialTotalPages,
  genres,
  initialFilters,
  initialPage,
}: MoviesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [filters, setFilters] = useState(initialFilters);

  // Sync filters state with URL searchParams when they change
  useEffect(() => {
    setFilters({
      genre: searchParams.get('genre') ? Number(searchParams.get('genre')) : undefined,
      year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
      sortBy: searchParams.get('sort') || 'popularity.desc',
    });
    setPage(searchParams.get('page') ? Number(searchParams.get('page')) : 1);
  }, [searchParams]);

  // Fetch data when filters or page change
  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await getMovies(filters, page);
        if (!cancelled) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, 500));
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const params = new URLSearchParams(searchParams.toString());

      const updatedFilters = { ...filters, ...newFilters };

      // Update URL params
      if (updatedFilters.genre !== undefined) {
        if (updatedFilters.genre) {
          params.set('genre', String(updatedFilters.genre));
        } else {
          params.delete('genre');
        }
      }

      if (updatedFilters.year !== undefined) {
        if (updatedFilters.year) {
          params.set('year', String(updatedFilters.year));
        } else {
          params.delete('year');
        }
      }

      if (updatedFilters.sortBy) {
        params.set('sort', updatedFilters.sortBy);
      } else {
        params.delete('sort');
      }

      params.set('page', '1');
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [filters, router, searchParams]
  );

  const handleGenreChange = (genre: string) => {
    updateFilters({ genre: genre ? Number(genre) : undefined });
  };

  const handleSortChange = (sortBy: string) => {
    updateFilters({ sortBy });
  };

  const handleYearChange = (year: string) => {
    updateFilters({ year: year ? Number(year) : undefined });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const currentGenreName = genres.find((g) => g.id === filters.genre)?.name || '';

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
            {currentGenreName ? `${currentGenreName} Movies` : 'Browse Movies'}
          </h1>
          <p className="mt-2 text-gray-400">
            {totalPages * ITEMS_PER_PAGE}+ movies
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <Select
              label="Genre"
              options={[
                { value: '', label: 'All Genres' },
                ...genres.map((g) => ({ value: String(g.id), label: g.name })),
              ]}
              value={filters.genre ? String(filters.genre) : ''}
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
                onPageChange={handlePageChange}
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
