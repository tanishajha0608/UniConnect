"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createProfileForExistingUser, getCurrentUser } from "@/lib/auth"

export default function DevToolsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")

  const handleCreateProfile = async () => {
    setLoading(true)
    setResult("")
    
    try {
      const result = await createProfileForExistingUser()
      if (result.success) {
        setResult(`✅ ${result.message || "Profile created successfully!"}`)
      } else {
        setResult(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckUser = async () => {
    setLoading(true)
    setResult("")
    
    try {
      const user = await getCurrentUser()
      if (user) {
        setResult(`✅ User found: ${user.first_name} ${user.last_name} (${user.email})`)
      } else {
        setResult("❌ No user profile found")
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Development Tools</CardTitle>
          <CardDescription>
            Tools to help with development and debugging user authentication issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              onClick={handleCheckUser} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Check Current User
            </Button>
            <Button 
              onClick={handleCreateProfile} 
              disabled={loading}
              className="w-full"
            >
              Create Profile for Current User
            </Button>
          </div>
          
          {result && (
            <div className="p-4 bg-muted rounded-lg">
              <pre className="text-sm">{result}</pre>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Make sure you're logged in first</li>
              <li>Click "Check Current User" to see if you have a profile</li>
              <li>If no profile exists, click "Create Profile for Current User"</li>
              <li>This will create your user profile in the database</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
