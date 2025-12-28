'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TVShowDetails } from '@/lib/tmdb-types';
import { tmdb } from '@/lib/tmdb-api';

interface TVShowCastProps {
  credits: TVShowDetails['credits'];
}

export default function TVShowCast({ credits }: TVShowCastProps) {
  const cast = credits.cast.slice(0, 12);

  if (cast.length === 0) return null;

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-2xl font-bold text-white mb-6"
      >
        Top Cast
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cast.map((person, index) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-cinematic-gray">
              {person.profile_path ? (
                <Image
                  src={tmdb.getImageUrl(person.profile_path, 'poster', 'medium') || ''}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-gray-600">👤</span>
                </div>
              )}
            </div>
            <p className="font-medium text-white text-sm line-clamp-1">{person.name}</p>
            <p className="text-xs text-gray-400 line-clamp-1">{person.character}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
