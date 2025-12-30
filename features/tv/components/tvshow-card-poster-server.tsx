import { getUser } from '@/features/auth/utils/get-user'
import { TVShow } from '@/shared/tmdb/types'
import TVShowCardPoster from './tvshow-card-poster'

interface TVShowCardPosterServerProps {
  show: TVShow
  priority?: boolean
  className?: string
}

export async function TVShowCardPosterServer({ show, priority, className }: TVShowCardPosterServerProps) {
  const user = await getUser()

  return <TVShowCardPoster show={show} priority={priority} className={className} user={user} />
}
