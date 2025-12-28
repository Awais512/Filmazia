'use client';

import { Star } from 'lucide-react';
import { cn, getRatingColor } from '@/lib/utils';

interface MovieRatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

export function MovieRatingBadge({ rating, size = 'md', showNumber = true, className }: MovieRatingBadgeProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className={cn('rounded-lg flex items-center justify-center', sizes[size], 'bg-cinematic-gray')}>
        <Star className={cn(iconSizes[size], getRatingColor(rating))} fill="currentColor" />
      </div>
      {showNumber && (
        <span className={cn('font-bold text-white', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
