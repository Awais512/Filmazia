import { getUser } from '@/features/auth/utils/get-user'
import { redirect } from 'next/navigation'
import { SignUpForm } from './sign-up-form'

export default async function SignUpPage() {
  const user = await getUser()

  if (user) {
    redirect('/')
  }

  return <SignUpForm />
}
