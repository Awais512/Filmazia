import { SearchClient } from '@/components/pages/search-client';
import { searchContent } from '../actions';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  // Only fetch on server if query exists in URL (shared link)
  const initialResults = query
    ? await searchContent(query).catch(() => null)
    : null;

  return <SearchClient initialQuery={query} initialResults={initialResults || undefined} />;
}
