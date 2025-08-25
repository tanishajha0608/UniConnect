import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("user_id")
  const rideId = searchParams.get("ride_id")
  const conversationWith = searchParams.get("conversation_with")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  try {
    let query = supabase
      .from("messages")
      .select(`
        *,
        sender:user_profiles!messages_sender_id_fkey(*),
        recipient:user_profiles!messages_recipient_id_fkey(*),
        ride:rides(*)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: true })

    if (rideId) {
      query = query.eq("ride_id", rideId)
    }

    if (conversationWith) {
      query = query.or(`sender_id.eq.${conversationWith},recipient_id.eq.${conversationWith}`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ messages: data })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { senderId, recipientId, rideId, content } = body

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        ride_id: rideId,
        content,
      })
      .select(`
        *,
        sender:user_profiles!messages_sender_id_fkey(*),
        recipient:user_profiles!messages_recipient_id_fkey(*),
        ride:rides(*)
      `)
      .single()

    if (error) throw error

    // Create notification for recipient
    await supabase.from("notifications").insert({
      user_id: recipientId,
      title: "New Message",
      message: `You have a new message from ${data.sender?.first_name}`,
      type: "new_message",
      data: { message_id: data.id, sender_id: senderId, ride_id: rideId },
    })

    return NextResponse.json({ message: data })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
