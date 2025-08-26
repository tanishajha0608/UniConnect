"use client"


import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"


interface University {
 id: string
 name: string
 state: string
 city: string
 slug: string
}


export default function SignupPage() {
 const router = useRouter()
 const [open, setOpen] = useState(false)
 const [selectedUniversity, setSelectedUniversity] = useState("")
 const [universities, setUniversities] = useState<University[]>([])
 const [loading, setLoading] = useState(false)
 const [search, setSearch] = useState("")
  // Form fields
 const [firstName, setFirstName] = useState("")
 const [lastName, setLastName] = useState("")
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [confirmPassword, setConfirmPassword] = useState("")
 const [errorMsg, setErrorMsg] = useState("")


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


 const handleSignup = async () => {
   setErrorMsg("")


   if (password !== confirmPassword) {
     setErrorMsg("Passwords do not match")
     return
   }


   // 1️⃣ Create user in Auth
   const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
     email,
     password
   })


   if (signUpError) {
     setErrorMsg(signUpError.message)
     return
   }


   const userId = signUpData.user?.id
   if (!userId) {
     setErrorMsg("User ID not returned from signup")
     return
   }


   // 2️⃣ Insert profile row
   const { error: profileError } = await supabase.from("user_profiles").insert({
     id: userId,
     first_name: firstName,
     last_name: lastName,
     email,
     university_id: selectedUniversityData?.id, // or store slug/name if you prefer
     status: "pending",
     is_driver: false,
     driver_license_verified: false,
     rating: 0,
     total_ratings: 0,
     rides_as_driver: 0,
     rides_as_passenger: 0
   })


   if (profileError) {
     setErrorMsg(`Profile insert failed: ${profileError.message}`)
     return
   }


   // 3️⃣ Redirect after success
   router.push("/dashboard")
 }


 return (
   <div className="flex min-h-screen items-center justify-center">
     <Card className="mx-auto max-w-md">
       <CardHeader>
         <CardTitle className="text-2xl">Sign Up</CardTitle>
         <CardDescription>Create an account to use UniConnect</CardDescription>
       </CardHeader>
       <CardContent className="space-y-4">
         {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
         <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="first-name">First name</Label>
             <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} id="first-name" placeholder="First name" required />
           </div>
           <div className="space-y-2">
             <Label htmlFor="last-name">Last name</Label>
             <Input value={lastName} onChange={(e) => setLastName(e.target.value)} id="last-name" placeholder="Last name" required />
           </div>
         </div>
         <div className="space-y-2">
           <Label htmlFor="email">Email</Label>
           <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.edu" required />
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
           <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" required />
         </div>
         <div className="space-y-2">
           <Label htmlFor="confirm-password">Confirm Password</Label>
           <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirm-password" type="password" required />
         </div>
       </CardContent>
       <CardFooter className="flex flex-col">
         <Button className="w-full" onClick={handleSignup}>Create Account</Button>
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


