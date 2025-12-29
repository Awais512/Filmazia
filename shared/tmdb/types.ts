export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface MovieDetails extends Movie {
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  videos: {
    results: {
      id: string;
      iso_639_1: string;
      iso_3166_1: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      original_name: string;
      profile_path: string | null;
      character: string;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      original_name: string;
      profile_path: string | null;
      department: string;
      job: string;
    }[];
  };
  recommendations: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
  similar: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TrendingResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SearchResult {
  id: number;
  title: string;
  name?: string;
  original_title: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  media_type: 'movie' | 'tv';
  adult: boolean;
  genre_ids: number[];
  popularity: number;
  original_language: string;
}

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreListResponse {
  genres: Genre[];
}

export interface Provider {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface Person {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  popularity: number;
  known_for: Movie[];
  adult: boolean;
}

export interface UserRating {
  id: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface WatchlistItem {
  id: number;
  addedAt: string;
  watched: boolean;
  watchedAt?: string;
}

export interface FavoriteItem {
  id: number;
  addedAt: string;
  folderId?: string;
}

export interface FavoriteFolder {
  id: string;
  name: string;
  movieIds: number[];
  createdAt: string;
}

export interface SearchFilters {
  query?: string;
  genre?: number;
  year?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  page?: number;
}

// TV Show Types
export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  origin_country: string[];
}

export interface TVShowDetails extends TVShow {
  created_by: {
    id: number;
    name: string;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  homepage: string | null;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    season_number: number;
  } | null;
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  next_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    season_number: number;
  } | null;
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    id: number;
    name: string;
    overview: string;
    episode_count: number;
    season_number: number;
    poster_path: string | null;
    air_date: string;
  }[];
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  type: string;
  videos: {
    results: {
      id: string;
      iso_639_1: string;
      iso_3166_1: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      original_name: string;
      profile_path: string | null;
      character: string;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      original_name: string;
      profile_path: string | null;
      department: string;
      job: string;
    }[];
  };
  recommendations: {
    page: number;
    results: TVShow[];
    total_pages: number;
    total_results: number;
  };
}

export interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface TrendingTVResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}
