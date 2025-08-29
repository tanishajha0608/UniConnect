"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { UC_CAMPUSES } from "@/lib/universities"

export function UniversitySelector() {
  const [value, setValue] = useState("")
  const router = useRouter()

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = event.target.value
    setValue(selectedSlug)
    
    if (selectedSlug) {
      router.push(`/${selectedSlug}/dashboard`)
    }
  }

  const selectedUniversity = UC_CAMPUSES.find((uni) => uni.slug === value)

  return (
    <div className="space-y-4">
      <div className="relative">
        <select
          value={value}
          onChange={handleSelect}
          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">Select your UC campus...</option>
          {UC_CAMPUSES.map((university) => (
            <option key={university.id} value={university.slug}>
              {university.name} ({university.city}, {university.state})
            </option>
          ))}
        </select>
        <ChevronsUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
      
      {selectedUniversity && (
        <Button className="w-full" onClick={() => router.push(`/${value}/dashboard`)}>
          Continue to {selectedUniversity.name}
        </Button>
      )}
    </div>
  )
}
