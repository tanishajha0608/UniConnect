import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, reason } = body

    const validStatuses = ["pending", "verified", "suspended", "banned"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({ status })
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    // Create notification for user
    const title = "Account Status Updated"
    let message = `Your account status has been changed to ${status}`

    if (status === "suspended") {
      message = reason ? `Your account has been suspended. Reason: ${reason}` : "Your account has been suspended"
    } else if (status === "banned") {
      message = reason ? `Your account has been banned. Reason: ${reason}` : "Your account has been banned"
    } else if (status === "verified") {
      message = "Your account has been verified! You can now use all features."
    }

    await supabase.from("notifications").insert({
      user_id: params.id,
      title,
      message,
      type: "account_status_change",
      data: { status, reason },
    })

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
