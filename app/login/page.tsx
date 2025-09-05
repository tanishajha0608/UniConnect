"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth"
import { validateUCDomain } from "@/lib/uc-email-validation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
    
    // Real-time email validation
    if (field === "email" && value) {
      const emailValidation = validateUCDomain(value)
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.error || "Invalid email domain. UC system emails only.")
      } else {
        setEmailError("")
      }
    } else if (field === "email" && !value) {
      setEmailError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate UC email domain
    const emailValidation = validateUCDomain(formData.email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error || "Invalid email domain. UC system emails only.")
      return
    }

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: signInError } = await signIn(formData.email, formData.password)

      if (signInError) {
        setError(signInError.message || "Invalid email or password")
        return
      }

      if (data?.user) {
        // Redirect to home page - user will need to select their university
        router.push("/")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Login error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">UC Login</CardTitle>
          <CardDescription>Enter your UC email below to login to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">UC Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="student@berkeley.edu" 
                required 
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <p className="text-xs text-red-500">
                  {emailError}
                </p>
              )}
              {!emailError && formData.email && (
                <p className="text-xs text-green-600">
                  ✓ Valid UC email domain
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
