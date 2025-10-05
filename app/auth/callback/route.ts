import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createUserProfile } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
      }

      if (data.user) {
        // Check if user profile exists, if not create it
        const { data: existingProfile } = await supabase
          .from('profiles_v2')
          .select('id')
          .eq('user_id', data.user.id)
          .single()

        if (!existingProfile) {
          // Create user profile from auth metadata
          await createUserProfile(data.user)
        }

        // Get user's university slug to redirect to correct dashboard
        const { data: profile } = await supabase
          .from('profiles_v2')
          .select('university_slug')
          .eq('user_id', data.user.id)
          .single()

        if (profile?.university_slug) {
          return NextResponse.redirect(`${origin}/${profile.university_slug}/dashboard`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
    }
  }

  // If no code, redirect to login
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}