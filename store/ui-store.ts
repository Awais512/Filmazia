import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isRatingModalOpen: boolean;
  ratingModalMovieId: number | null;
  searchQuery: string;
  recentSearches: string[];
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setRatingModalOpen: (open: boolean, movieId?: number) => void;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isRatingModalOpen: false,
  ratingModalMovieId: null,
  searchQuery: '',
  recentSearches: [],

  setSearchOpen: (open) => set({ isSearchOpen: open }),

  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  setRatingModalOpen: (open, movieId) =>
    set({ isRatingModalOpen: open, ratingModalMovieId: movieId ?? null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  addRecentSearch: (query) =>
    set((state) => {
      const searches = state.recentSearches.filter((s) => s !== query);
      return { recentSearches: [query, ...searches].slice(0, 10) };
    }),

  clearRecentSearches: () => set({ recentSearches: [] }),
}));
