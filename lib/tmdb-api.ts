import { Movie, MovieDetails, MovieResponse, TrendingResponse, SearchResponse, SearchFilters, GenreListResponse, TVShow, TVShowDetails, TVShowResponse, WatchProvidersResponse } from './tmdb-types';
import { TMDB_IMAGE_BASE_URL, TMDB_IMAGE_SIZES } from './constants';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL || 'https://api.themoviedb.org/3';

class TMDBClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_KEY || '';
    this.baseUrl = API_URL;
  }

  async fetch<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
    const searchParams = new URLSearchParams({
      api_key: this.apiKey,
      ...Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      ),
    });

    const response = await fetch(`${this.baseUrl}${endpoint}?${searchParams}`);

    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  getImageUrl(path: string | null, type: 'poster' | 'backdrop' | 'profile' = 'poster', size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium'): string | null {
    if (!path) return null;
    const sizes = TMDB_IMAGE_SIZES[type];
    return `${TMDB_IMAGE_BASE_URL}${sizes[size as keyof typeof sizes] || sizes.medium}${path}`;
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
    const data = await this.fetch<TrendingResponse>(`/trending/movie/${timeWindow}`);
    return data.results;
  }

  async getPopular(page: number = 1): Promise<MovieResponse> {
    return this.fetch<MovieResponse>('/movie/popular', { page });
  }

  async getNowPlaying(page: number = 1): Promise<MovieResponse> {
    return this.fetch<MovieResponse>('/movie/now_playing', { page });
  }

  async getTopRated(page: number = 1): Promise<MovieResponse> {
    return this.fetch<MovieResponse>('/movie/top_rated', { page });
  }

  async getUpcoming(page: number = 1): Promise<MovieResponse> {
    return this.fetch<MovieResponse>('/movie/upcoming', { page });
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    const [movie, credits, recommendations, videos, watchProviders] = await Promise.all([
      this.fetch<MovieDetails>(`/movie/${id}`),
      this.fetch<{ cast: MovieDetails['credits']['cast']; crew: MovieDetails['credits']['crew'] }>(`/movie/${id}/credits`),
      this.fetch<MovieResponse>(`/movie/${id}/recommendations`, { page: 1 }),
      this.fetch<{ results: MovieDetails['videos']['results'] }>(`/movie/${id}/videos`),
      this.fetch<WatchProvidersResponse>(`/movie/${id}/watch/providers`).catch(() => null),
    ]);

    return {
      ...movie,
      credits,
      recommendations,
      videos,
      watch_providers: watchProviders,
    };
  }

  async getSimilarMovies(id: number, page: number = 1): Promise<MovieResponse> {
    return this.fetch<MovieResponse>(`/movie/${id}/similar`, { page });
  }

  async getMovieCredits(id: number) {
    return this.fetch<{ cast: MovieDetails['credits']['cast']; crew: MovieDetails['credits']['crew'] }>(`/movie/${id}/credits`);
  }

  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    return this.fetch<SearchResponse>('/search/movie', { query, page });
  }

  async discoverMovies(filters: SearchFilters): Promise<MovieResponse> {
    return this.fetch<MovieResponse>('/discover/movie', {
      page: filters.page || 1,
      query: filters.query,
      with_genres: filters.genre,
      primary_release_year: filters.year,
      'vote_average.gte': filters.minRating,
      'vote_average.lte': filters.maxRating,
      sort_by: filters.sortBy || 'popularity.desc',
    });
  }

  async getGenres(): Promise<GenreListResponse> {
    return this.fetch<GenreListResponse>('/genre/movie/list');
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieResponse> {
    return this.fetch<MovieResponse>('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc',
    });
  }

  async getMoviesByYear(year: number, page: number = 1): Promise<MovieResponse> {
    return this.fetch<MovieResponse>('/discover/movie', {
      primary_release_year: year,
      page,
      sort_by: 'popularity.desc',
    });
  }

  // TV Show methods
  async getTrendingTV(timeWindow: 'day' | 'week' = 'week'): Promise<TVShow[]> {
    const data = await this.fetch<{ results: TVShow[] }>(`/trending/tv/${timeWindow}`);
    return data.results;
  }

  async getPopularTV(page: number = 1): Promise<TVShowResponse> {
    return this.fetch<TVShowResponse>('/tv/popular', { page });
  }

  async getTopRatedTV(page: number = 1): Promise<TVShowResponse> {
    return this.fetch<TVShowResponse>('/tv/top_rated', { page });
  }

  async getAiringTodayTV(page: number = 1): Promise<TVShowResponse> {
    return this.fetch<TVShowResponse>('/tv/airing_today', { page });
  }

  async getOnTheAirTV(page: number = 1): Promise<TVShowResponse> {
    return this.fetch<TVShowResponse>('/tv/on_the_air', { page });
  }

  async getTVShowDetails(id: number): Promise<TVShowDetails> {
    const [show, credits, recommendations, videos, watchProviders] = await Promise.all([
      this.fetch<TVShowDetails>(`/tv/${id}`),
      this.fetch<{ cast: TVShowDetails['credits']['cast']; crew: TVShowDetails['credits']['crew'] }>(`/tv/${id}/credits`),
      this.fetch<{ page: number; results: TVShow[]; total_pages: number; total_results: number }>(`/tv/${id}/recommendations`, { page: 1 }),
      this.fetch<{ results: TVShowDetails['videos']['results'] }>(`/tv/${id}/videos`),
      this.fetch<WatchProvidersResponse>(`/tv/${id}/watch/providers`).catch(() => null),
    ]);

    return {
      ...show,
      credits,
      recommendations,
      videos,
      watch_providers: watchProviders,
    };
  }

  async searchTVShows(query: string, page: number = 1): Promise<TVShowResponse> {
    return this.fetch<TVShowResponse>('/search/tv', { query, page });
  }

  async getTVGenres(): Promise<GenreListResponse> {
    return this.fetch<GenreListResponse>('/genre/tv/list');
  }

  async getTVShowsByGenre(genreId: number, page: number = 1): Promise<TVShowResponse> {
    return this.fetch<TVShowResponse>('/discover/tv', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc',
    });
  }

  async discoverTVShows(filters: { genre?: number; year?: number; sortBy?: string; page?: number; provider?: number }): Promise<TVShowResponse> {
    const params: Record<string, string | number | undefined> = {
      page: filters.page || 1,
      with_genres: filters.genre,
      first_air_date_year: filters.year,
      sort_by: filters.sortBy || 'popularity.desc',
    };

    if (filters.provider) {
      params.with_watch_providers = filters.provider;
      params.watch_region = 'US';
    }

    return this.fetch<TVShowResponse>('/discover/tv', params);
  }

  async getTVWatchProviders(): Promise<{ id: number; name: string; logo_path: string | null }[]> {
    const data = await this.fetch<{ results: { provider_id: number; provider_name: string; logo_path: string | null }[] }>('/watch/providers/tv');
    return data.results.map((p) => ({
      id: p.provider_id,
      name: p.provider_name,
      logo_path: p.logo_path,
    }));
  }
}

export const tmdb = new TMDBClient();
export default tmdb;
