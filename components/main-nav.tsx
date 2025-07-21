"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface University {
  id: string
  name: string
  state: string
  city: string
  slug: string
}

interface MainNavProps {
  university: University
}

export function MainNav({ university }: MainNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: `/${university.slug}/dashboard`,
    },
    {
      name: "Ride Sharing",
      href: `/${university.slug}/rides`,
    },
    {
      name: "Study Spots",
      href: `/${university.slug}/study-spots`,
    },
  ]

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-primary">UniConnect</span>
        <span className="text-sm text-muted-foreground">|</span>
        <span className="text-sm font-medium">{university.name}</span>
      </Link>
      <nav className="flex items-center space-x-4 lg:space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
