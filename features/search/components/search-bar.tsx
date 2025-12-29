'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useUIStore } from '@/store';
import { cn } from '@/shared/utils';

export default function SearchBar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, isSearchOpen, setSearchOpen, recentSearches, addRecentSearch } = useUIStore();
  const [inputValue, setInputValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      addRecentSearch(inputValue.trim());
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      setSearchOpen(false);
      setInputValue('');
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleRecentSearch = (query: string) => {
    setInputValue(query);
    setSearchQuery(query);
    addRecentSearch(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setSearchOpen(true)}
        className="p-2 text-gray-300 hover:text-accent-amber transition-colors"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto px-4 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full bg-cinematic-gray border border-cinematic-light rounded-xl px-12 py-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-amber"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </form>

              {recentSearches.length > 0 && !inputValue && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 5).map((search) => (
                      <button
                        key={search}
                        onClick={() => handleRecentSearch(search)}
                        className="px-4 py-2 bg-cinematic-gray rounded-lg text-sm text-gray-300 hover:text-white hover:bg-cinematic-light transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
