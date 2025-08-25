import { notFound } from "next/navigation"
import { getUniversity } from "@/lib/universities"
import { MOCK_RIDES, MOCK_MY_RIDES } from "@/lib/mock-data"
import { getAirportsForCampus } from "@/lib/airports"
import { RidesClient } from "@/components/rides-client"

interface RidesPageProps {
  params: { university: string }
}

export default async function RidesPage({ params }: RidesPageProps) {
  const university = getUniversity(params.university)

  if (!university) {
    notFound()
  }

  // Get airports for this campus
  const campusAirports = getAirportsForCampus(university.slug)
  
  // Filter rides to show only those relevant to this UC campus
  const transformedRides = MOCK_RIDES.filter(ride => {
    // Check if the ride destination matches any of the campus airports
    const isLocalAirport = campusAirports.some(airport => 
      ride.destination.includes(airport.code) || ride.destination.includes(airport.name)
    )
    
    // Also include rides that seem to be from this campus (based on departure location)
    const isFromThisCampus = ride.departureLocation.toLowerCase().includes(university.name.toLowerCase().split(',')[0].toLowerCase()) ||
                            ride.departureLocation.toLowerCase().includes(university.slug)
    
    return isLocalAirport || isFromThisCampus
  })

  const myRides = MOCK_MY_RIDES

  return <RidesClient university={university} rides={transformedRides} myRides={myRides} />
}
