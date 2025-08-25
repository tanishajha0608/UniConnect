import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(`
        *,
        university:universities(*)
      `)
      .eq("id", userId)
      .single()

    if (error) throw error

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body

    const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", userId).select().single()

    if (error) throw error

    return NextResponse.json({ profile: data })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
