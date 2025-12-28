'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import { Movie } from '@/lib/tmdb-types';
import { tmdb } from '@/lib/tmdb-api';
import { getYear } from '@/lib/utils';

export default function HeroCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trending, popular] = await Promise.all([
          tmdb.getTrending('week'),
          tmdb.getPopular(),
        ]);
        // Combine and deduplicate movies
        const combined = [...trending, ...popular.results];
        const unique = combined.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        );
        setMovies(unique.slice(0, 5));
      } catch (error) {
        console.error('Error fetching carousel movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [movies.length, nextSlide]);

  if (loading || movies.length === 0) {
    return (
      <div className="relative h-[70vh] w-full bg-cinematic-gray animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-cinematic-black via-transparent to-cinematic-black" />
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const backdropUrl = tmdb.getImageUrl(currentMovie.backdrop_path, 'backdrop', 'large');
  const posterUrl = tmdb.getImageUrl(currentMovie.poster_path, 'poster', 'medium');

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={currentMovie.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-cinematic-black via-cinematic-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-accent-amber text-cinematic-black text-sm font-bold rounded">
                  Trending
                </span>
                <div className="flex items-center gap-1 text-accent-amber">
                  <Star className="w-4 h-4" fill="currentColor" />
                  <span className="font-medium">{currentMovie.vote_average.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">{getYear(currentMovie.release_date)}</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                {currentMovie.title}
              </h1>

              <p className="text-gray-300 text-lg mb-6 line-clamp-3">
                {currentMovie.overview}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href={`/movies/${currentMovie.id}`}>
                  <button className="px-6 py-3 bg-accent-amber text-cinematic-black font-medium rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition-colors">
                    <Play className="w-5 h-5" />
                    View Details
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-cinematic-black/50 backdrop-blur-sm rounded-full text-white hover:bg-accent-amber hover:text-cinematic-black transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-cinematic-black/50 backdrop-blur-sm rounded-full text-white hover:bg-accent-amber hover:text-cinematic-black transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-accent-amber'
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
