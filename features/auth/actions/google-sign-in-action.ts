'use server';

import { createClient } from '@/features/auth/utils/supabase-server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function googleSignInAction() {
  const supabase = await createClient();

  // Get the origin from headers to ensure correct redirect URL
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const appUrl = `${protocol}://${host}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appUrl}/auth/callback`,
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
