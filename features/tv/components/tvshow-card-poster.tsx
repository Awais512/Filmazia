'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Bookmark, Heart, Plus } from 'lucide-react'
import { TVShow } from '@/shared/tmdb/types'
import { tmdb } from '@/shared/tmdb/api'
import { useWatchlistStore, useFavoritesStore } from '@/store'
import { cn, getRatingColor } from '@/shared/utils'
import { User } from '@supabase/supabase-js'
import { useAuth } from '@/features/auth/components/auth-provider'

interface TVShowCardPosterProps {
  show: TVShow
  priority?: boolean
  className?: string
  user?: User | null
}

export default function TVShowCardPoster({ show, priority = false, className, user }: TVShowCardPosterProps) {
  const [hydrated, setHydrated] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { isInWatchlist, add: addToWatchlist, remove: removeFromWatchlist } = useWatchlistStore()
  const { isFavorite, add: addToFavorites, remove: removeFromFavorites } = useFavoritesStore()
  const [showActions, setShowActions] = useState(false)
  const { user: authUser, loading: authLoading } = useAuth()

  useEffect(() => {
    setHydrated(true)
  }, [])

  const inWatchlist = hydrated && isInWatchlist(show.id)
  const isFav = hydrated && isFavorite(show.id)
  const posterUrl = tmdb.getImageUrl(show.poster_path, 'poster', 'medium')
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : ''
  const currentUser = authLoading ? user ?? authUser : authUser

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn('group relative', className)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Link href={`/tv/${show.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-cinematic-gray">
          {posterUrl && !imageError ? (
            <Image
              src={posterUrl}
              alt={show.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              quality={60}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={priority}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cinematic-gray">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-cinematic-black/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className={cn('w-3 h-3', getRatingColor(show.vote_average))} fill="currentColor" />
            <span className="text-xs font-medium text-white">{show.vote_average.toFixed(1)}</span>
          </div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : 10 }}
            className="absolute bottom-2 left-2 right-2 flex gap-2"
          >
            <button
              onClick={handleWatchlist}
              className={cn(
                'flex-1 py-2 rounded-lg flex items-center justify-center gap-1 text-xs font-medium transition-colors',
                inWatchlist
                  ? 'bg-accent-amber text-cinematic-black'
                  : 'bg-cinematic-black/80 backdrop-blur-sm text-white hover:bg-accent-amber hover:text-cinematic-black'
              )}
            >
              <Bookmark className="w-3 h-3" fill={inWatchlist ? 'currentColor' : 'none'} />
              {inWatchlist ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleFavorite}
              className={cn(
                'p-2 rounded-lg flex items-center justify-center transition-colors',
                isFav
                  ? 'bg-accent-amber text-cinematic-black'
                  : 'bg-cinematic-black/80 backdrop-blur-sm text-white hover:bg-accent-amber hover:text-cinematic-black'
              )}
            >
              <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </motion.div>
        </div>

        {/* Title and year */}
        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-white group-hover:text-accent-amber transition-colors line-clamp-1">
            {show.name}
          </h3>
          <p className="text-sm text-gray-500">{year}</p>
        </div>
      </Link>
    </motion.div>
  )
}
