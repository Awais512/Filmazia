'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Bookmark, Heart } from 'lucide-react';
import { TVShow } from '@/shared/tmdb/types';
import { tmdb } from '@/shared/tmdb/api';
import { useWatchlistStore, useFavoritesStore, useSettingsStore } from '@/store';
import { cn, getRatingColor } from '@/shared/utils';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/features/auth/components/auth-provider';

interface TVShowCardListProps {
  show: TVShow;
  user?: User | null;
}

export function TVShowCardList({ show, user }: TVShowCardListProps) {
  const [hydrated, setHydrated] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isInWatchlist, add: addToWatchlist, remove: removeFromWatchlist } =
    useWatchlistStore();
  const { isFavorite, add: addToFavorites, remove: removeFromFavorites } =
    useFavoritesStore();
  const { posterQuality, showRatings, showReleaseYear } = useSettingsStore();
  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const inWatchlist = hydrated && isInWatchlist(show.id);
  const isFav = hydrated && isFavorite(show.id);

  const qualityMap = {
    low: 'small' as const,
    medium: 'medium' as const,
    high: 'large' as const,
  };
  const size = qualityMap[posterQuality];

  const posterUrl = tmdb.getImageUrl(show.poster_path, 'poster', size);
  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : null;
  const currentUser = authLoading ? user ?? authUser : authUser;

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      if (authLoading) return;
      window.location.href = '/auth/sign-in';
      return;
    }
    if (inWatchlist) {
      removeFromWatchlist(show.id);
    } else {
      addToWatchlist(show, 'tv');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      if (authLoading) return;
      window.location.href = '/auth/sign-in';
      return;
    }
    if (isFav) {
      removeFromFavorites(show.id);
    } else {
      addToFavorites(show, 'tv');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link href={`/tv/${show.id}`} className="block">
        <div className="flex gap-4 bg-cinematic-dark border border-cinematic-gray rounded-xl p-4 hover:border-accent-amber/50 transition-colors">
          {/* Poster */}
          <div className="relative w-24 h-36 flex-shrink-0 overflow-hidden rounded-lg bg-cinematic-gray">
            {posterUrl && !imageError ? (
              <Image
                src={posterUrl}
                alt={show.name}
                fill
                sizes="96px"
                quality={posterQuality === 'low' ? 40 : posterQuality === 'high' ? 80 : 60}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500 text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white group-hover:text-accent-amber transition-colors line-clamp-2">
                  {show.name}
                </h3>
                {showReleaseYear && year && (
                  <p className="text-sm text-gray-500 mt-1">{year}</p>
                )}
              </div>

              {showRatings && (
                <div className="flex items-center gap-1 bg-cinematic-black/80 backdrop-blur-sm rounded-lg px-2 py-1 flex-shrink-0">
                  <Star className={cn('w-3 h-3', getRatingColor(show.vote_average))} fill="currentColor" />
                  <span className="text-xs font-medium text-white">
                    {show.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {show.overview && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                {show.overview}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleWatchlist}
                className={cn(
                  'px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors',
                  inWatchlist
                    ? 'bg-accent-amber text-cinematic-black'
                    : 'bg-cinematic-black/80 text-gray-300 hover:bg-accent-amber hover:text-cinematic-black'
                )}
              >
                <Bookmark className="w-3 h-3" fill={inWatchlist ? 'currentColor' : 'none'} />
                {inWatchlist ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleFavorite}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  isFav
                    ? 'bg-accent-amber text-cinematic-black'
                    : 'bg-cinematic-black/80 text-gray-300 hover:bg-accent-amber hover:text-cinematic-black'
                )}
              >
                <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
