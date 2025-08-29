"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateRideForm } from "@/components/create-ride-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, MapPin, Star, MessageCircle } from "lucide-react"
import { MockRide, MockMyRide } from "@/lib/mock-data"
import { University } from "@/lib/universities"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface RidesClientProps {
  university: University
  rides: MockRide[]
  myRides: MockMyRide[]
}

export function RidesClient({ university, rides, myRides }: RidesClientProps) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("available")
  const { toast } = useToast()

  // Check for tab parameter in URL and set active tab
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && ["available", "my-rides", "create"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleRequestRide = (rideId: number) => {
    toast({
      title: "UC Demo Mode",
      description: "This is a UC campus demo. In production, this would request the ride.",
    })
  }

  const handleMessage = (rideId: number, driverName: string) => {
    toast({
      title: "UC Demo Mode",
      description: "This is a UC campus demo. In production, this would open messaging.",
    })
  }

  const handleEditRide = (rideId: number) => {
    toast({
      title: "UC Demo Mode",
      description: "This is a UC campus demo. In production, this would edit the ride.",
    })
  }

  const handleCancelRide = (rideId: number) => {
    toast({
      title: "UC Demo Mode",
      description: "This is a UC campus demo. In production, this would cancel the ride.",
    })
  }

  const handleViewRequests = (rideId: number) => {
    toast({
      title: "UC Demo Mode",
      description: "This is a UC campus demo. In production, this would show ride requests.",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">UC Ride Sharing</h1>
          <p className="text-muted-foreground">
            Find or create rides to local airports from {university.name}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Rides</TabsTrigger>
          <TabsTrigger value="my-rides">My Rides</TabsTrigger>
          <TabsTrigger value="create">Create Ride</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {rides.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No rides available</h3>
                  <p className="text-muted-foreground">
                    No rides are currently available from {university.name}. Check back later or create your own ride!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {rides.map((ride) => (
                <Card key={ride.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{ride.destination}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {ride.departureLocation}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {ride.spots} spot{ride.spots !== 1 ? 's' : ''} left
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.totalSpots - ride.spots}/{ride.totalSpots} filled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">{ride.price}</span>
                        <span className="text-muted-foreground line-through">{ride.originalPrice}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={ride.creator.avatar} alt={ride.creator.name} />
                          <AvatarFallback>{ride.creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{ride.creator.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">
                              {ride.creator.rating} ({ride.creator.ridesCompleted} rides)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ride.car}
                      </div>
                    </div>
                    {ride.notes && (
                      <p className="mt-3 text-sm text-muted-foreground">{ride.notes}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleRequestRide(ride.id)}
                    >
                      Request Ride
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMessage(ride.id, ride.creator.name)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-rides" className="space-y-4">
          {myRides.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No rides created</h3>
                  <p className="text-muted-foreground">
                    You haven't created any rides yet. Create your first ride to get started!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myRides.map((ride) => (
                <Card key={ride.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{ride.destination}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {ride.departureLocation}
                        </CardDescription>
                      </div>
                      <Badge variant={ride.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                        {ride.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{ride.participants.length}/{ride.totalSpots} joined</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{ride.price}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Participants:</p>
                      <div className="flex items-center gap-2">
                        {ride.participants.map((participant, index) => (
                          <Avatar key={index} className="h-6 w-6">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback className="text-xs">{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        ))}
                        {ride.pendingRequests > 0 && (
                          <Badge variant="outline" className="text-xs">
                            +{ride.pendingRequests} pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      {ride.car}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditRide(ride.id)}
                    >
                      Edit Ride
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewRequests(ride.id)}
                    >
                      View Requests
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelRide(ride.id)}
                    >
                      Cancel Ride
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create a New UC Ride</CardTitle>
              <CardDescription>
                Share your ride and help other UC students get to the airport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateRideForm university={university.slug} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 