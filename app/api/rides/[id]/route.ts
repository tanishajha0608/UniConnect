import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("rides")
      .select(`
        *,
        driver:user_profiles(*),
        vehicle:vehicles(*),
        university:universities(*),
        ride_requests(
          *,
          passenger:user_profiles(*)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ ride: data })
  } catch (error) {
    console.error("Error fetching ride:", error)
    return NextResponse.json({ error: "Failed to fetch ride" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { driverId, ...updates } = body

    const { data, error } = await supabase
      .from("rides")
      .update(updates)
      .eq("id", params.id)
      .eq("driver_id", driverId)
      .select(`
        *,
        driver:user_profiles(*),
        vehicle:vehicles(*),
        university:universities(*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ ride: data })
  } catch (error) {
    console.error("Error updating ride:", error)
    return NextResponse.json({ error: "Failed to update ride" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get("driver_id")

    if (!driverId) {
      return NextResponse.json({ error: "Driver ID required" }, { status: 400 })
    }

    // Update status to cancelled instead of deleting
    const { data, error } = await supabase
      .from("rides")
      .update({ status: "cancelled" })
      .eq("id", params.id)
      .eq("driver_id", driverId)
      .select()
      .single()

    if (error) throw error

    // Notify all passengers
    const { data: requests } = await supabase
      .from("ride_requests")
      .select("passenger_id")
      .eq("ride_id", params.id)
      .eq("status", "accepted")

    if (requests) {
      const notifications = requests.map((req) => ({
        user_id: req.passenger_id,
        title: "Ride Cancelled",
        message: "A ride you joined has been cancelled by the driver",
        type: "ride_cancelled",
        data: { ride_id: params.id },
      }))

      await supabase.from("notifications").insert(notifications)
    }

    return NextResponse.json({ ride: data })
  } catch (error) {
    console.error("Error cancelling ride:", error)
    return NextResponse.json({ error: "Failed to cancel ride" }, { status: 500 })
  }
}
