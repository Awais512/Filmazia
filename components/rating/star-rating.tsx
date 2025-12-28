'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, onChange, max = 10, size = 'md' }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              sizes[size],
              'transition-colors',
              (hovered || rating) >= star
                ? 'text-accent-amber fill-accent-amber'
                : 'text-gray-500'
            )}
          />
        </motion.button>
      ))}
    </div>
  );
}
