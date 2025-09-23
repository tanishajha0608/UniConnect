/**
 * Mock data for UC campuses demo mode
 * This file contains sample data that mimics the database structure for UC campuses
 */

export interface MockRide {
  id: number
  destination: string
  departureLocation: string
  date: string
  time: string
  spots: number
  totalSpots: number
  price: string
  originalPrice: string
  creator: {
    name: string
    avatar: string
    rating: number
    ridesCompleted: number
  }
  car: string
  notes?: string
}

export interface MockMyRide {
  id: number
  destination: string
  departureLocation: string
  date: string
  time: string
  totalSpots: number
  price: string
  creator: string
  participants: Array<{
    name: string
    avatar: string
  }>
  pendingRequests: number
  car: string
  status: string
}

export interface MockStudySpot {
  id: number
  name: string
  location: string
  occupancy: number
  capacity: number
  openUntil: string
  amenities: string[]
  image: string
  rating: number
  reviews: number
  lastUpdated: string
  studyType: string
}

/**
 * Mock ride data for UC campuses
 * These rides are specific to UC campuses and their local airports
 */
export const MOCK_RIDES: MockRide[] = [
  {
    id: 1,
    destination: "San Francisco International Airport (SFO)",
    departureLocation: "UC Berkeley Campus",
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
    notes: "Leaving from UC Berkeley campus, can pick up from dorms if needed. Have space for 2 large suitcases.",
  },
  {
    id: 2,
    destination: "Oakland International Airport (OAK)",
    departureLocation: "UC Berkeley Memorial Stadium",
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
    destination: "Los Angeles International Airport (LAX)",
    departureLocation: "UCLA Campus Center",
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
  {
    id: 4,
    destination: "San Diego International Airport (SAN)",
    departureLocation: "UC San Diego Library",
    date: "2024-07-28",
    time: "16:00",
    spots: 2,
    totalSpots: 4,
    price: "$20",
    originalPrice: "$80",
    creator: {
      name: "David Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
      ridesCompleted: 10,
    },
    car: "Honda Accord - Black",
    notes: "Heading to SAN for evening flight. Can pick up from UCSD area.",
  },
  {
    id: 5,
    destination: "Sacramento International Airport (SMF)",
    departureLocation: "UC Davis Memorial Union",
    date: "2024-07-29",
    time: "08:00",
    spots: 3,
    totalSpots: 5,
    price: "$12",
    originalPrice: "$60",
    creator: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      ridesCompleted: 18,
    },
    car: "Toyota Prius - Silver",
    notes: "Early morning ride to SMF. Quiet ride, good for studying.",
  },
  {
    id: 6,
    destination: "San Jose International Airport (SJC)",
    departureLocation: "UC Santa Cruz Campus",
    date: "2024-07-30",
    time: "12:30",
    spots: 1,
    totalSpots: 3,
    price: "$15",
    originalPrice: "$45",
    creator: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.6,
      ridesCompleted: 7,
    },
    car: "Ford Focus - Blue",
    notes: "Midday ride to San Jose airport. Can make stops if needed.",
  }
]

/**
 * Mock my rides data for UC campuses
 */
export const MOCK_MY_RIDES: MockMyRide[] = [
  {
    id: 4,
    destination: "San Francisco International Airport (SFO)",
    departureLocation: "UC Berkeley Campus",
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
  }
]

/**
 * Mock study spots data for UC campuses
 */
export const MOCK_STUDY_SPOTS: MockStudySpot[] = [
  {
    id: 1,
    name: "UC Berkeley Main Library - Silent Floor",
    location: "UC Berkeley Campus, 3rd Floor",
    occupancy: 25,
    capacity: 120,
    openUntil: "23:00",
    amenities: ["Silent", "Wifi", "Power Outlets", "Individual Desks"],
    image: "/placeholder.svg?height=200&width=300&text=UC+Berkeley+Library",
    rating: 4.8,
    reviews: 156,
    lastUpdated: "2 min ago",
    studyType: "Individual",
  },
  {
    id: 2,
    name: "UCLA Student Union Café",
    location: "UCLA Campus, Ground Floor",
    occupancy: 75,
    capacity: 80,
    openUntil: "22:00",
    amenities: ["Coffee", "Food", "Wifi", "Group Tables", "Moderate Noise"],
    image: "/placeholder.svg?height=200&width=300&text=UCLA+Student+Union",
    rating: 4.2,
    reviews: 89,
    lastUpdated: "5 min ago",
    studyType: "Social",
  },
  {
    id: 3,
    name: "UC Davis Engineering Building - Study Lounge",
    location: "UC Davis Campus, 2nd Floor",
    occupancy: 40,
    capacity: 60,
    openUntil: "00:00",
    amenities: ["Quiet", "Power Outlets", "Whiteboards", "Group Tables", "24/7 Access"],
    image: "/placeholder.svg?height=200&width=300&text=UC+Davis+Engineering",
    rating: 4.6,
    reviews: 203,
    lastUpdated: "1 min ago",
    studyType: "Group",
  },
  {
    id: 4,
    name: "UC San Diego Science Center - Collaboration Space",
    location: "UC San Diego Campus, 1st Floor",
    occupancy: 90,
    capacity: 45,
    openUntil: "21:00",
    amenities: ["Group Tables", "Wifi", "Presentation Screens", "Moderate Noise"],
    image: "/placeholder.svg?height=200&width=300&text=UC+San+Diego+Science",
    rating: 4.4,
    reviews: 67,
    lastUpdated: "3 min ago",
    studyType: "Group",
  },
  {
    id: 5,
    name: "UC Santa Cruz Business School - Quiet Study",
    location: "UC Santa Cruz Campus, 4th Floor",
    occupancy: 15,
    capacity: 30,
    openUntil: "20:00",
    amenities: ["Silent", "Wifi", "Power Outlets", "Individual Carrels"],
    image: "/placeholder.svg?height=200&width=300&text=UC+Santa+Cruz+Business",
    rating: 4.9,
    reviews: 234,
    lastUpdated: "1 min ago",
    studyType: "Individual",
  }
] 