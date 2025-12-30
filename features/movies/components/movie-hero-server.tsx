import { getUser } from '@/features/auth/utils/get-user'
import { MovieDetails } from '@/shared/tmdb/types'
import MovieHero from './movie-hero'

interface MovieHeroServerProps {
  movie: MovieDetails
}

export async function MovieHeroServer({ movie }: MovieHeroServerProps) {
  const user = await getUser()

  return <MovieHero movie={movie} user={user} />
}
