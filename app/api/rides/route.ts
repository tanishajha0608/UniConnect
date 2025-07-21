import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const universityId = searchParams.get("university_id")
  const destination = searchParams.get("destination")
  const date = searchParams.get("date")
  const availableOnly = searchParams.get("available_only") === "true"

  try {
    let query = supabase
      .from("rides")
      .select(`
        *,
        driver:user_profiles(*),
        vehicle:vehicles(*),
        university:universities(*)
      `)
      .eq("status", "active")
      .gte("departure_date", new Date().toISOString().split("T")[0])
      .order("departure_date", { ascending: true })
      .order("departure_time", { ascending: true })

    if (universityId) {
      query = query.eq("university_id", universityId)
    }

    if (destination) {
      query = query.ilike("destination", `%${destination}%`)
    }

    if (date) {
      query = query.eq("departure_date", date)
    }

    if (availableOnly) {
      query = query.gt("available_spots", 0)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ rides: data })
  } catch (error) {
    console.error("Error fetching rides:", error)
    return NextResponse.json({ error: "Failed to fetch rides" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      destination,
      departureLocation,
      departureDate,
      departureTime,
      availableSpots,
      pricePerPerson,
      notes,
      vehicleId,
      driverId,
      universityId,
    } = body

    const { data, error } = await supabase
      .from("rides")
      .insert({
        driver_id: driverId,
        university_id: universityId,
        vehicle_id: vehicleId,
        destination,
        departure_location: departureLocation,
        departure_date: departureDate,
        departure_time: departureTime,
        available_spots: availableSpots,
        total_spots: availableSpots,
        price_per_person: pricePerPerson,
        notes,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ ride: data })
  } catch (error) {
    console.error("Error creating ride:", error)
    return NextResponse.json({ error: "Failed to create ride" }, { status: 500 })
  }
}
