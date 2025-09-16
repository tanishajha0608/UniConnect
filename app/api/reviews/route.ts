import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const revieweeId = searchParams.get("reviewee_id")
  const rideId = searchParams.get("ride_id")
  const studySpotId = searchParams.get("study_spot_id")

  try {
    let query = supabase
      .from("reviews")
      .select(`
        *,
        reviewer:user_profiles!reviews_reviewer_id_fkey(*),
        reviewee:user_profiles!reviews_reviewee_id_fkey(*),
        ride:rides(*),
        study_spot:study_spots(*)
      `)
      .order("created_at", { ascending: false })

    if (revieweeId) {
      query = query.eq("reviewee_id", revieweeId)
    }

    if (rideId) {
      query = query.eq("ride_id", rideId)
    }

    if (studySpotId) {
      query = query.eq("study_spot_id", studySpotId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ reviews: data })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reviewerId, revieweeId, rideId, studySpotId, rating, comment } = body

    // Validate that either rideId or studySpotId is provided, but not both
    if ((!rideId && !studySpotId) || (rideId && studySpotId)) {
      return NextResponse.json({ error: "Either ride_id or study_spot_id must be provided" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        ride_id: rideId,
        study_spot_id: studySpotId,
        rating,
        comment,
      })
      .select(`
        *,
        reviewer:user_profiles!reviews_reviewer_id_fkey(*),
        reviewee:user_profiles!reviews_reviewee_id_fkey(*),
        ride:rides(*),
        study_spot:study_spots(*)
      `)
      .single()

    if (error) throw error

    // Create notification for reviewee
    if (revieweeId) {
      await supabase.from("notifications").insert({
        user_id: revieweeId,
        title: "New Review",
        message: `You received a ${rating}-star review`,
        type: "new_review",
        data: { review_id: data.id, rating, ride_id: rideId, study_spot_id: studySpotId },
      })
    }

    return NextResponse.json({ review: data })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
