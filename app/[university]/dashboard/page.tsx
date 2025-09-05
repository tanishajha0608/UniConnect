import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Car, BookOpen, Bell, MapPin } from "lucide-react"
import { notFound } from "next/navigation"
import { getUniversity } from "@/lib/universities"

interface DashboardPageProps {
  params: { university: string }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const university = getUniversity(params.university)

  if (!university) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to {university.name}</h1>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>
            {university.city}, {university.state}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Ride Sharing</CardTitle>
            <Car className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Find students to share an Uber with and save up to 75% on your ride to the airport.
            </CardDescription>
            <Link href={`/${university.slug}/rides`}>
              <Button className="w-full">Find or Create a Ride</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Study Spots</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Discover the best places to study on campus with real-time occupancy information.
            </CardDescription>
            <Link href={`/${university.slug}/study-spots`}>
              <Button className="w-full">Find Study Spots</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Campus Info</CardTitle>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              {university.type && (
                <div className="mb-2">
                  <span className="font-medium">Type:</span> {university.type}
                </div>
              )}
              {university.website && (
                <div>
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Campus Site
                  </a>
                </div>
              )}
            </CardDescription>
            <Button variant="outline" className="w-full bg-transparent">
              View Campus Map
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Active Rides</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">Available Study Spots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">156</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
