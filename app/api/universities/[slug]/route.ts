import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    // First, search for universities that might match this slug
    const apiUrl = new URL("https://public.opendatasoft.com/api/records/1.0/search/")
    apiUrl.searchParams.set("dataset", "us-colleges-and-universities")
    apiUrl.searchParams.set("rows", "100")

    const response = await fetch(apiUrl.toString())

    if (!response.ok) {
      throw new Error("Failed to fetch university data")
    }

    const data = await response.json()

    // Find the university that matches the slug
    const university = data.records.find((record: any) => {
      const name = record.fields.name || record.fields.institution_name
      const slug = generateSlug(name)
      return slug === params.slug
    })

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 })
    }

    const universityData = {
      id: university.recordid,
      name: university.fields.name || university.fields.institution_name,
      state: university.fields.state,
      city: university.fields.city,
      website: university.fields.website,
      type: university.fields.sector_of_institution,
      slug: params.slug,
      coordinates: university.fields.location
        ? [
            university.fields.location[1], // longitude
            university.fields.location[0], // latitude
          ]
        : null,
    }

    return NextResponse.json(universityData)
  } catch (error) {
    console.error("Error fetching university:", error)
    return NextResponse.json({ error: "Failed to fetch university data" }, { status: 500 })
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
