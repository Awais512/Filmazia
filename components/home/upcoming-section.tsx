'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MovieCardPoster } from '@/components/movie';
import { ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Movie } from '@/lib/tmdb-types';
import { tmdb } from '@/lib/tmdb-api';

export default function UpcomingSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await tmdb.getUpcoming(1);
        setMovies(response.results);
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-accent-amber" />
          <h2 className="font-display text-2xl font-bold text-white">Upcoming Movies</h2>
        </div>
        <Link
          href="/movies"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-accent-amber transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[2/3] bg-cinematic-gray rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-cinematic-gray rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-cinematic-gray rounded animate-pulse" />
                </div>
              </div>
            ))
          : movies.slice(0, 10).map((movie, index) => (
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
    </section>
  );
}
