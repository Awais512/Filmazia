import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data } = await supabase.auth.exchangeCodeForSession(code)

    // Create user record if it doesn't exist (for OAuth sign-ups)
    if (data.user) {
      const { id, email, user_metadata } = data.user
      const name = user_metadata?.name || user_metadata?.full_name || email?.split('@')[0] || 'User'
      const avatarUrl = user_metadata?.avatar_url || user_metadata?.picture || null

      try {
        await db
          .insert(users)
          .values({
            id,
            email: email || '',
            name,
            avatarUrl,
          })
          .onConflictDoNothing()
      } catch (error) {
        console.error('Error creating user record:', error)
        // Don't fail the auth flow if user creation fails
      }
    }
  }

  // URL to redirect to after confirmation
  return NextResponse.redirect(new URL('/', request.url))
}
