'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Heart, Star, MoreHorizontal, Check } from 'lucide-react';
import { Movie } from '@/lib/tmdb-types';
import { useWatchlistStore, useFavoritesStore, useRatingsStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface MovieActionsMenuProps {
  movie: Movie;
  className?: string;
}

export default function MovieActionsMenu({ movie, className }: MovieActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isInWatchlist, add: addToWatchlist, remove: removeFromWatchlist } = useWatchlistStore();
  const { isFavorite, add: addToFavorites, remove: removeFromFavorites } = useFavoritesStore();
  const { getRating, addRating } = useRatingsStore();

  const inWatchlist = isInWatchlist(movie.id);
  const isFav = isFavorite(movie.id);
  const userRating = getRating(movie.id);

  const actions = [
    {
      icon: inWatchlist ? Check : Bookmark,
      label: inWatchlist ? 'In Watchlist' : 'Add to Watchlist',
      onClick: () => (inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie, 'movie')),
    },
    {
      icon: isFav ? Check : Heart,
      label: isFav ? 'In Favorites' : 'Add to Favorites',
      onClick: () => (isFav ? removeFromFavorites(movie.id) : addToFavorites(movie, 'movie')),
    },
    {
      icon: Star,
      label: userRating ? `Your Rating: ${userRating.rating}/10` : 'Rate Movie',
      onClick: () => addRating(movie, 5),
    },
  ];

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white hover:bg-cinematic-gray rounded-lg transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 z-50 bg-cinematic-dark border border-cinematic-gray rounded-xl overflow-hidden shadow-xl min-w-[180px]"
            >
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm text-gray-300 hover:text-white hover:bg-cinematic-gray transition-colors"
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
