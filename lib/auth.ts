import { supabase } from "./supabase"
import type { UserProfile } from "./supabase"
import { validateUCDomain, getUniversityFromEmail } from "./uc-email-validation"

export async function signUp(
  email: string,
  password: string,
  userData: {
    firstName: string
    lastName: string
    universityId: string
  },
) {
  try {
    // Validate UC email domain using our security system
    const emailValidation = validateUCDomain(email)
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || "Invalid email domain. UC system emails only.")
    }

    // Get university from email domain by querying the database
    const emailDomain = email.split('@')[1]
    console.log('Looking for university with email domain:', emailDomain)
    
    const { data: university, error: universityError } = await supabase
      .from('universities')
      .select('id, name, slug, email_domains')
      .contains('email_domains', [emailDomain])
      .single()

    console.log('University query result:', { university, universityError })

    let universityId: string

    if (universityError || !university) {
      // Fallback: try to find by exact domain match in the array
      const { data: fallbackUniversity, error: fallbackError } = await supabase
        .from('universities')
        .select('id, name, slug, email_domains')
        .or(`email_domains.cs.${emailDomain}`)
        .single()
      
      console.log('Fallback university query result:', { fallbackUniversity, fallbackError })
      
      if (fallbackError || !fallbackUniversity) {
        throw new Error(`Invalid email domain: ${emailDomain}. UC system emails only.`)
      }
      
      universityId = fallbackUniversity.id
      console.log('Using fallback university:', universityId)
    } else {
      universityId = university.id
      console.log('Using found university:', universityId)
    }

    console.log("First name: ", userData.firstName)
    console.log("Last name: ", userData.lastName)
    console.log("University ID: ", universityId)

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          university_id: universityId,
        },
      },
    })
    
    console.log("Auth data: ", authData)
    // if (authError) throw authError
    if (authError) {
      alert("Error creating auth user: " + authError.message)
      throw authError
    }

    // Create user profile
    if (authData.user) {
      // For now, we'll just create the auth user without additional profile data
      // The user will be created in Supabase auth.users automatically
      console.log("User created successfully:", authData.user.id)
    }

    return { data: authData, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // For now, return basic user info from auth
    const profile: UserProfile = {
      id: user.id,
      auth_user_id: user.id,
      email: user.email || '',
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      university_id: user.user_metadata?.university_id || null,
      verification_status: 'unverified',
      is_driver: false,
      driver_license_verified: false,
      rating: 0,
      total_ratings: 0,
      rides_as_driver: 0,
      rides_as_passenger: 0,
      study_hours: 0,
      last_active: new Date().toISOString(),
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return profile
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateProfile(_userId: string, updates: Partial<UserProfile>) {
  try {
    // Update user metadata in Supabase Auth
    const { data, error } = await supabase.auth.updateUser({
      data: {
        first_name: updates.first_name,
        last_name: updates.last_name,
        avatar_url: updates.avatar_url,
        ...updates
      }
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateUserEmail(newEmail: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function verifyUniversityEmail(email: string, universityId: string): Promise<boolean> {
  try {
    const { data: university } = await supabase
      .from("universities")
      .select("email_domain")
      .eq("id", universityId)
      .single()

    if (!university) return false

    const emailDomain = email.split("@")[1]
    return emailDomain === university.email_domain
  } catch (error) {
    console.error("Error verifying university email:", error)
    return false
  }
}
