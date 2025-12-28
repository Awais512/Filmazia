import { notFound } from 'next/navigation';
import { MovieHero, MovieOverview, MovieCast, MovieRecommendations, MovieInfo } from '@/components/movie';
import { tmdb } from '@/lib/tmdb-api';

export const dynamic = 'force-dynamic';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps) {
  const { id } = await params;
  try {
    const movie = await tmdb.getMovieDetails(Number(id));
    return {
      title: `${movie.title} | Filmazia`,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.poster_path
          ? [tmdb.getImageUrl(movie.poster_path, 'poster', 'large')!]
          : [],
      },
    };
  } catch {
    return {
      title: 'Movie | Filmazia',
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  try {
    const movie = await tmdb.getMovieDetails(Number(id));

    return (
      <div className="min-h-screen">
        <MovieHero movie={movie} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-16">
          <MovieOverview overview={movie.overview} />

          <MovieInfo movie={movie} />

          <MovieCast credits={movie.credits} />

          {movie.recommendations && movie.recommendations.results.length > 0 && (
            <MovieRecommendations movies={movie.recommendations.results} />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching movie:', error);
    notFound();
  }
}
