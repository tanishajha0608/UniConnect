import { supabase } from "./supabase"
import type { UserProfile } from "./supabase"

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
    // Check if email domain matches university
    const { data: university } = await supabase
      .from("universities")
      .select("email_domain")
      .eq("id", userData.universityId)
      .single()

    if (!university) {
      throw new Error("University not found")
    }

    const emailDomain = email.split("@")[1]
    if (emailDomain !== university.email_domain) {
      throw new Error(`Please use your university email address (@${university.email_domain})`)
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          university_id: userData.universityId,
        },
      },
    })

    if (authError) throw authError

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: authData.user.id,
        email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        university_id: userData.universityId,
        status: "pending", // Will be verified after email confirmation
      })

      if (profileError) throw profileError
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

    const { data: profile } = await supabase
      .from("user_profiles")
      .select(`
        *,
        university:universities(*)
      `)
      .eq("id", user.id)
      .single()

    return profile
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", userId).select().single()

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
