'use server';

import { tmdb } from '@/lib/tmdb-api';
import { Movie, TVShow, MovieResponse, TVShowResponse, Genre } from '@/lib/tmdb-types';

// Types for filters
export interface MovieFilters {
  genre?: number;
  year?: number;
  sortBy?: string;
  provider?: number;
  page?: number;
}

export interface TVFilters {
  genre?: number;
  year?: number;
  sortBy?: string;
  provider?: number;
  page?: number;
}

// Movies Actions
export async function getMovies(filters: MovieFilters = {}, page: number = 1): Promise<MovieResponse> {
  return tmdb.discoverMovies({ ...filters, page });
}

export async function getMovieDetails(id: number): Promise<Movie> {
  return tmdb.getMovieDetails(id);
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
  return tmdb.getTrending(timeWindow);
}

export async function getPopularMovies(page: number = 1): Promise<MovieResponse> {
  return tmdb.getPopular(page);
}

export async function getUpcomingMovies(): Promise<MovieResponse> {
  return tmdb.getUpcoming();
}

export async function getNowPlayingMovies(): Promise<MovieResponse> {
  return tmdb.getNowPlaying();
}

export async function getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
  return tmdb.getTopRated(page);
}

export async function getMovieGenres(): Promise<Genre[]> {
  const response = await tmdb.getGenres();
  return response.genres;
}

export async function getMovieProviders(): Promise<{ id: number; name: string; logo_path: string | null }[]> {
  const data = await tmdb.fetch<{ results: { provider_id: number; provider_name: string; logo_path: string | null }[] }>('/watch/providers/movie');
  return data.results.map((p) => ({
    id: p.provider_id,
    name: p.provider_name,
    logo_path: p.logo_path,
  }));
}

export async function getMoviesByIds(ids: number[]): Promise<Movie[]> {
  if (ids.length === 0) return [];
  const movies: Movie[] = [];
  for (const id of ids) {
    try {
      const movie = await tmdb.getMovieDetails(id);
      movies.push(movie);
    } catch {
      // Skip failed fetches
    }
  }
  return movies;
}

// TV Shows Actions
export async function getTVShows(filters: TVFilters = {}, page: number = 1): Promise<TVShowResponse> {
  return tmdb.discoverTVShows({ ...filters, page });
}

export async function getTVShowDetails(id: number): Promise<TVShow> {
  return tmdb.getTVShowDetails(id);
}

export async function getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<TVShow[]> {
  return tmdb.getTrendingTV(timeWindow);
}

export async function getPopularTVShows(page: number = 1): Promise<TVShowResponse> {
  return tmdb.getPopularTV(page);
}

export async function getOnTheAirTVShows(): Promise<TVShowResponse> {
  return tmdb.getOnTheAirTV();
}

export async function getAiringTodayTVShows(): Promise<TVShowResponse> {
  return tmdb.getAiringTodayTV();
}

export async function getTopRatedTVShows(page: number = 1): Promise<TVShowResponse> {
  return tmdb.getTopRatedTV(page);
}

export async function getTVGenres(): Promise<Genre[]> {
  const response = await tmdb.getTVGenres();
  return response.genres;
}

export async function getTVProviders(): Promise<{ id: number; name: string; logo_path: string | null }[]> {
  return tmdb.getTVWatchProviders();
}

export async function getTVShowsByIds(ids: number[]): Promise<TVShow[]> {
  if (ids.length === 0) return [];
  const shows: TVShow[] = [];
  for (const id of ids) {
    try {
      const show = await tmdb.getTVShowDetails(id);
      shows.push(show);
    } catch {
      // Skip failed fetches
    }
  }
  return shows;
}

// Search Actions
export async function searchContent(query: string, page: number = 1): Promise<{
  movies: MovieResponse;
  tvShows: TVShowResponse;
}> {
  const [moviesSearch, tvShows] = await Promise.all([
    tmdb.searchMovies(query, page),
    tmdb.searchTVShows(query, page),
  ]);
  // Convert SearchResponse to MovieResponse format
  const movies: MovieResponse = {
    page: moviesSearch.page,
    results: moviesSearch.results.map((r) => ({
      ...r,
      video: false,
      original_language: r.original_language || 'en',
      adult: r.adult || false,
      vote_count: r.vote_count || 0,
      genre_ids: r.genre_ids || [],
      popularity: r.popularity || 0,
    })),
    total_pages: moviesSearch.total_pages,
    total_results: moviesSearch.total_results,
  };
  return { movies, tvShows };
}

// Combined actions for watchlist/favorites
export async function getWatchlistContent(ids: { id: number; type: 'movie' | 'tv' }[]): Promise<{
  movies: Movie[];
  tvShows: TVShow[];
}> {
  const movieIds = ids.filter((item) => item.type === 'movie').map((item) => item.id);
  const tvIds = ids.filter((item) => item.type === 'tv').map((item) => item.id);

  const [movies, tvShows] = await Promise.all([
    getMoviesByIds(movieIds),
    getTVShowsByIds(tvIds),
  ]);

  return { movies, tvShows };
}

export async function getFavoritesContent(ids: { id: number; type: 'movie' | 'tv'; folderId?: string }[]): Promise<{
  movies: Movie[];
  tvShows: TVShow[];
  byFolder: Record<string, { movies: Movie[]; tvShows: TVShow[] }>;
}> {
  const byFolder: Record<string, { movies: Movie[]; tvShows: TVShow[] }> = {};

  // Group by folder
  const folderItems: Record<string, { movieIds: number[]; tvIds: number[] }> = {};
  for (const item of ids) {
    const folderKey = item.folderId || 'default';
    if (!folderItems[folderKey]) {
      folderItems[folderKey] = { movieIds: [], tvIds: [] };
    }
    if (item.type === 'movie') {
      folderItems[folderKey].movieIds.push(item.id);
    } else {
      folderItems[folderKey].tvIds.push(item.id);
    }
  }

  // Fetch for each folder
  const results = await Promise.all(
    Object.entries(folderItems).map(async ([folderId, { movieIds, tvIds }]) => {
      const [movies, tvShows] = await Promise.all([
        getMoviesByIds(movieIds),
        getTVShowsByIds(tvIds),
      ]);
      return { folderId, movies, tvShows };
    })
  );

  for (const result of results) {
    byFolder[result.folderId] = {
      movies: result.movies,
      tvShows: result.tvShows,
    };
  }

  // Also return flat lists
  const allMovieIds = ids.filter((item) => item.type === 'movie').map((item) => item.id);
  const allTvIds = ids.filter((item) => item.type === 'tv').map((item) => item.id);

  const [movies, tvShows] = await Promise.all([
    getMoviesByIds(allMovieIds),
    getTVShowsByIds(allTvIds),
  ]);

  return { movies, tvShows, byFolder };
}
