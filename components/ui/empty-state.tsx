'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Film, Heart, Bookmark, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'watchlist' | 'favorites' | 'search' | 'ratings';
  action?: {
    label: string;
    href: string;
  };
  customActions?: React.ReactNode;
  className?: string;
}

const content = {
  watchlist: {
    icon: Bookmark,
    title: 'Your watchlist is empty',
    description: 'Start adding movies and TV shows you want to watch later.',
  },
  favorites: {
    icon: Heart,
    title: 'No favorites yet',
    description: 'Mark movies and TV shows as favorites to build your collection.',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
  ratings: {
    icon: Film,
    title: 'No ratings yet',
    description: 'Rate movies to see your taste profile.',
  },
};

export function EmptyState({ type, action, customActions, className }: EmptyStateProps) {
  const { icon: Icon, title, description } = content[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-cinematic-gray flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-accent-amber" />
      </div>
      <h2 className="text-xl font-medium text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-md">{description}</p>
      <div className="button-container flex gap-3">
        {customActions ? (
          customActions
        ) : action ? (
          <Link href={action.href}>
            <Button>{action.label}</Button>
          </Link>
        ) : null}
      </div>
    </motion.div>
  );
}
