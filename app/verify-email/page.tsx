"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { createUserProfile } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

function VerifyEmailContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Get email from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const emailFromParams = urlParams.get("email")
    const emailFromStorage = localStorage.getItem("pendingVerificationEmail")

    if (emailFromParams) {
      setEmail(emailFromParams)
      localStorage.setItem("pendingVerificationEmail", emailFromParams)
    } else if (emailFromStorage) {
      setEmail(emailFromStorage)
    }

    // Check for auth change (email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session)

      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        console.log("Email confirmed, creating profile...")
        setIsVerifying(true)

        try {
          // Create user profile now that email is verified
          const { data: profile, error } = await createUserProfile(session.user)

          if (error) {
            console.error("Profile creation failed:", error)
            setVerificationStatus("error")
            setErrorMessage("Email verified but failed to create profile. Please contact support.")
          } else {
            console.log("Profile created successfully:", profile)
            setVerificationStatus("success")
            localStorage.removeItem("pendingVerificationEmail")

            toast({
              title: "Email Verified!",
              description: "Your account has been created successfully.",
            })

            // Redirect to login page after a short delay
            setTimeout(() => {
              router.push("/login")
            }, 2000)
          }
        } catch (error) {
          console.error("Unexpected error during profile creation:", error)
          setVerificationStatus("error")
          setErrorMessage("An unexpected error occurred. Please contact support.")
        } finally {
          setIsVerifying(false)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, toast])

  const handleResendEmail = async () => {
    if (!email) return

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        toast({
          title: "Error",
          description: "Failed to resend verification email. Please try again.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Email Sent",
          description: "Verification email has been resent. Please check your inbox.",
        })
      }
    } catch (error) {
      console.error("Error resending email:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (verificationStatus === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Email Verified!</CardTitle>
            <CardDescription>
              Your UC account has been created successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting you to login...
            </p>
            <Link href="/login">
              <Button className="w-full">
                Continue to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verificationStatus === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Verification Failed</CardTitle>
            <CardDescription>
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleResendEmail} variant="outline" className="w-full">
              Resend Verification Email
            </Button>
            <Link href="/signup">
              <Button variant="ghost" className="w-full">
                Back to Sign Up
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerifying && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="text-sm">Creating your profile...</span>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-2">
            <p>Please check your email and click the verification link to complete your UC account setup.</p>
            <p>Once verified, your profile will be automatically created and you'll be redirected to login.</p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleResendEmail} variant="outline" className="w-full">
              Resend Verification Email
            </Button>

            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/signup" className="text-muted-foreground hover:text-primary">
                Back to Sign Up
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/login" className="text-muted-foreground hover:text-primary">
                Already verified? Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}