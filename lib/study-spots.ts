import { supabase } from "./supabase"
import type { StudySpotCheckin } from "./supabase"

export async function getStudySpots(
  universityId: string,
  filters?: {
    type?: string
    available?: boolean
    amenities?: string[]
  },
) {
  try {
    let query = supabase
      .from("study_spots")
      .select(`
        *,
        university:universities(*)
      `)
      .eq("university_id", universityId)
      .eq("is_active", true)
      .order("name")

    if (filters?.type && filters.type !== "all") {
      query = query.eq("type", filters.type)
    }

    if (filters?.available) {
      query = query.lt("current_occupancy", supabase.raw("capacity"))
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      query = query.overlaps("amenities", filters.amenities)
    }

    const { data, error } = await query

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function checkInToStudySpot(studySpotId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    // Check if user is already checked in somewhere
    const { data: existingCheckin } = await supabase
      .from("study_spot_checkins")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (existingCheckin) {
      throw new Error("You are already checked in to a study spot")
    }

    const { data, error } = await supabase
      .from("study_spot_checkins")
      .insert({
        study_spot_id: studySpotId,
        user_id: user.id,
      })
      .select(`
        *,
        study_spot:study_spots(*)
      `)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function checkOutFromStudySpot(checkinId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("study_spot_checkins")
      .update({
        is_active: false,
        checked_out_at: new Date().toISOString(),
      })
      .eq("id", checkinId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getCurrentCheckin(): Promise<StudySpotCheckin | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from("study_spot_checkins")
      .select(`
        *,
        study_spot:study_spots(*)
      `)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    return data
  } catch (error) {
    return null
  }
}
