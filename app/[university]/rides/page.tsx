import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateRideForm } from "@/components/create-ride-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, MapPin, Star, MessageCircle } from "lucide-react"

interface RidesPageProps {
  params: { university: string }
}

export default function RidesPage({ params }: RidesPageProps) {
  // Mock data - would come from database
  const availableRides = [
    {
      id: 1,
      destination: "San Francisco International Airport (SFO)",
      departureLocation: "Main Campus Gate",
      date: "2024-07-25",
      time: "14:00",
      spots: 3,
      totalSpots: 4,
      price: "$15",
      originalPrice: "$60",
      creator: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.8,
        ridesCompleted: 12,
      },
      car: "Honda Civic - Blue",
      notes: "Leaving from main gate, can pick up from dorms if needed. Have space for 2 large suitcases.",
    },
    {
      id: 2,
      destination: "San Francisco International Airport (SFO)",
      departureLocation: "Student Parking Lot B",
      date: "2024-07-26",
      time: "09:30",
      spots: 2,
      totalSpots: 3,
      price: "$18",
      originalPrice: "$54",
      creator: {
        name: "Michael Torres",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4.9,
        ridesCompleted: 8,
      },
      car: "Toyota Camry - Silver",
      notes: "Early morning flight, please be on time. Light luggage preferred.",
    },
    {
      id: 3,
      destination: "San Jose International Airport (SJC)",
      departureLocation: "Engineering Building",
      date: "2024-07-27",
      time: "11:45",
      spots: 1,
      totalSpots: 4,
      price: "$22",
      originalPrice: "$88",
      creator: {
        name: "Sophia Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5.0,
        ridesCompleted: 15,
      },
      car: "Tesla Model 3 - White",
      notes: "Comfortable ride with phone chargers. Can make a quick stop if needed.",
    },
  ]

  const myRides = [
    {
      id: 4,
      destination: "San Francisco International Airport (SFO)",
      departureLocation: "Main Campus Gate",
      date: "2024-08-01",
      time: "16:15",
      spots: 2,
      totalSpots: 4,
      price: "$17",
      creator: "You",
      participants: [
        { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Jamie Smith", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      pendingRequests: 3,
      car: "Honda Accord - Black",
      status: "active",
    },
  ]

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Ride Sharing</h1>
          <p className="text-muted-foreground mt-1">Find rides or create your own to save money</p>
        </div>
        <Button size="lg">Create New Ride</Button>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Rides ({availableRides.length})</TabsTrigger>
          <TabsTrigger value="my-rides">My Rides ({myRides.length})</TabsTrigger>
          <TabsTrigger value="create">Create a Ride</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <div className="grid gap-6">
            {availableRides.map((ride) => (
              <Card key={ride.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{ride.destination}</CardTitle>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">From: {ride.departureLocation}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">{ride.price}</span>
                        <div className="text-sm text-muted-foreground">
                          <div className="line-through">{ride.originalPrice}</div>
                          <div className="text-green-600 font-medium">
                            Save{" "}
                            {Math.round(
                              ((Number.parseInt(ride.originalPrice.slice(1)) - Number.parseInt(ride.price.slice(1))) /
                                Number.parseInt(ride.originalPrice.slice(1))) *
                                100,
                            )}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{ride.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{ride.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {ride.spots} of {ride.totalSpots} spots available
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Vehicle:</strong> {ride.car}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={ride.creator.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {ride.creator.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{ride.creator.name}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{ride.creator.rating}</span>
                            <span>•</span>
                            <span>{ride.creator.ridesCompleted} rides</span>
                          </div>
                        </div>
                      </div>

                      {ride.notes && (
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                          <strong>Notes:</strong> {ride.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button className="flex-1">Request to Join</Button>
                  <Button variant="outline" size="icon">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-rides" className="space-y-6">
          <div className="grid gap-6">
            {myRides.map((ride) => (
              <Card key={ride.id} className="border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{ride.destination}</CardTitle>
                        <Badge variant="secondary">Your Ride</Badge>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">From: {ride.departureLocation}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{ride.price}</div>
                      <div className="text-sm text-muted-foreground">per person</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{ride.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{ride.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{ride.totalSpots - ride.spots} passengers confirmed</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Vehicle:</strong> {ride.car}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-2">Passengers:</div>
                        <div className="flex gap-2">
                          {ride.participants.map((participant, index) => (
                            <Avatar key={index} className="h-8 w-8">
                              <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>

                      {ride.pendingRequests > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                          <div className="text-sm font-medium text-yellow-800">
                            {ride.pendingRequests} pending request{ride.pendingRequests > 1 ? "s" : ""}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Manage Ride
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Message Group
                  </Button>
                  {ride.pendingRequests > 0 && (
                    <Button className="flex-1">Review Requests ({ride.pendingRequests})</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Ride</CardTitle>
              <CardDescription>
                Share your ride details to find other students heading to the same destination.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateRideForm university={params.university} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
