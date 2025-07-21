import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { checkinId, userId } = body

    const { data, error } = await supabase
      .from("study_spot_checkins")
      .update({
        is_active: false,
        checked_out_at: new Date().toISOString(),
      })
      .eq("id", checkinId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ checkin: data })
  } catch (error) {
    console.error("Error checking out:", error)
    return NextResponse.json({ error: "Failed to check out" }, { status: 500 })
  }
}
