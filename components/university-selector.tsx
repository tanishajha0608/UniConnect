"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface University {
  id: string
  name: string
  state: string
  city: string
  slug: string
}

export function UniversitySelector() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        params.set("limit", "50")

        const response = await fetch(`/api/universities?${params}`)
        const data = await response.json()

        if (data.universities) {
          setUniversities(data.universities)
        }
      } catch (error) {
        console.error("Error fetching universities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUniversities()
  }, [search])

  const handleSelect = (currentValue: string) => {
    const selectedUniversity = universities.find((uni) => uni.slug === currentValue)
    if (selectedUniversity) {
      setValue(currentValue)
      setOpen(false)
      router.push(`/${currentValue}/dashboard`)
    }
  }

  const selectedUniversity = universities.find((uni) => uni.slug === value)

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-transparent"
          >
            {selectedUniversity
              ? `${selectedUniversity.name} (${selectedUniversity.state})`
              : "Select your university..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search university..." value={search} onValueChange={setSearch} />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">Loading universities...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty>No university found.</CommandEmpty>
                  <CommandGroup>
                    {universities.map((university) => (
                      <CommandItem key={university.id} value={university.slug} onSelect={handleSelect}>
                        <Check
                          className={cn("mr-2 h-4 w-4", value === university.slug ? "opacity-100" : "opacity-0")}
                        />
                        <div className="flex flex-col">
                          <span>{university.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {university.city}, {university.state}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedUniversity && (
        <Button className="w-full" onClick={() => router.push(`/${value}/dashboard`)}>
          Continue to {selectedUniversity.name}
        </Button>
      )}
    </div>
  )
}
