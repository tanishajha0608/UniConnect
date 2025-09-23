import { supabase } from "./supabase"
import type { User } from "./supabase"
import { validateUCDomain } from "./uc-email-validation"



export async function signUp(
  email: string,
  password: string,
  userData: {
    firstName: string
    lastName: string
    phone?: string
    graduationYear?: string
    major?: string
  },
) {
  try {
    // Validate UC email domain
    const emailValidation = validateUCDomain(email)
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || "Invalid email domain. UC system emails only.")
    }

    // Get university from email domain
    const emailDomain = email.split('@')[1]
    const { data: universities, error: universityError } = await supabase
      .from('universities')
      .select('id, name, slug, email_domains')

    if (universityError || !universities) {
      throw new Error(`Database error looking up universities: ${universityError?.message}`)
    }

    // Find university that contains the email domain
    const university = universities.find(uni => {
      if (uni.email_domains && Array.isArray(uni.email_domains)) {
        return uni.email_domains.includes(emailDomain)
      }
      return false
    })

    if (!university) {
      throw new Error(`Invalid email domain: ${emailDomain}. UC system emails only.`)
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          graduation_year: userData.graduationYear ? parseInt(userData.graduationYear) : null,
          major: userData.major,
          university_id: university.id,
          university_slug: university.slug,
        }
      }
    })

    if (authError) {
      throw authError
    }

    return { data: authData, error: null }
  } catch (error) {
    console.error("Signup error:", error)
    return { data: null, error }
  }
}

export async function createUserProfile(user: any) {
  try {
    // Extract user data from auth metadata
    const userData = user.user_metadata || {}

    console.log("Creating profile for verified user:", user.id)
    console.log("User metadata:", userData)

    if (!userData.university_id || !userData.university_slug) {
      console.error("No university data found in user metadata")
      throw new Error("University information not found. Please sign up again.")
    }

    // Create user profile in the profiles_v2 table
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles_v2')
      .insert({
        user_id: user.id,
        email: user.email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || null,
        graduation_year: userData.graduation_year || null,
        major: userData.major || null,
        university_id: userData.university_id,
        university_slug: userData.university_slug,
        avatar_url: userData.avatar_url || null,
      })
      .select()
      .single()

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      throw new Error("Failed to create user profile: " + profileError.message)
    }

    console.log("User profile created successfully:", userProfile)
    return { data: userProfile, error: null }
  } catch (error) {
    console.error("Error in createUserProfile:", error)
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

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get user profile from profiles_v2 table
    const { data: profile, error } = await supabase
      .from('profiles_v2')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error || !profile) {
      console.error("Error getting user profile:", error)
      return null
    }

    return profile
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  try {
    // Update user profile in profiles_v2 table
    const { data, error } = await supabase
      .from('profiles_v2')
      .update({
        first_name: updates.first_name,
        last_name: updates.last_name,
        phone: updates.phone,
        graduation_year: updates.graduation_year,
        major: updates.major,
        avatar_url: updates.avatar_url,
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    // Also update auth metadata
    await supabase.auth.updateUser({
      data: {
        first_name: updates.first_name,
        last_name: updates.last_name,
        phone: updates.phone,
        graduation_year: updates.graduation_year,
        major: updates.major,
        avatar_url: updates.avatar_url,
      }
    })

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
