"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { UC_CAMPUSES } from "@/lib/universities"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState("")
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    graduationYear: "",
    major: ""
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter universities based on search
  const filteredUniversities = UC_CAMPUSES.filter(uni => 
    uni.name.toLowerCase().includes(search.toLowerCase()) ||
    uni.city.toLowerCase().includes(search.toLowerCase()) ||
    uni.state.toLowerCase().includes(search.toLowerCase())
  )

  const handleUniversitySelect = (currentValue: string) => {
    setSelectedUniversity(currentValue)
    setOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !selectedUniversity) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    const selectedUniversityData = filteredUniversities.find((uni) => uni.slug === selectedUniversity)
    if (!selectedUniversityData) {
      setError("Please select a UC campus")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate a brief delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "UC Account Created! (Demo)",
        description: "This is a UC campus demo. In production, you would receive a verification email.",
      })
      
      // Redirect to university dashboard
      router.push(`/${selectedUniversity}/dashboard`)
    } catch (error) {
      setError("An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  const selectedUniversityData = filteredUniversities.find((uni) => uni.slug === selectedUniversity)

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create UC Account (Demo)</CardTitle>
          <CardDescription>Enter your information to create your UniConnect UC account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  required 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  required 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">UC Email *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="student@uc.edu" 
                required 
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {selectedUniversityData && (
                <p className="text-xs text-muted-foreground">
                  Must use @{selectedUniversityData.email_domain} email address
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">UC Campus *</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedUniversity
                      ? selectedUniversityData?.name
                      : "Select UC campus..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search UC campuses..." value={search} onValueChange={setSearch} />
                    <CommandList>
                      <CommandEmpty>No UC campus found.</CommandEmpty>
                      <CommandGroup>
                        {filteredUniversities.map((university) => (
                          <CommandItem
                            key={university.id}
                            value={university.slug}
                            onSelect={handleUniversitySelect}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUniversity === university.slug ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{university.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {university.city}, {university.state}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input 
                  id="graduationYear" 
                  type="number" 
                  min="2024" 
                  max="2030"
                  placeholder="2026"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input 
                  id="major" 
                  placeholder="Computer Science"
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                minLength={6}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating UC Account..." : "Create UC Account"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have a UC account?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
