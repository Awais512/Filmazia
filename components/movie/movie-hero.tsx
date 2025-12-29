'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Heart, Star, Clock, Calendar, Check } from 'lucide-react';
import { MovieDetails } from '@/lib/tmdb-types';
import { tmdb } from '@/lib/tmdb-api';
import { useWatchlistStore, useFavoritesStore } from '@/store';
import { formatRuntime, formatDate, getYear } from '@/lib/utils';
import { Button } from '@/components/ui';
import { VideoModal } from '@/components/ui/video-modal';
import { useAuth } from '@/components/auth-provider';

interface MovieHeroProps {
  movie: MovieDetails;
}

export default function MovieHero({ movie }: MovieHeroProps) {
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const { user } = useAuth();
  const { isInWatchlist, add: addToWatchlist, remove: removeFromWatchlist } = useWatchlistStore();
  const { isFavorite, add: addToFavorites, remove: removeFromFavorites } = useFavoritesStore();

  const inWatchlist = isInWatchlist(movie.id);
  const isFav = isFavorite(movie.id);
  const backdropUrl = tmdb.getImageUrl(movie.backdrop_path, 'backdrop', 'large');

  const director = movie.credits?.crew?.find((person) => person.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 4);

  // Find trailer video
  const trailer = movie.videos?.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );

  const handleWatchlist = () => {
    if (!user) {
      window.location.href = '/auth/sign-in';
      return;
    }
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie, 'movie');
    }
  };

  const handleFavorite = () => {
    if (!user) {
      window.location.href = '/auth/sign-in';
      return;
    }
    if (isFav) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie, 'movie');
    }
  };

  return (
    <div className="relative min-h-[70vh] w-full">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cinematic-black/30 via-cinematic-black/50 to-cinematic-black" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block flex-shrink-0"
          >
            <div className="relative w-64 lg:w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl cinematic-shadow">
              {movie.poster_path && (
                <Image
                  src={tmdb.getImageUrl(movie.poster_path, 'poster', 'large')!}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="mt-4 text-lg text-gray-400 italic">"{movie.tagline}"</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-gray-300"
            >
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent-amber" fill="currentColor" />
                  <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-500">({movie.vote_count} votes)</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{getYear(movie.release_date)}</span>
              </div>
              {movie.adult && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                  18+
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 text-sm font-medium bg-cinematic-gray text-gray-300 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-white">Overview</h3>
              <p className="text-gray-300 leading-relaxed max-w-2xl">{movie.overview}</p>
            </motion.div>

            {director && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <div>
                  <p className="text-sm text-gray-500">Director</p>
                  <p className="text-white font-medium">{director.name}</p>
                </div>
              </motion.div>
            )}

            {cast && cast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-medium text-white">Top Cast</h3>
                <div className="flex flex-wrap gap-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="flex items-center gap-3">
                      {actor.profile_path ? (
                        <Image
                          src={tmdb.getImageUrl(actor.profile_path, 'profile', 'small')!}
                          alt={actor.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-cinematic-gray flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            {actor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{actor.name}</p>
                        <p className="text-xs text-gray-500">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setShowTrailerModal(true)}
                disabled={!trailer}
              >
                <Play className="w-5 h-5" />
                {trailer ? 'Watch Trailer' : 'No Trailer'}
              </Button>
              <Button
                variant={inWatchlist ? 'primary' : 'outline'}
                size="lg"
                onClick={handleWatchlist}
                className="gap-2"
              >
                {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </Button>
              <Button
                variant={isFav ? 'primary' : 'ghost'}
                size="lg"
                onClick={handleFavorite}
                className="gap-2"
              >
                <Heart className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? 'Favorited' : 'Favorite'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailer && (
        <VideoModal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          videoKey={trailer.key}
          title={movie.title}
        />
      )}
    </div>
  );
}
