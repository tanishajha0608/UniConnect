/**
 * Centralized airport data for UC campuses
 * Maps each UC campus to their local airports for ride sharing
 */

export interface Airport {
  code: string
  name: string
  city: string
  state: string
  distance: string // Distance from campus
  driveTime: string // Approximate drive time
  coordinates?: [number, number]
}

export interface CampusAirports {
  campusSlug: string
  airports: Airport[]
}

/**
 * Airport data for each UC campus
 * Only includes airports that are reasonably accessible for ride sharing
 */
export const CAMPUS_AIRPORTS: CampusAirports[] = [
  {
    campusSlug: "berkeley",
    airports: [
      {
        code: "OAK",
        name: "Oakland International Airport",
        city: "Oakland",
        state: "CA",
        distance: "12 miles",
        driveTime: "20-30 min"
      },
      {
        code: "SFO",
        name: "San Francisco International Airport",
        city: "San Francisco",
        state: "CA",
        distance: "25 miles",
        driveTime: "35-50 min"
      },
      {
        code: "SJC",
        name: "San Jose International Airport",
        city: "San Jose",
        state: "CA",
        distance: "45 miles",
        driveTime: "50-70 min"
      }
    ]
  },
  {
    campusSlug: "ucla",
    airports: [
      {
        code: "LAX",
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        state: "CA",
        distance: "15 miles",
        driveTime: "25-45 min"
      },
      {
        code: "BUR",
        name: "Bob Hope Airport",
        city: "Burbank",
        state: "CA",
        distance: "20 miles",
        driveTime: "30-50 min"
      },
      {
        code: "LGB",
        name: "Long Beach Airport",
        city: "Long Beach",
        state: "CA",
        distance: "25 miles",
        driveTime: "35-55 min"
      }
    ]
  },
  {
    campusSlug: "ucsd",
    airports: [
      {
        code: "SAN",
        name: "San Diego International Airport",
        city: "San Diego",
        state: "CA",
        distance: "8 miles",
        driveTime: "15-25 min"
      },
      {
        code: "ONT",
        name: "Ontario International Airport",
        city: "Ontario",
        state: "CA",
        distance: "85 miles",
        driveTime: "90-120 min"
      }
    ]
  },
  {
    campusSlug: "davis",
    airports: [
      {
        code: "SMF",
        name: "Sacramento International Airport",
        city: "Sacramento",
        state: "CA",
        distance: "15 miles",
        driveTime: "20-30 min"
      },
      {
        code: "OAK",
        name: "Oakland International Airport",
        city: "Oakland",
        state: "CA",
        distance: "70 miles",
        driveTime: "75-95 min"
      },
      {
        code: "SFO",
        name: "San Francisco International Airport",
        city: "San Francisco",
        state: "CA",
        distance: "85 miles",
        driveTime: "90-120 min"
      }
    ]
  },
  {
    campusSlug: "irvine",
    airports: [
      {
        code: "SNA",
        name: "John Wayne Airport",
        city: "Santa Ana",
        state: "CA",
        distance: "8 miles",
        driveTime: "15-25 min"
      },
      {
        code: "LAX",
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        state: "CA",
        distance: "45 miles",
        driveTime: "50-80 min"
      },
      {
        code: "ONT",
        name: "Ontario International Airport",
        city: "Ontario",
        state: "CA",
        distance: "35 miles",
        driveTime: "40-60 min"
      }
    ]
  },
  {
    campusSlug: "merced",
    airports: [
      {
        code: "FAT",
        name: "Fresno Yosemite International Airport",
        city: "Fresno",
        state: "CA",
        distance: "55 miles",
        driveTime: "60-80 min"
      },
      {
        code: "SMF",
        name: "Sacramento International Airport",
        city: "Sacramento",
        state: "CA",
        distance: "120 miles",
        driveTime: "130-150 min"
      }
    ]
  },
  {
    campusSlug: "riverside",
    airports: [
      {
        code: "ONT",
        name: "Ontario International Airport",
        city: "Ontario",
        state: "CA",
        distance: "15 miles",
        driveTime: "20-35 min"
      },
      {
        code: "LAX",
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        state: "CA",
        distance: "55 miles",
        driveTime: "60-90 min"
      },
      {
        code: "SNA",
        name: "John Wayne Airport",
        city: "Santa Ana",
        state: "CA",
        distance: "45 miles",
        driveTime: "50-75 min"
      }
    ]
  },
  {
    campusSlug: "ucsf",
    airports: [
      {
        code: "SFO",
        name: "San Francisco International Airport",
        city: "San Francisco",
        state: "CA",
        distance: "12 miles",
        driveTime: "20-35 min"
      },
      {
        code: "OAK",
        name: "Oakland International Airport",
        city: "Oakland",
        state: "CA",
        distance: "15 miles",
        driveTime: "25-40 min"
      },
      {
        code: "SJC",
        name: "San Jose International Airport",
        city: "San Jose",
        state: "CA",
        distance: "50 miles",
        driveTime: "55-75 min"
      }
    ]
  },
  {
    campusSlug: "ucsb",
    airports: [
      {
        code: "SBA",
        name: "Santa Barbara Municipal Airport",
        city: "Santa Barbara",
        state: "CA",
        distance: "8 miles",
        driveTime: "15-25 min"
      },
      {
        code: "LAX",
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        state: "CA",
        distance: "95 miles",
        driveTime: "100-130 min"
      }
    ]
  },
  {
    campusSlug: "ucsc",
    airports: [
      {
        code: "SJC",
        name: "San Jose International Airport",
        city: "San Jose",
        state: "CA",
        distance: "35 miles",
        driveTime: "40-60 min"
      },
      {
        code: "SFO",
        name: "San Francisco International Airport",
        city: "San Francisco",
        state: "CA",
        distance: "50 miles",
        driveTime: "55-75 min"
      },
      {
        code: "OAK",
        name: "Oakland International Airport",
        city: "Oakland",
        state: "CA",
        distance: "45 miles",
        driveTime: "50-70 min"
      }
    ]
  }
]

/**
 * Get airports for a specific campus
 * @param campusSlug - The campus slug (e.g., "berkeley", "ucla")
 * @returns Array of airports for that campus
 */
export function getAirportsForCampus(campusSlug: string): Airport[] {
  const campusData = CAMPUS_AIRPORTS.find(campus => campus.campusSlug === campusSlug)
  return campusData?.airports || []
}

/**
 * Get all available airports across all campuses
 * @returns Array of all unique airports
 */
export function getAllAirports(): Airport[] {
  const allAirports = CAMPUS_AIRPORTS.flatMap(campus => campus.airports)
  // Remove duplicates based on airport code
  const uniqueAirports = allAirports.filter((airport, index, self) => 
    index === self.findIndex(a => a.code === airport.code)
  )
  return uniqueAirports
}

/**
 * Format airport display name
 * @param airport - Airport object
 * @returns Formatted display string
 */
export function formatAirportName(airport: Airport): string {
  return `${airport.name} (${airport.code}) - ${airport.city}, ${airport.state}`
}

/**
 * Format airport with distance info
 * @param airport - Airport object
 * @returns Formatted string with distance
 */
export function formatAirportWithDistance(airport: Airport): string {
  return `${airport.name} (${airport.code}) - ${airport.distance}, ${airport.driveTime}`
} 