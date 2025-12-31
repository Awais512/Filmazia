'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Grid3X3, List } from 'lucide-react';
import { TVShowCardPoster } from '@/features/tv';
import { TVShowCardList } from '@/features/tv/components/tvshow-card-list';
import { MovieGridSkeleton, Pagination, EmptyState, Select } from '@/shared/ui';
import { ITEMS_PER_PAGE } from '@/shared/config';
import { TVShow, TVShowResponse, Genre } from '@/shared/tmdb/types';
import { Provider } from '@/shared/tmdb/types';
import { getTVShows } from '@/app/actions';
import { useSettingsStore } from '@/store';

interface TVClientProps {
  initialShows: TVShow[];
  initialTotalPages: number;
  genres: Genre[];
  providers: Provider[];
  initialFilters: {
    genre?: number;
    year?: number;
    sortBy: string;
    provider?: number;
  };
  initialPage: number;
}

export function TVClient({
  initialShows,
  initialTotalPages,
  genres,
  providers,
  initialFilters,
  initialPage,
}: TVClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { viewMode, setSettings } = useSettingsStore();

  const [shows, setShows] = useState<TVShow[]>(initialShows);
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
      provider: searchParams.get('provider') ? Number(searchParams.get('provider')) : undefined,
    });
    setPage(searchParams.get('page') ? Number(searchParams.get('page')) : 1);
  }, [searchParams]);

  // Fetch data when filters or page change
  useEffect(() => {
    let cancelled = false;

    const fetchShows = async () => {
      setLoading(true);
      try {
        const response = await getTVShows(filters, page);
        if (!cancelled) {
          setShows(response.results);
          setTotalPages(Math.min(response.total_pages, 500));
        }
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchShows();

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const params = new URLSearchParams(searchParams.toString());

      const updatedFilters = { ...filters, ...newFilters };

      // Update URL params
      if (Object.prototype.hasOwnProperty.call(newFilters, 'genre')) {
        if (updatedFilters.genre) {
          params.set('genre', String(updatedFilters.genre));
        } else {
          params.delete('genre');
        }
      }

      if (Object.prototype.hasOwnProperty.call(newFilters, 'year')) {
        if (updatedFilters.year) {
          params.set('year', String(updatedFilters.year));
        } else {
          params.delete('year');
        }
      }

      if (Object.prototype.hasOwnProperty.call(newFilters, 'provider')) {
        if (updatedFilters.provider) {
          params.set('provider', String(updatedFilters.provider));
        } else {
          params.delete('provider');
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

  const handleProviderChange = (provider: string) => {
    updateFilters({ provider: provider ? Number(provider) : undefined });
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
            {currentGenreName ? `${currentGenreName} TV Shows` : 'Browse TV Shows'}
          </h1>
          <p className="mt-2 text-gray-400">
            Discover {totalPages * ITEMS_PER_PAGE}+ TV shows
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-cinematic-dark border border-cinematic-gray rounded-lg p-1">
            <button
              onClick={() => setSettings({ viewMode: 'grid' })}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-accent-amber text-cinematic-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSettings({ viewMode: 'list' })}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent-amber text-cinematic-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
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
              label="Provider"
              options={[
                { value: '', label: 'All Providers' },
                ...providers.map((p) => ({ value: String(p.id), label: p.name })),
              ]}
              value={filters.provider ? String(filters.provider) : ''}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="min-w-[160px]"
            />
          </div>
          <div className="w-full sm:w-auto">
            <Select
              label="Sort By"
              options={[
                { value: 'popularity.desc', label: 'Most Popular' },
                { value: 'vote_average.desc', label: 'Highest Rated' },
                { value: 'first_air_date.desc', label: 'Newest' },
                { value: 'popularity.asc', label: 'Least Popular' },
              ]}
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
                ...Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => {
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

        {/* TV Show Grid */}
        {loading ? (
          <MovieGridSkeleton count={ITEMS_PER_PAGE} />
        ) : shows.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {shows.map((show, index) => (
                  <motion.div
                    key={show.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TVShowCardPoster show={show} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {shows.map((show, index) => (
                  <motion.div
                    key={show.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <TVShowCardList show={show} />
                  </motion.div>
                ))}
              </div>
            )}

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
