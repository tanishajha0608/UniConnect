import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const limit = searchParams.get("limit") || "50"

  try {
    // OpenDataSoft API endpoint for US colleges and universities
    const apiUrl = new URL("https://public.opendatasoft.com/api/records/1.0/search/")
    apiUrl.searchParams.set("dataset", "us-colleges-and-universities")
    apiUrl.searchParams.set("rows", limit)
    apiUrl.searchParams.set("sort", "name")

    if (search) {
      apiUrl.searchParams.set("q", search)
    }

    const response = await fetch(apiUrl.toString())

    if (!response.ok) {
      throw new Error("Failed to fetch universities")
    }

    const data = await response.json()

    // Transform the data to match our app's format
    const universities = data.records.map((record: any) => ({
      id: record.recordid,
      name: record.fields.name || record.fields.institution_name,
      state: record.fields.state,
      city: record.fields.city,
      website: record.fields.website,
      type: record.fields.sector_of_institution,
      slug: generateSlug(record.fields.name || record.fields.institution_name),
      coordinates: record.fields.location
        ? [
            record.fields.location[1], // longitude
            record.fields.location[0], // latitude
          ]
        : null,
    }))

    return NextResponse.json({
      universities,
      total: data.nhits,
    })
  } catch (error) {
    console.error("Error fetching universities:", error)
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 })
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
