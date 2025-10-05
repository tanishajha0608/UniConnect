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
        // Temporarily disable email verification for development
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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

    // For development: Create user profile immediately without email verification
    if (authData.user) {
      try {
        console.log("Creating user profile immediately for development...")
        
        // First check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles_v2')
          .select('id')
          .eq('user_id', authData.user.id)
          .single()

        if (!existingProfile) {
          const profileResult = await createUserProfile(authData.user)
          if (profileResult.error) {
            console.error("Error creating profile:", profileResult.error)
          } else {
            console.log("User profile created successfully")
          }
        } else {
          console.log("User profile already exists, skipping creation")
        }
      } catch (error) {
        console.error("Error in immediate profile creation:", error)
      }
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

export async function clearAuthState() {
  try {
    // Clear Supabase auth state
    await supabase.auth.signOut()
    
    // Clear any cached data in localStorage/sessionStorage
    if (typeof window !== 'undefined') {
      // Clear all Supabase-related localStorage items
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      const projectId = supabaseUrl.split('//')[1]?.split('.')[0]
      
      if (projectId) {
        // Clear all possible Supabase storage keys
        Object.keys(localStorage).forEach(key => {
          if (key.includes('sb-') || key.includes('supabase') || key.includes(projectId)) {
            localStorage.removeItem(key)
          }
        })
      }
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      console.log("Auth state cleared successfully")
    }
  } catch (error) {
    console.error("Error clearing auth state:", error)
  }
}

// Development helper: Create profile for existing users without profiles
export async function createProfileForExistingUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log("No authenticated user found")
      return { success: false, error: "No authenticated user" }
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles_v2')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingProfile) {
      console.log("Profile already exists for user")
      return { success: true, message: "Profile already exists" }
    }

    // Create profile
    const result = await createUserProfile(user)
    if (result.error) {
      console.error("Error creating profile:", result.error)
      
      // If it's a duplicate key error, the profile already exists
      if (result.error.message?.includes('duplicate key')) {
        console.log("Profile already exists (duplicate key error)")
        return { success: true, message: "Profile already exists" }
      }
      
      return { success: false, error: result.error }
    }

    console.log("Profile created successfully for existing user")
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Error creating profile for existing user:", error)
    return { success: false, error }
  }
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
      
      // For development: Try to create profile if it doesn't exist
      console.log("Attempting to create missing user profile...")
      try {
        // First check if profile exists (in case of race condition)
        const { data: existingProfile } = await supabase
          .from('profiles_v2')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (existingProfile) {
          console.log("Profile found after retry")
          return existingProfile
        }

        const createResult = await createUserProfile(user)
        if (createResult.data) {
          console.log("User profile created successfully")
          return createResult.data
        }
      } catch (createError) {
        console.error("Error creating missing profile:", createError)
        // If it's a duplicate key error, try to fetch the existing profile
        if (createError.message?.includes('duplicate key')) {
          try {
            const { data: existingProfile } = await supabase
              .from('profiles_v2')
              .select('*')
              .eq('user_id', user.id)
              .single()
            if (existingProfile) {
              console.log("Found existing profile after duplicate key error")
              return existingProfile
            }
          } catch (fetchError) {
            console.error("Error fetching existing profile:", fetchError)
          }
        }
      }
      
      return null
    }

    return profile
  } catch (error) {
    console.error("Error getting current user:", error)
    // Handle Supabase restoration errors - clear all auth state
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('JWT') || 
        errorMessage.includes('token') || 
        errorMessage.includes('Refresh Token') ||
        errorMessage.includes('Invalid Refresh Token')) {
      console.log("Clearing auth state due to Supabase restoration...")
      await clearAuthState()
    }
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
