'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MovieDetails } from '@/shared/tmdb/types';
import { tmdb } from '@/shared/tmdb/api';

interface MovieCastProps {
  credits: MovieDetails['credits'];
}

export function MovieCast({ credits }: MovieCastProps) {
  const cast = credits?.cast?.slice(0, 6) || [];

  if (cast.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">Cast</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cast.map((actor, index) => (
          <motion.div
            key={actor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-cinematic-gray">
              {actor.profile_path ? (
                <Image
                  src={tmdb.getImageUrl(actor.profile_path, 'profile', 'medium')!}
                  alt={actor.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-gray-600">{actor.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <h3 className="font-medium text-white text-sm line-clamp-1">{actor.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
