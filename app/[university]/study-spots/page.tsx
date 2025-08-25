import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, Wifi, Coffee, Users, Volume2, Zap, Search, Filter } from "lucide-react"
import { notFound } from "next/navigation"
import { getUniversity } from "@/lib/universities"
import { MOCK_STUDY_SPOTS } from "@/lib/mock-data"
import { getOccupancyColor, getOccupancyText, getAvailableSpots } from "@/lib/helpers"

interface StudySpotsPageProps {
  params: { university: string }
}

export default async function StudySpotsPage({ params }: StudySpotsPageProps) {
  const university = getUniversity(params.university)

  if (!university) {
    notFound()
  }

  // Use centralized mock data
  const transformedStudySpots = MOCK_STUDY_SPOTS

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
            {transformedStudySpots.map((spot) => (
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
