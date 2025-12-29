'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Film, User, LogOut, Settings } from 'lucide-react';
import { useUIStore } from '@/store';
import { useAuth } from '@/features/auth';
import { SearchBar } from '@/features/search';

export default function Header() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const publicNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv', label: 'TV Shows' },
  ];

  const protectedNavLinks = [
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/favorites', label: 'Favorites' },
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
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-accent-amber transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-amber transition-all group-hover:w-full" />
              </Link>
            ))}
            {user && protectedNavLinks.map((link) => (
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

          {/* Search & Auth */}
          <div className="flex items-center gap-4">
            <SearchBar />

            {user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-gray-300 hover:text-accent-amber transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-cinematic-gray flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-cinematic-dark border border-cinematic-gray rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-cinematic-gray">
                        <p className="text-sm text-white font-medium truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-accent-amber hover:bg-cinematic-gray transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-accent-amber hover:bg-cinematic-gray transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut();
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-cinematic-gray transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Sign In Button */
              <Link
                href="/auth/sign-in"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent-amber hover:bg-accent-amber/80 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}

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
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-300 hover:text-accent-amber hover:bg-cinematic-gray rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user && protectedNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-300 hover:text-accent-amber hover:bg-cinematic-gray rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/auth/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-center text-white bg-accent-amber hover:bg-accent-amber/80 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
