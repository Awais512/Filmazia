import { requireAuth } from '@/features/auth/utils/require-auth'
import { ProfileClient } from './profile-client'

export default async function ProfilePage() {
  const user = await requireAuth()

  return <ProfileClient />
}
