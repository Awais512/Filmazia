'use server';

import { createClient } from '@/features/auth/utils/supabase-server';
import { redirect } from 'next/navigation';

export async function googleSignInAction() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    redirect('/auth/sign-in?error=google_sign_in_failed');
  }

  // Redirect to Google's OAuth page
  if (data?.url) {
    redirect(data.url);
  }
}
