import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const universityId = searchParams.get("university_id")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const offset = (page - 1) * limit

  try {
    let query = supabase
      .from("user_profiles")
      .select(`
        *,
        university:universities(*)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    if (universityId) {
      query = query.eq("university_id", universityId)
    }

    const { data, error } = await query

    if (error) throw error

    // Get total count
    const { count } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true })
      .eq(status ? "status" : "id", status || "not-null")

    return NextResponse.json({
      users: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
