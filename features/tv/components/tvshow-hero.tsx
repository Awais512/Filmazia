'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Plus, Heart, ChevronDown, Star, Check } from 'lucide-react'
import { TVShowDetails } from '@/shared/tmdb/types'
import { tmdb } from '@/shared/tmdb/api'
import { useWatchlistStore, useFavoritesStore } from '@/store'
import { Button } from '@/shared/ui'
import { VideoModal } from '@/components/ui/video-modal'
import { User } from '@supabase/supabase-js'
import { useAuth } from '@/features/auth/components/auth-provider'

interface TVShowHeroProps {
  show: TVShowDetails
  user?: User | null
}

export default function TVShowHero({ show, user }: TVShowHeroProps) {
  const [showActions, setShowActions] = useState(false)
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const backdropUrl = tmdb.getImageUrl(show.backdrop_path, 'backdrop', 'large')
  const posterUrl = tmdb.getImageUrl(show.poster_path, 'poster', 'large')

  const { isInWatchlist, add: addToWatchlist, remove: removeFromWatchlist } = useWatchlistStore()
  const { isFavorite, add: addToFavorites, remove: removeFromFavorites } = useFavoritesStore()
  const { user: authUser, loading: authLoading } = useAuth()

  const inWatchlist = isInWatchlist(show.id)
  const isFav = isFavorite(show.id)
  const currentUser = user ?? authUser

  // Find trailer video
  const trailer = show.videos?.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  )

  const handleWatchlist = () => {
    if (!currentUser) {
      if (authLoading) return
      window.location.href = '/auth/sign-in'
      return
    }
    if (inWatchlist) {
      removeFromWatchlist(show.id)
    } else {
      addToWatchlist(show, 'tv')
    }
  }

  const handleFavorite = () => {
    if (!currentUser) {
      if (authLoading) return
      window.location.href = '/auth/sign-in'
      return
    }
    if (isFav) {
      removeFromFavorites(show.id)
    } else {
      addToFavorites(show, 'tv')
    }
  }

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
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    if (!user) {
                      window.location.href = '/auth/sign-in'
                      return
                    }
                    setShowTrailerModal(true)
                  }}
                  disabled={!trailer}
                >
                  <Play className="w-5 h-5 fill-current" />
                  {trailer ? 'Watch Trailer' : 'No Trailer'}
                </Button>
                <Button
                  variant={inWatchlist ? 'primary' : 'outline'}
                  size="lg"
                  className="gap-2"
                  onClick={handleWatchlist}
                >
                  {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
                <Button
                  variant={isFav ? 'primary' : 'ghost'}
                  size="lg"
                  className="gap-2"
                  onClick={handleFavorite}
                >
                  <Heart className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} />
                  {isFav ? 'Favorited' : 'Favorite'}
                </Button>
              </div>
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

      {/* Trailer Modal */}
      {trailer && (
        <VideoModal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          videoKey={trailer.key}
          title={show.name}
        />
      )}
    </section>
  )
}
