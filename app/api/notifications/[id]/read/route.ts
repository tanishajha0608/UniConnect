import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId } = body

    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ notification: data })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
