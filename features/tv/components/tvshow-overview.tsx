'use client';

import { motion } from 'framer-motion';

interface TVShowOverviewProps {
  overview: string;
}

export default function TVShowOverview({ overview }: TVShowOverviewProps) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl"
      >
        <h2 className="font-display text-2xl font-bold text-white mb-4">Storyline</h2>
        <p className="text-gray-300 leading-relaxed text-lg">{overview}</p>
      </motion.div>
    </section>
  );
}
