import { requireAuth } from '@/features/auth/utils/require-auth'
import { FavoritesClient } from '@/features/favorites'

export default async function FavoritesPage() {
  await requireAuth()

  return <FavoritesClient />
}
