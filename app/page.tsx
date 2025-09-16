import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UniversitySelector } from "@/components/university-selector"
import { Car, Users, DollarSign, MapPin, BookOpen, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-primary text-xl">UniConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">UC Students Only</span>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Share rides,
                    <span className="text-primary"> save money</span>
                  </h1>
                  <p className="text-xl text-muted-foreground md:text-2xl">
                    Connect with UC students to split ride costs and find the perfect study spots across all UC campuses.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>Save 25-75% on rides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>UC verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Safe community</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <UniversitySelector />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative">
                  <img
                    src="/images/carpool.png"
                    alt="Students sharing rides - carpool illustration"
                    className="w-full max-w-md h-auto"
                    width={400}
                    height={300}
                  />
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Save up to 75%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                Everything you need for campus life
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From airport rides to study sessions, UniConnect helps you connect with the UC community across all 10 campuses.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>Airport Rides</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Find students heading to the same airport and split the cost. Perfect for holiday breaks and
                    semester travel.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-medium">
                    <DollarSign className="h-4 w-4" />
                    Typical savings: $15-45 per trip
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>Study Spots</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Discover the best study locations on campus with real-time occupancy data and amenity information.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <MapPin className="h-4 w-4" />
                    Live occupancy tracking
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle>Safe & Verified</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    All users are verified with UC email addresses. Connect safely with your campus community.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 font-medium">
                    <Users className="h-4 w-4" />
                    UC-only access
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">How it works</h2>
              <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Your UC Campus</h3>
                <p className="text-muted-foreground">
                  Select your UC campus from our 10 University of California locations.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Find or Create</h3>
                <p className="text-muted-foreground">
                  Browse existing rides or study groups, or create your own and wait for others to join.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect & Save</h3>
                <p className="text-muted-foreground">
                  Meet up with fellow UC students, share costs, and build lasting connections in the UC community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Join the UC community</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10</div>
                <div className="text-muted-foreground">UC Campuses</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">$50K+</div>
                <div className="text-muted-foreground">Total Savings</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Rides Shared</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <div className="text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Ready to start saving?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join the UC community today and start sharing rides and study spots.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <UniversitySelector />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container flex flex-col sm:flex-row justify-between items-center py-6">
          <p className="text-sm text-muted-foreground">© 2024 UniConnect. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="/support" className="text-sm text-muted-foreground hover:text-primary">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
