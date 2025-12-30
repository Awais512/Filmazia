import { requireAuth } from '@/features/auth/utils/require-auth'
import { WatchlistClient } from '@/features/watchlist'

export default async function WatchlistPage() {
  await requireAuth()

  return <WatchlistClient />
}
