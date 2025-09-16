import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const universityId = searchParams.get("university_id")

  try {
    // Get basic stats
    const [
      { count: totalUsers },
      { count: activeRides },
      { count: totalRides },
      { count: studySpots },
      { count: activeCheckins },
    ] = await Promise.all([
      supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq(universityId ? "university_id" : "id", universityId || "not-null"),
      supabase
        .from("rides")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .eq(universityId ? "university_id" : "id", universityId || "not-null"),
      supabase
        .from("rides")
        .select("*", { count: "exact", head: true })
        .eq(universityId ? "university_id" : "id", universityId || "not-null"),
      supabase
        .from("study_spots")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
        .eq(universityId ? "university_id" : "id", universityId || "not-null"),
      supabase.from("study_spot_checkins").select("*", { count: "exact", head: true }).eq("is_active", true),
    ])

    // Get recent activity
    const { data: recentRides } = await supabase
      .from("rides")
      .select(`
        id,
        destination,
        departure_date,
        created_at,
        driver:user_profiles(first_name, last_name)
      `)
      .eq(universityId ? "university_id" : "id", universityId || "not-null")
      .order("created_at", { ascending: false })
      .limit(5)

    const { data: recentCheckins } = await supabase
      .from("study_spot_checkins")
      .select(`
        id,
        checked_in_at,
        study_spot:study_spots(name),
        user:user_profiles(first_name, last_name)
      `)
      .eq("is_active", true)
      .order("checked_in_at", { ascending: false })
      .limit(5)

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeRides: activeRides || 0,
        totalRides: totalRides || 0,
        studySpots: studySpots || 0,
        activeCheckins: activeCheckins || 0,
      },
      recentActivity: {
        rides: recentRides || [],
        checkins: recentCheckins || [],
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
