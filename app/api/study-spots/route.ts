import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const universityId = searchParams.get("university_id")
  const type = searchParams.get("type")
  const available = searchParams.get("available") === "true"

  try {
    let query = supabase
      .from("study_spots")
      .select(`
        *,
        university:universities(*)
      `)
      .eq("is_active", true)
      .order("name")

    if (universityId) {
      query = query.eq("university_id", universityId)
    }

    if (type && type !== "all") {
      query = query.eq("type", type)
    }

    if (available) {
      query = query.lt("current_occupancy", supabase.raw("capacity"))
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ studySpots: data })
  } catch (error) {
    console.error("Error fetching study spots:", error)
    return NextResponse.json({ error: "Failed to fetch study spots" }, { status: 500 })
  }
}
