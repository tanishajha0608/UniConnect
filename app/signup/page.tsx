"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function SignupPage() {
  const [open, setOpen] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState("")
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

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

  const handleUniversitySelect = (currentValue: string) => {
    setSelectedUniversity(currentValue)
    setOpen(false)
  }

  const selectedUniversityData = universities.find((uni) => uni.slug === selectedUniversity)

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create an account to use UniConnect</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="First name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Last name" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.edu" required />
            <p className="text-xs text-muted-foreground">Please use your university email address</p>
          </div>
          <div className="space-y-2">
            <Label>University</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-transparent"
                >
                  {selectedUniversityData
                    ? `${selectedUniversityData.name} (${selectedUniversityData.state})`
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
                            <CommandItem key={university.id} value={university.slug} onSelect={handleUniversitySelect}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedUniversity === university.slug ? "opacity-100" : "opacity-0",
                                )}
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full">Create Account</Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
