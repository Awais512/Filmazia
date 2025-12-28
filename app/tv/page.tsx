'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TVShowCardPoster } from '@/components/movie';
import { MovieGridSkeleton, Pagination, EmptyState } from '@/components/ui';
import { Select } from '@/components/ui';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { TVShow, TVShowResponse } from '@/lib/tmdb-types';
import { tmdb } from '@/lib/tmdb-api';

interface TVFilters {
  sortBy: string;
  genre?: number;
  year?: number;
  provider?: number;
}

export default function TVPage() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<TVFilters>({
    sortBy: 'popularity.desc',
  });
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [providers, setProviders] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genresRes, providersRes] = await Promise.all([
          tmdb.getTVGenres(),
          tmdb.getTVWatchProviders(),
        ]);
        setGenres(genresRes.genres);
        setProviders(providersRes.slice(0, 20)); // Limit to top 20 providers
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        let response;
        const useDiscover = filters.genre || filters.year || filters.provider || filters.sortBy !== 'popularity.desc';
        if (useDiscover) {
          response = await tmdb.discoverTVShows({
            genre: filters.genre,
            year: filters.year,
            sortBy: filters.sortBy,
            provider: filters.provider,
            page,
          });
        } else {
          response = await tmdb.getPopularTV(page);
        }
        setShows(response.results);
        setTotalPages(Math.min(response.total_pages, 500));
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [page, filters.genre, filters.year, filters.sortBy, filters.provider]);

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

  const handleProviderChange = (provider: string) => {
    setFilters((prev) => ({
      ...prev,
      provider: provider ? Number(provider) : undefined,
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
            Browse TV Shows
          </h1>
          <p className="mt-2 text-gray-400">
            Discover {totalPages * ITEMS_PER_PAGE}+ TV shows
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
