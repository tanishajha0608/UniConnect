import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { passengerId, message } = body

    const { data, error } = await supabase
      .from("ride_requests")
      .insert({
        ride_id: params.id,
        passenger_id: passengerId,
        message,
      })
      .select()
      .single()

    if (error) throw error

    // Create notification for driver
    const { data: ride } = await supabase.from("rides").select("driver_id").eq("id", params.id).single()

    if (ride) {
      await supabase.from("notifications").insert({
        user_id: ride.driver_id,
        title: "New Ride Request",
        message: "Someone wants to join your ride",
        type: "ride_request",
        data: { ride_id: params.id, request_id: data.id },
      })
    }

    return NextResponse.json({ request: data })
  } catch (error) {
    console.error("Error creating ride request:", error)
    return NextResponse.json({ error: "Failed to create ride request" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { requestId, status } = body

    const { data, error } = await supabase
      .from("ride_requests")
      .update({ status })
      .eq("id", requestId)
      .eq("ride_id", params.id)
      .select(`
        *,
        ride:rides(*),
        passenger:user_profiles(*)
      `)
      .single()

    if (error) throw error

    if (status === "accepted" && data.ride) {
      // Decrease available spots
      await supabase
        .from("rides")
        .update({
          available_spots: data.ride.available_spots - 1,
          status: data.ride.available_spots - 1 === 0 ? "full" : "active",
        })
        .eq("id", params.id)
    }

    // Create notification for passenger
    await supabase.from("notifications").insert({
      user_id: data.passenger_id,
      title: status === "accepted" ? "Ride Request Accepted!" : "Ride Request Declined",
      message: status === "accepted" ? "Your ride request has been accepted" : "Your ride request was declined",
      type: status === "accepted" ? "ride_accepted" : "ride_rejected",
      data: { ride_id: params.id, request_id: requestId },
    })

    return NextResponse.json({ request: data })
  } catch (error) {
    console.error("Error updating ride request:", error)
    return NextResponse.json({ error: "Failed to update ride request" }, { status: 500 })
  }
}
