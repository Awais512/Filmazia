import { MoviesClient } from '@/components/pages/movies-client';
import { getMovies, getMovieGenres } from '../actions';

interface MoviesPageProps {
  searchParams: {
    genre?: string;
    year?: string;
    sort?: string;
    page?: string;
  };
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  // Parse search params
  const page = Number(searchParams.page) || 1;
  const filters = {
    genre: searchParams.genre ? Number(searchParams.genre) : undefined,
    year: searchParams.year ? Number(searchParams.year) : undefined,
    sortBy: searchParams.sort || 'popularity.desc',
  };

  // Fetch data on server
  const [moviesResponse, genres] = await Promise.all([
    getMovies(filters, page),
    getMovieGenres(),
  ]);

  return (
    <MoviesClient
      initialMovies={moviesResponse.results}
      initialTotalPages={Math.min(moviesResponse.total_pages, 500)}
      genres={genres}
      initialFilters={filters}
      initialPage={page}
    />
  );
}
