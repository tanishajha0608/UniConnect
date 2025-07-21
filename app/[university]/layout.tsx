import type React from "react"
import { notFound } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

interface UniversityLayoutProps {
  params: { university: string }
  children: React.ReactNode
}

async function getUniversity(slug: string) {
  // Helper to slug-ify names from the remote dataset
  const makeSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

  // --- 1️⃣ Try our internal API first ----------------------------
  try {
    const internal = await fetch(`/api/universities/${slug}`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    })
    if (internal.ok) return internal.json()
  } catch {
    /* swallow – will try remote fallback */
  }

  // --- 2️⃣ Fallback → OpenDataSoft public dataset ----------------
  try {
    const odsUrl = new URL("https://public.opendatasoft.com/api/records/1.0/search/")
    odsUrl.searchParams.set("dataset", "us-colleges-and-universities")
    odsUrl.searchParams.set("rows", "50") // small window is enough
    odsUrl.searchParams.set("q", slug.replace(/-/g, " ")) // loose search

    const ods = await fetch(odsUrl.toString())
    if (!ods.ok) return null

    const { records = [] } = await ods.json()

    const match = records.find((r: any) => makeSlug(r.fields.name || r.fields.institution_name) === slug)
    if (!match) return null

    const f = match.fields
    return {
      id: match.recordid,
      name: f.name || f.institution_name,
      slug,
      city: f.city,
      state: f.state,
      website: f.website,
      type: f.sector_of_institution,
      coordinates: f.location
        ? [f.location[1], f.location[0]] // [lng, lat]
        : null,
    }
  } catch {
    return null
  }
}

export default async function UniversityLayout({ params, children }: UniversityLayoutProps) {
  const university = await getUniversity(params.university)

  if (!university) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav university={university} />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
