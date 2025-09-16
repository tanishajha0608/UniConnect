"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Car, Calendar, MapPin, Clock, Loader2 } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { UserProfile, University } from "@/lib/supabase"
import { EditProfileModal } from "@/components/edit-profile-modal"

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserData() {
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData)

          // Fetch university data if user has a university_id
          if (userData.university_id) {
            const { data: universityData, error: universityError } = await supabase
              .from('universities')
              .select('*')
              .eq('id', userData.university_id)
              .single()

            if (universityError) {
              console.error('Error fetching university:', universityError)
            } else {
              setUniversity(universityData)
            }
          }
        } else {
          setError("Please log in to view your profile")
        }
      } catch (err) {
        console.error('Error loading user data:', err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile Unavailable</CardTitle>
            <CardDescription>{error || "Unable to load profile"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fullName = `${user.first_name} ${user.last_name}`.trim() || "User"
  const userInitials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U'

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser)
  }

  // Sample rides data - this would come from your database
  const recentRides = [
    {
      id: 1,
      destination: "LAX Airport",
      date: "2024-09-10",
      time: "2:30 PM",
      passengers: 3,
      cost: "$15",
      status: "completed"
    },
    {
      id: 2,
      destination: "Downtown Santa Barbara",
      date: "2024-09-08",
      time: "6:45 PM",
      passengers: 2,
      cost: "$8",
      status: "completed"
    },
    {
      id: 3,
      destination: "UCSB Campus",
      date: "2024-09-06",
      time: "9:15 AM",
      passengers: 4,
      cost: "$12",
      status: "completed"
    },
    {
      id: 4,
      destination: "San Luis Obispo",
      date: "2024-09-15",
      time: "3:00 PM",
      passengers: 2,
      cost: "$25",
      status: "upcoming"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <button
            onClick={() => window.location.href = '/ucsb/dashboard'}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">UniConnect</span>
          </button>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg?height=96&width=96"} alt={fullName} />
                      <AvatarFallback className="text-2xl">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl">{fullName}</CardTitle>
                  <CardDescription className="flex items-center justify-center mt-2">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">University</span>
                    <span className="text-sm font-medium">{university?.name || "Not specified"}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium">
                      {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total rides</span>
                    <span className="text-sm font-medium">{(user.rides_as_driver || 0) + (user.rides_as_passenger || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <Badge variant="secondary">
                      {user.rating ? `${user.rating.toFixed(1)} ⭐` : "No ratings yet"}
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <EditProfileModal user={user} onProfileUpdate={handleProfileUpdate}>
                      <Button className="w-full" variant="outline">
                        Edit Profile
                      </Button>
                    </EditProfileModal>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rides History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    My Rides
                  </CardTitle>
                  <CardDescription>
                    Your recent and upcoming ride history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRides.map((ride) => (
                      <div key={ride.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{ride.destination}</span>
                              <Badge variant={ride.status === "completed" ? "secondary" : "default"}>
                                {ride.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {ride.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {ride.time}
                              </div>
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {ride.passengers} passengers
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">{ride.cost}</div>
                            <div className="text-xs text-muted-foreground">per person</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {recentRides.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No rides yet</p>
                      <p className="text-sm">Start by creating or joining a ride!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {(user.rides_as_driver || 0) + (user.rides_as_passenger || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Rides</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        ${Math.round(((user.rides_as_driver || 0) + (user.rides_as_passenger || 0)) * 15)}
                      </div>
                      <div className="text-sm text-muted-foreground">Money Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {user.rating ? user.rating.toFixed(1) : "0.0"}
                      </div>
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}