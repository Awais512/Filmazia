import Link from 'next/link'
import { getUser } from '@/features/auth/utils/get-user'
import { HeaderClient } from './header-client'

export async function Header() {
  const user = await getUser()

  return <HeaderClient user={user} />
}
