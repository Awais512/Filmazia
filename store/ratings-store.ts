import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserRating, Movie } from '@/lib/tmdb-types';
import { generateId } from '@/lib/utils';

interface RatingsState {
  ratings: Record<string, UserRating>;
  addRating: (movie: Movie, rating: number, review?: string) => void;
  updateRating: (ratingId: string, rating: number, review?: string) => void;
  removeRating: (ratingId: string) => void;
  getRating: (movieId: number) => UserRating | undefined;
  getAllRatings: () => UserRating[];
  getAverageRating: () => number;
  getHighestRated: () => UserRating[];
  getLowestRated: () => UserRating[];
  clear: () => void;
}

export const useRatingsStore = create<RatingsState>()(
  persist(
    (set, get) => ({
      ratings: {},

      addRating: (movie, rating, review) => {
        const id = generateId();
        set((state) => ({
          ratings: {
            ...state.ratings,
            [id]: {
              id,
              movieId: movie.id,
              movieTitle: movie.title,
              moviePoster: movie.poster_path,
              rating,
              review,
              createdAt: new Date().toISOString(),
            },
          },
        }));
      },

      updateRating: (ratingId, rating, review) => {
        set((state) => ({
          ratings: {
            ...state.ratings,
            [ratingId]: { ...state.ratings[ratingId], rating, review },
          },
        }));
      },

      removeRating: (ratingId) => {
        set((state) => {
          const { [ratingId]: removed, ...rest } = state.ratings;
          return { ratings: rest };
        });
      },

      getRating: (movieId) => Object.values(get().ratings).find((r) => r.movieId === movieId),

      getAllRatings: () =>
        Object.values(get().ratings).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),

      getAverageRating: () => {
        const ratings = Object.values(get().ratings);
        if (ratings.length === 0) return 0;
        return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      },

      getHighestRated: () =>
        Object.values(get().ratings)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10),

      getLowestRated: () =>
        Object.values(get().ratings)
          .sort((a, b) => a.rating - b.rating)
          .slice(0, 10),

      clear: () => {
        set({ ratings: {} });
      },
    }),
    {
      name: 'filmazia-ratings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
