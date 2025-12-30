import { getUser } from '@/features/auth/utils/get-user'
import { Movie } from '@/shared/tmdb/types'
import MovieCardPoster from './movie-card-poster'

interface MovieCardPosterServerProps {
  movie: Movie
  priority?: boolean
  className?: string
}

export async function MovieCardPosterServer({ movie, priority, className }: MovieCardPosterServerProps) {
  const user = await getUser()

  return <MovieCardPoster movie={movie} priority={priority} className={className} user={user} />
}
