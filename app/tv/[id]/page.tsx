import { notFound } from 'next/navigation';
import { TVShowHero, TVShowOverview, TVShowCast, TVShowRecommendations, TVShowInfo } from '@/features/tv';
import { tmdb } from '@/shared/tmdb/api';

export const dynamic = 'force-dynamic';

interface TVShowPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TVShowPageProps) {
  const { id } = await params;
  try {
    const show = await tmdb.getTVShowDetails(Number(id));
    return {
      title: `${show.name} | Filmazia`,
      description: show.overview,
      openGraph: {
        title: show.name,
        description: show.overview,
        images: show.poster_path
          ? [tmdb.getImageUrl(show.poster_path, 'poster', 'large')!]
          : [],
      },
    };
  } catch {
    return {
      title: 'TV Show | Filmazia',
    };
  }
}

export default async function TVShowPage({ params }: TVShowPageProps) {
  const { id } = await params;

  try {
    const show = await tmdb.getTVShowDetails(Number(id));

    return (
      <div className="min-h-screen">
        <TVShowHero show={show} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-16">
          <TVShowOverview overview={show.overview} />

          <TVShowInfo show={show} />

          <TVShowCast credits={show.credits} />

          {show.recommendations && show.recommendations.results.length > 0 && (
            <TVShowRecommendations shows={show.recommendations.results} />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching TV show:', error);
    notFound();
  }
}
