'use client';

import { motion } from 'framer-motion';
import { Movie } from '@/lib/tmdb-types';
import MovieCardPoster from './movie-card-poster';

interface MovieRecommendationsProps {
  movies: Movie[];
}

export function MovieRecommendations({ movies }: MovieRecommendationsProps) {
  if (movies.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.slice(0, 10).map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MovieCardPoster movie={movie} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
