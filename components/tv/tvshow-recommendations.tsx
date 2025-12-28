'use client';

import { motion } from 'framer-motion';
import { TVShowCardPoster } from '@/components/movie';
import { TVShow } from '@/lib/tmdb-types';
import { ChevronRight } from 'lucide-react';

interface TVShowRecommendationsProps {
  shows: TVShow[];
}

export default function TVShowRecommendations({ shows }: TVShowRecommendationsProps) {
  const recommendations = shows.slice(0, 10);

  if (recommendations.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-white">
          More Like This
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {recommendations.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <TVShowCardPoster show={show} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
