import type React from "react"
import { notFound } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { getUniversity } from "@/lib/universities"

interface UniversityLayoutProps {
  params: { university: string }
  children: React.ReactNode
}

export default async function UniversityLayout({ params, children }: UniversityLayoutProps) {
  const university = getUniversity(params.university)

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
