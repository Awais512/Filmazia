'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Film, Bookmark, Heart, User, Search } from 'lucide-react';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/movies', icon: Film, label: 'Browse' },
  { href: '/watchlist', icon: Bookmark, label: 'Watchlist' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { setSearchOpen } = useUIStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cinematic-dark/95 backdrop-blur-lg border-t border-cinematic-gray">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors relative',
                isActive ? 'text-accent-amber' : 'text-gray-400 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-accent-amber"
                />
              )}
            </Link>
          );
        })}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-white transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">Search</span>
        </button>
      </div>
    </nav>
  );
}
