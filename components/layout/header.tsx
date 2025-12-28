'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Film } from 'lucide-react';
import { useUIStore } from '@/store';
import SearchBar from '@/components/search/search-bar';

export default function Header() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv', label: 'TV Shows' },
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-cinematic-black/80 backdrop-blur-md border-b border-cinematic-gray">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Film className="w-8 h-8 text-accent-amber transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl font-bold tracking-tight">
              Filmazia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-accent-amber transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-amber transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-accent-amber transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cinematic-dark border-t border-cinematic-gray"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-300 hover:text-accent-amber hover:bg-cinematic-gray rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
