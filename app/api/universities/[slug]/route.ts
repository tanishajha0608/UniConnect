import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    // Map URL slugs to database slugs for UC campuses
    const slugToDbSlug: { [key: string]: string } = {
      'berkeley': 'uc-berkeley',
      'davis': 'uc-davis',
      'irvine': 'uc-irvine',
      'ucla': 'ucla',
      'merced': 'uc-merced',
      'riverside': 'uc-riverside',
      'ucsd': 'uc-san-diego',
      'ucsf': 'ucsf',
      'ucsb': 'uc-santa-barbara',
      'ucsc': 'uc-santa-cruz'
    }

    const dbSlug = slugToDbSlug[params.slug]
    if (!dbSlug) {
      return NextResponse.json({ error: "University not found" }, { status: 404 })
    }

    const { data: university, error } = await supabase
      .from('universities')
      .select('*')
      .eq('slug', dbSlug)
      .single()

    if (error || !university) {
      console.error("Error fetching university:", error)
      return NextResponse.json({ error: "University not found" }, { status: 404 })
    }

    return NextResponse.json(university)
  } catch (error) {
    console.error("Error fetching university:", error)
    return NextResponse.json({ error: "Failed to fetch university data" }, { status: 500 })
  }
}
