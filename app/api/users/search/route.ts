import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const universityId = searchParams.get("university_id")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 })
  }

  try {
    let dbQuery = supabase
      .from("user_profiles")
      .select(`
        id,
        first_name,
        last_name,
        avatar_url,
        major,
        graduation_year,
        rating,
        total_ratings,
        university:universities(name, slug)
      `)
      .eq("status", "verified")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,major.ilike.%${query}%`)
      .limit(limit)

    if (universityId) {
      dbQuery = dbQuery.eq("university_id", universityId)
    }

    const { data, error } = await dbQuery

    if (error) throw error

    return NextResponse.json({ users: data })
  } catch (error) {
    console.error("Error searching users:", error)
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 })
  }
}
