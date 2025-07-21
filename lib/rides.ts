import { supabase } from "./supabase"

export async function createRide(rideData: {
  destination: string
  departureLocation: string
  departureDate: string
  departureTime: string
  availableSpots: number
  pricePerPerson: number
  notes?: string
  vehicleId?: string
}) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    // Get user's university
    const { data: profile } = await supabase.from("user_profiles").select("university_id").eq("id", user.id).single()

    if (!profile?.university_id) throw new Error("User university not found")

    const { data, error } = await supabase
      .from("rides")
      .insert({
        driver_id: user.id,
        university_id: profile.university_id,
        vehicle_id: rideData.vehicleId,
        destination: rideData.destination,
        departure_location: rideData.departureLocation,
        departure_date: rideData.departureDate,
        departure_time: rideData.departureTime,
        available_spots: rideData.availableSpots,
        total_spots: rideData.availableSpots,
        price_per_person: rideData.pricePerPerson,
        notes: rideData.notes,
      })
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getRides(
  universityId: string,
  filters?: {
    destination?: string
    date?: string
    availableOnly?: boolean
  },
) {
  try {
    let query = supabase
      .from("rides")
      .select(`
        *,
        driver:user_profiles(*),
        vehicle:vehicles(*),
        university:universities(*)
      `)
      .eq("university_id", universityId)
      .eq("status", "active")
      .gte("departure_date", new Date().toISOString().split("T")[0])
      .order("departure_date", { ascending: true })
      .order("departure_time", { ascending: true })

    if (filters?.destination) {
      query = query.ilike("destination", `%${filters.destination}%`)
    }

    if (filters?.date) {
      query = query.eq("departure_date", filters.date)
    }

    if (filters?.availableOnly) {
      query = query.gt("available_spots", 0)
    }

    const { data, error } = await query

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function requestRide(rideId: string, message?: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("ride_requests")
      .insert({
        ride_id: rideId,
        passenger_id: user.id,
        message,
      })
      .select()
      .single()

    if (error) throw error

    // Create notification for driver
    const { data: ride } = await supabase.from("rides").select("driver_id").eq("id", rideId).single()

    if (ride) {
      await supabase.from("notifications").insert({
        user_id: ride.driver_id,
        title: "New Ride Request",
        message: "Someone wants to join your ride",
        type: "ride_request",
        data: { ride_id: rideId, request_id: data.id },
      })
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function respondToRideRequest(requestId: string, accept: boolean) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const status = accept ? "accepted" : "rejected"

    const { data, error } = await supabase
      .from("ride_requests")
      .update({ status })
      .eq("id", requestId)
      .select(`
        *,
        ride:rides(*),
        passenger:user_profiles(*)
      `)
      .single()

    if (error) throw error

    if (accept && data.ride) {
      // Decrease available spots
      await supabase
        .from("rides")
        .update({
          available_spots: data.ride.available_spots - 1,
          status: data.ride.available_spots - 1 === 0 ? "full" : "active",
        })
        .eq("id", data.ride.id)
    }

    // Create notification for passenger
    await supabase.from("notifications").insert({
      user_id: data.passenger_id,
      title: accept ? "Ride Request Accepted!" : "Ride Request Declined",
      message: accept ? "Your ride request has been accepted" : "Your ride request was declined",
      type: accept ? "ride_accepted" : "ride_rejected",
      data: { ride_id: data.ride_id, request_id: requestId },
    })

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
