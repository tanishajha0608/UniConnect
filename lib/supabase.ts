import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client if environment variables are not set (for build time)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Types for our database
export interface University {
  id: string
  name: string
  slug: string
  city: string
  state: string
  website?: string
  email_domain: string
  type?: string
  coordinates?: [number, number]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  university_id?: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  bio?: string
  graduation_year?: number
  major?: string
  status: "pending" | "verified" | "suspended" | "banned"
  is_driver: boolean
  driver_license_verified: boolean
  emergency_contact_name?: string
  emergency_contact_phone?: string
  rating: number
  total_ratings: number
  rides_as_driver: number
  rides_as_passenger: number
  created_at: string
  updated_at: string
  university?: University
}

export interface Vehicle {
  id: string
  user_id: string
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  capacity: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Ride {
  id: string
  driver_id: string
  university_id: string
  vehicle_id?: string
  destination: string
  departure_location: string
  departure_coordinates?: [number, number]
  destination_coordinates?: [number, number]
  departure_date: string
  departure_time: string
  available_spots: number
  total_spots: number
  price_per_person: number
  notes?: string
  status: "active" | "full" | "completed" | "cancelled"
  created_at: string
  updated_at: string
  driver?: UserProfile
  vehicle?: Vehicle
  university?: University
}

export interface RideRequest {
  id: string
  ride_id: string
  passenger_id: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  created_at: string
  updated_at: string
  passenger?: UserProfile
  ride?: Ride
}

export interface StudySpot {
  id: string
  university_id: string
  name: string
  description?: string
  location: string
  building?: string
  floor?: string
  coordinates?: [number, number]
  capacity: number
  current_occupancy: number
  type: "individual" | "group" | "social" | "mixed"
  amenities: string[]
  hours_open?: string
  hours_close?: string
  is_24_7: boolean
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
  university?: University
}

export interface StudySpotCheckin {
  id: string
  study_spot_id: string
  user_id: string
  checked_in_at: string
  checked_out_at?: string
  is_active: boolean
  study_spot?: StudySpot
  user?: UserProfile
}

export interface Review {
  id: string
  reviewer_id: string
  reviewee_id: string
  ride_id?: string
  study_spot_id?: string
  rating: number
  comment?: string
  created_at: string
  reviewer?: UserProfile
  reviewee?: UserProfile
  ride?: Ride
  study_spot?: StudySpot
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  ride_id?: string
  content: string
  is_read: boolean
  created_at: string
  sender?: UserProfile
  recipient?: UserProfile
  ride?: Ride
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  data?: any
  is_read: boolean
  created_at: string
}
