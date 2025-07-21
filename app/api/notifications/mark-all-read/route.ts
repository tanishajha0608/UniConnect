import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body

    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false)
      .select()

    if (error) throw error

    return NextResponse.json({ notifications: data })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json({ error: "Failed to mark all notifications as read" }, { status: 500 })
  }
}
