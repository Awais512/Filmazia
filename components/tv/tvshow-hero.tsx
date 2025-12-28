'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Heart, Bookmark, ChevronDown, Star } from 'lucide-react';
import { TVShowDetails } from '@/lib/tmdb-types';
import { tmdb } from '@/lib/tmdb-api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface TVShowHeroProps {
  show: TVShowDetails;
}

export default function TVShowHero({ show }: TVShowHeroProps) {
  const [showActions, setShowActions] = useState(false);
  const backdropUrl = tmdb.getImageUrl(show.backdrop_path, 'backdrop', 'large');
  const posterUrl = tmdb.getImageUrl(show.poster_path, 'poster', 'large');

  return (
    <section className="relative min-h-[80vh] flex items-end">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backdropUrl}
            alt={show.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black via-cinematic-black/80 to-cinematic-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          {posterUrl && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block flex-shrink-0 w-64 xl:w-80"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={posterUrl}
                  alt={show.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          )}

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl xl:text-5xl font-bold text-white mb-4">
              {show.name}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
              {show.first_air_date && (
                <span>{new Date(show.first_air_date).getFullYear()}</span>
              )}
              {show.genres.length > 0 && (
                <span className="text-accent-amber">•</span>
              )}
              {show.genres.slice(0, 3).map((genre) => (
                <span key={genre.id} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
              {show.vote_average > 0 && (
                <>
                  <span className="text-accent-amber">•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent-amber fill-accent-amber" />
                    <span>{show.vote_average.toFixed(1)}</span>
                  </div>
                </>
              )}
              {show.number_of_seasons > 0 && (
                <>
                  <span className="text-accent-amber">•</span>
                  <span>{show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>

            {/* Tagline */}
            {show.tagline && (
              <p className="text-xl text-gray-400 italic mb-4">{show.tagline}</p>
            )}

            {/* Overview */}
            <div className="max-w-2xl mb-8">
              <h3 className="text-lg font-medium text-white mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{show.overview}</p>
            </div>

            {/* Actions */}
            <div
              className="relative"
              onMouseEnter={() => setShowActions(true)}
              onMouseLeave={() => setShowActions(false)}
            >
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Watch Trailer
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Add to List
                </Button>
                <Button variant="ghost" size="lg" className="gap-2">
                  <Heart className="w-5 h-5" />
                  Favorite
                </Button>
              </div>

              {/* Additional actions */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : -10 }}
                className="absolute top-full left-0 mt-2 flex gap-2"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="w-4 h-4" />
                  Watchlist
                </Button>
              </motion.div>
            </div>

            {/* Next Episode */}
            {show.next_episode_to_air && (
              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Next Episode</p>
                    <p className="font-medium text-white">
                      {show.next_episode_to_air.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      S{show.next_episode_to_air.season_number} E{show.next_episode_to_air.episode_number} • {new Date(show.next_episode_to_air.air_date).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
