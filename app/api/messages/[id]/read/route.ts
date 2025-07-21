import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId } = body

    const { data, error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", params.id)
      .eq("recipient_id", userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message: data })
  } catch (error) {
    console.error("Error marking message as read:", error)
    return NextResponse.json({ error: "Failed to mark message as read" }, { status: 500 })
  }
}
