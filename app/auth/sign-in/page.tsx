import { getUser } from '@/features/auth/utils/get-user'
import { redirect } from 'next/navigation'
import { SignInForm } from './sign-in-form'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  const user = await getUser()

  if (user) {
    redirect(searchParams.redirect || '/')
  }

  return <SignInForm redirectTo={searchParams.redirect} />
}
