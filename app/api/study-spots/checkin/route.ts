import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studySpotId, userId } = body

    // Check if user is already checked in somewhere
    const { data: existingCheckin } = await supabase
      .from("study_spot_checkins")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single()

    if (existingCheckin) {
      return NextResponse.json({ error: "You are already checked in to a study spot" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("study_spot_checkins")
      .insert({
        study_spot_id: studySpotId,
        user_id: userId,
      })
      .select(`
        *,
        study_spot:study_spots(*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ checkin: data })
  } catch (error) {
    console.error("Error checking in:", error)
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 })
  }
}
