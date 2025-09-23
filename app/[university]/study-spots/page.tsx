import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, Wifi, Coffee, Users, Volume2, Zap, Search, Filter } from "lucide-react"

interface StudySpotsPageProps {
  params: { university: string }
}

export default function StudySpotsPage({ params }: StudySpotsPageProps) {
  // Mock data - would come from database with real-time updates
  const studySpots = [
    {
      id: 1,
      name: "Main Library - Silent Floor",
      location: "Central Campus, 3rd Floor",
      occupancy: 25,
      capacity: 120,
      openUntil: "23:00",
      amenities: ["Silent", "Wifi", "Power Outlets", "Individual Desks"],
      image: "/placeholder.svg?height=200&width=300&text=Library+Silent+Floor",
      rating: 4.8,
      reviews: 156,
      lastUpdated: "2 min ago",
      studyType: "Individual",
    },
    {
      id: 2,
      name: "Student Union Café",
      location: "North Campus, Ground Floor",
      occupancy: 75,
      capacity: 80,
      openUntil: "22:00",
      amenities: ["Coffee", "Food", "Wifi", "Group Tables", "Moderate Noise"],
      image: "/placeholder.svg?height=200&width=300&text=Student+Union+Cafe",
      rating: 4.2,
      reviews: 89,
      lastUpdated: "5 min ago",
      studyType: "Social",
    },
    {
      id: 3,
      name: "Engineering Building - Study Lounge",
      location: "South Campus, 2nd Floor",
      occupancy: 40,
      capacity: 60,
      openUntil: "00:00",
      amenities: ["Quiet", "Power Outlets", "Whiteboards", "Group Tables", "24/7 Access"],
      image: "/placeholder.svg?height=200&width=300&text=Engineering+Study+Lounge",
      rating: 4.6,
      reviews: 203,
      lastUpdated: "1 min ago",
      studyType: "Group",
    },
    {
      id: 4,
      name: "Science Center - Collaboration Space",
      location: "East Campus, 1st Floor",
      occupancy: 90,
      capacity: 45,
      openUntil: "21:00",
      amenities: ["Group Tables", "Wifi", "Presentation Screens", "Moderate Noise"],
      image: "/placeholder.svg?height=200&width=300&text=Science+Collaboration+Space",
      rating: 4.4,
      reviews: 67,
      lastUpdated: "3 min ago",
      studyType: "Group",
    },
    {
      id: 5,
      name: "Business School - Quiet Study",
      location: "West Campus, 4th Floor",
      occupancy: 15,
      capacity: 90,
      openUntil: "22:30",
      amenities: ["Silent", "Wifi", "Power Outlets", "Individual Carrels", "Natural Light"],
      image: "/placeholder.svg?height=200&width=300&text=Business+Quiet+Study",
      rating: 4.9,
      reviews: 124,
      lastUpdated: "4 min ago",
      studyType: "Individual",
    },
  ]

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 40) return "bg-green-500"
    if (occupancy < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getOccupancyText = (occupancy: number) => {
    if (occupancy < 40) return "Low"
    if (occupancy < 70) return "Moderate"
    return "High"
  }

  const getAvailableSpots = (capacity: number, occupancy: number) => {
    return Math.floor(capacity * (1 - occupancy / 100))
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Study Spots</h1>
          <p className="text-muted-foreground mt-1">Find the perfect place to study with real-time availability</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Map View
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search study spots..." className="pl-10" />
        </div>
        <Button variant="outline">All Locations</Button>
        <Button variant="outline">Available Now</Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Spots</TabsTrigger>
          <TabsTrigger value="quiet">Quiet Study</TabsTrigger>
          <TabsTrigger value="group">Group Study</TabsTrigger>
          <TabsTrigger value="social">Social/Café</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {studySpots.map((spot) => (
              <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video w-full relative">
                  <img src={spot.image || "/placeholder.svg"} alt={spot.name} className="h-full w-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getOccupancyColor(spot.occupancy)} text-white`}>
                      {getOccupancyText(spot.occupancy)} Occupancy
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {getAvailableSpots(spot.capacity, spot.occupancy)} spots available
                  </div>
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{spot.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {spot.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{spot.rating}</span>
                        <span className="text-muted-foreground">({spot.reviews})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Occupancy Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Current Occupancy</span>
                        <span>
                          {spot.occupancy}% ({Math.floor((spot.capacity * spot.occupancy) / 100)}/{spot.capacity})
                        </span>
                      </div>
                      <Progress value={spot.occupancy} className="h-2" />
                    </div>

                    {/* Hours and Last Updated */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Open until {spot.openUntil}</span>
                      </div>
                      <span>Updated {spot.lastUpdated}</span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {spot.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity === "Wifi" && <Wifi className="h-3 w-3 mr-1" />}
                          {amenity === "Coffee" && <Coffee className="h-3 w-3 mr-1" />}
                          {amenity === "Group Tables" && <Users className="h-3 w-3 mr-1" />}
                          {amenity === "Power Outlets" && <Zap className="h-3 w-3 mr-1" />}
                          {(amenity === "Moderate Noise" || amenity === "Silent") && (
                            <Volume2 className="h-3 w-3 mr-1" />
                          )}
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-3">
                  <Button className="flex-1" disabled={spot.occupancy >= 95}>
                    {spot.occupancy >= 95 ? "Full" : "Check In Here"}
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    Get Directions
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Filter tabs would show filtered results */}
        <TabsContent value="quiet">
          <div className="grid gap-6 lg:grid-cols-2">
            {studySpots
              .filter((spot) => spot.studyType === "Individual" || spot.amenities.includes("Silent"))
              .map((spot) => (
                <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Same card structure as above */}
                  <div className="aspect-video w-full relative">
                    <img
                      src={spot.image || "/placeholder.svg"}
                      alt={spot.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getOccupancyColor(spot.occupancy)} text-white`}>
                        {getOccupancyText(spot.occupancy)} Occupancy
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {getAvailableSpots(spot.capacity, spot.occupancy)} spots available
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{spot.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {spot.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{spot.rating}</span>
                          <span className="text-muted-foreground">({spot.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Current Occupancy</span>
                          <span>
                            {spot.occupancy}% ({Math.floor((spot.capacity * spot.occupancy) / 100)}/{spot.capacity})
                          </span>
                        </div>
                        <Progress value={spot.occupancy} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Open until {spot.openUntil}</span>
                        </div>
                        <span>Updated {spot.lastUpdated}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {spot.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity === "Wifi" && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity === "Coffee" && <Coffee className="h-3 w-3 mr-1" />}
                            {amenity === "Group Tables" && <Users className="h-3 w-3 mr-1" />}
                            {amenity === "Power Outlets" && <Zap className="h-3 w-3 mr-1" />}
                            {(amenity === "Moderate Noise" || amenity === "Silent") && (
                              <Volume2 className="h-3 w-3 mr-1" />
                            )}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-3">
                    <Button className="flex-1" disabled={spot.occupancy >= 95}>
                      {spot.occupancy >= 95 ? "Full" : "Check In Here"}
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      Get Directions
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="group">
          <div className="grid gap-6 lg:grid-cols-2">
            {studySpots
              .filter((spot) => spot.studyType === "Group" || spot.amenities.includes("Group Tables"))
              .map((spot) => (
                <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Same card structure */}
                  <div className="aspect-video w-full relative">
                    <img
                      src={spot.image || "/placeholder.svg"}
                      alt={spot.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getOccupancyColor(spot.occupancy)} text-white`}>
                        {getOccupancyText(spot.occupancy)} Occupancy
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {getAvailableSpots(spot.capacity, spot.occupancy)} spots available
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{spot.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {spot.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{spot.rating}</span>
                          <span className="text-muted-foreground">({spot.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Current Occupancy</span>
                          <span>
                            {spot.occupancy}% ({Math.floor((spot.capacity * spot.occupancy) / 100)}/{spot.capacity})
                          </span>
                        </div>
                        <Progress value={spot.occupancy} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Open until {spot.openUntil}</span>
                        </div>
                        <span>Updated {spot.lastUpdated}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {spot.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity === "Wifi" && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity === "Coffee" && <Coffee className="h-3 w-3 mr-1" />}
                            {amenity === "Group Tables" && <Users className="h-3 w-3 mr-1" />}
                            {amenity === "Power Outlets" && <Zap className="h-3 w-3 mr-1" />}
                            {(amenity === "Moderate Noise" || amenity === "Silent") && (
                              <Volume2 className="h-3 w-3 mr-1" />
                            )}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-3">
                    <Button className="flex-1" disabled={spot.occupancy >= 95}>
                      {spot.occupancy >= 95 ? "Full" : "Check In Here"}
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      Get Directions
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid gap-6 lg:grid-cols-2">
            {studySpots
              .filter((spot) => spot.studyType === "Social" || spot.amenities.includes("Coffee"))
              .map((spot) => (
                <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Same card structure */}
                  <div className="aspect-video w-full relative">
                    <img
                      src={spot.image || "/placeholder.svg"}
                      alt={spot.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getOccupancyColor(spot.occupancy)} text-white`}>
                        {getOccupancyText(spot.occupancy)} Occupancy
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {getAvailableSpots(spot.capacity, spot.occupancy)} spots available
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{spot.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {spot.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{spot.rating}</span>
                          <span className="text-muted-foreground">({spot.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Current Occupancy</span>
                          <span>
                            {spot.occupancy}% ({Math.floor((spot.capacity * spot.occupancy) / 100)}/{spot.capacity})
                          </span>
                        </div>
                        <Progress value={spot.occupancy} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Open until {spot.openUntil}</span>
                        </div>
                        <span>Updated {spot.lastUpdated}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {spot.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity === "Wifi" && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity === "Coffee" && <Coffee className="h-3 w-3 mr-1" />}
                            {amenity === "Group Tables" && <Users className="h-3 w-3 mr-1" />}
                            {amenity === "Power Outlets" && <Zap className="h-3 w-3 mr-1" />}
                            {(amenity === "Moderate Noise" || amenity === "Silent") && (
                              <Volume2 className="h-3 w-3 mr-1" />
                            )}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-3">
                    <Button className="flex-1" disabled={spot.occupancy >= 95}>
                      {spot.occupancy >= 95 ? "Full" : "Check In Here"}
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      Get Directions
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
