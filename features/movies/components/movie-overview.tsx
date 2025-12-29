'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface MovieOverviewProps {
  overview: string;
}

export function MovieOverview({ overview }: MovieOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;

  const shouldTruncate = overview.length > maxLength;
  const displayText = shouldTruncate && !isExpanded
    ? `${overview.slice(0, maxLength)}...`
    : overview;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-white">Overview</h2>
      <div className="relative">
        <p className="text-gray-300 leading-relaxed text-lg">{displayText}</p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-accent-amber hover:text-yellow-400 transition-colors flex items-center gap-1 text-sm"
          >
            {isExpanded ? 'Show less' : 'Read more'}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
    </section>
  );
}
