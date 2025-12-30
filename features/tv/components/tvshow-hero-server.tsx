import { getUser } from '@/features/auth/utils/get-user'
import { TVShowDetails } from '@/shared/tmdb/types'
import TVShowHero from './tvshow-hero'

interface TVShowHeroServerProps {
  show: TVShowDetails
}

export async function TVShowHeroServer({ show }: TVShowHeroServerProps) {
  const user = await getUser()

  return <TVShowHero show={show} user={user} />
}
