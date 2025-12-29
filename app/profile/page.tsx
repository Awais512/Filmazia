'use client';

import { motion } from 'framer-motion';
import { useWatchlistStore, useFavoritesStore, useRatingsStore } from '@/store';
import { Button } from '@/shared/ui';
import { Star, Bookmark, Heart, Download, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const { items: watchlistItems, clear: clearWatchlist } = useWatchlistStore();
  const { items: favoriteItems, clear: clearFavorites } = useFavoritesStore();
  const { getAllRatings, getAverageRating, clear: clearRatings } = useRatingsStore();

  const ratings = getAllRatings();
  const averageRating = getAverageRating();

  const stats = [
    { icon: Bookmark, label: 'Watchlist', value: Object.keys(watchlistItems).length },
    { icon: Heart, label: 'Favorites', value: Object.keys(favoriteItems).length },
    { icon: Star, label: 'Avg Rating', value: averageRating > 0 ? averageRating.toFixed(1) : 'N/A' },
    { icon: Star, label: 'Ratings', value: ratings.length },
  ];

  const handleExportData = () => {
    const data = {
      watchlist: Object.entries(watchlistItems),
      favorites: Object.entries(favoriteItems),
      ratings: ratings,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filmazia-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = (type: 'watchlist' | 'favorites' | 'ratings') => {
    if (confirm(`Are you sure you want to clear your ${type}?`)) {
      if (type === 'watchlist') clearWatchlist();
      if (type === 'favorites') clearFavorites();
      if (type === 'ratings') clearRatings();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              My Profile
            </h1>
            <p className="mt-2 text-gray-400">
              Track your movie journey
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-cinematic-gray rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="w-5 h-5 text-accent-amber" />
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Ratings */}
        {ratings.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-white">
                Recent Ratings
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClearAll('ratings')}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {ratings.slice(0, 5).map((rating, index) => (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-cinematic-gray">
                    {rating.moviePoster && (
                      <img
                        src={rating.moviePoster}
                        alt={rating.movieTitle}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="font-medium text-white line-clamp-1">{rating.movieTitle}</p>
                  <p className="text-sm text-accent-amber">{rating.rating}/10</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-white">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleClearAll('watchlist')}
              className="p-6 bg-cinematic-gray rounded-xl text-left hover:bg-cinematic-light transition-colors"
            >
              <Trash2 className="w-8 h-8 text-red-400 mb-3" />
              <h3 className="font-medium text-white mb-1">Clear Watchlist</h3>
              <p className="text-sm text-gray-400">
                Remove all movies from your watchlist
              </p>
            </button>
            <button
              onClick={() => handleClearAll('favorites')}
              className="p-6 bg-cinematic-gray rounded-xl text-left hover:bg-cinematic-light transition-colors"
            >
              <Trash2 className="w-8 h-8 text-red-400 mb-3" />
              <h3 className="font-medium text-white mb-1">Clear Favorites</h3>
              <p className="text-sm text-gray-400">
                Remove all movies from your favorites
              </p>
            </button>
            <button
              onClick={handleExportData}
              className="p-6 bg-cinematic-gray rounded-xl text-left hover:bg-cinematic-light transition-colors"
            >
              <Download className="w-8 h-8 text-accent-amber mb-3" />
              <h3 className="font-medium text-white mb-1">Export Data</h3>
              <p className="text-sm text-gray-400">
                Download your data as JSON
              </p>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="p-6 bg-cinematic-gray rounded-xl">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            About Filmazia
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Filmazia is your personal movie tracker. Browse thousands of movies,
            build your watchlist, rate films, and discover new favorites using
            data from TMDB. All data is stored locally on your device.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Not affiliated with TMDB. Data provided by The Movie Database.
          </p>
        </section>
      </motion.div>
    </div>
  );
}
