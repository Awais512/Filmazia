import { TVClient } from '@/components/pages/tv-client';
import { getTVShows, getTVGenres, getTVProviders } from '../actions';

interface TVPageProps {
  searchParams: {
    genre?: string;
    year?: string;
    sort?: string;
    provider?: string;
    page?: string;
  };
}

export default async function TVPage({ searchParams }: TVPageProps) {
  // Parse search params
  const page = Number(searchParams.page) || 1;
  const filters = {
    genre: searchParams.genre ? Number(searchParams.genre) : undefined,
    year: searchParams.year ? Number(searchParams.year) : undefined,
    sortBy: searchParams.sort || 'popularity.desc',
    provider: searchParams.provider ? Number(searchParams.provider) : undefined,
  };

  // Fetch data on server
  const [showsResponse, genres, providers] = await Promise.all([
    getTVShows(filters, page),
    getTVGenres(),
    getTVProviders(),
  ]);

  return (
    <TVClient
      initialShows={showsResponse.results}
      initialTotalPages={Math.min(showsResponse.total_pages, 500)}
      genres={genres}
      providers={providers.slice(0, 20)}
      initialFilters={filters}
      initialPage={page}
    />
  );
}
