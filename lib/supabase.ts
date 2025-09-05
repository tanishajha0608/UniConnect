import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vqybfyqwcjbxlevknmofm.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxeWJmeXF3Y2J4bGV2a25tb2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzM4NzcsImV4cCI6MjA2OTA0OTg3N30.1wHYXuauMz8eAfI3vYmQBO6LHvlja-pz_URWkBx0HKk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface University {
  id: string
  name: string
  slug: string
  city: string
  state: string
  country: string
  website?: string
  email_domains: string[]
  type?: string
  timezone: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  auth_user_id?: string
  university_id?: string
  email: string
  first_name: string
  last_name: string
  display_name?: string
  phone?: string
  avatar_url?: string
  bio?: string
  graduation_year?: number
  major?: string
  minor?: string
  student_id?: string
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  is_driver: boolean
  driver_license_verified: boolean
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
  rating: number
  total_ratings: number
  rides_as_driver: number
  rides_as_passenger: number
  study_hours: number
  last_active: string
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  user_id: string
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  state: string
  capacity: number
  features?: string[]
  insurance_info?: any
  registration_info?: any
  is_verified: boolean
  verification_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Ride {
  id: string
  driver_id: string
  university_id: string
  vehicle_id?: string
  title: string
  description?: string
  origin: string
  destination: string
  departure_date: string
  departure_time: string
  return_date?: string
  return_time?: string
  available_seats: number
  total_seats: number
  price_per_seat: number
  currency: string
  is_round_trip: boolean
  allows_pets: boolean
  allows_smoking: boolean
  status: 'active' | 'full' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface RideBooking {
  id: string
  ride_id: string
  passenger_id: string
  seats_requested: number
  pickup_location?: string
  dropoff_location?: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

export interface StudySpot {
  id: string
  university_id: string
  name: string
  description?: string
  location: string
  building?: string
  floor?: string
  room_number?: string
  capacity: number
  current_occupancy: number
  type: 'individual' | 'group' | 'social' | 'mixed' | 'quiet' | 'collaborative'
  amenities?: string[]
  noise_level: 'quiet' | 'moderate' | 'loud'
  lighting: 'natural' | 'fluorescent' | 'dim'
  hours_open?: string
  hours_close?: string
  is_24_7: boolean
  is_wheelchair_accessible: boolean
  image_urls?: string[]
  tags?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  study_spot_id: string
  user_id: string
  start_time: string
  end_time?: string
  duration_minutes?: number
  study_subject?: string
  study_partners?: string[]
  is_active: boolean
  created_at: string
}

export interface Review {
  id: string
  reviewer_id: string
  reviewee_id: string
  ride_id?: string
  study_spot_id?: string
  rating: number
  title?: string
  comment?: string
  tags?: string[]
  is_anonymous: boolean
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  recipient_id: string
  ride_id?: string
  content: string
  message_type: 'text' | 'image' | 'location'
  metadata?: any
  is_read: boolean
  read_at?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'ride_request' | 'ride_confirmed' | 'study_spot_full' | 'message' | 'system'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  data?: any
  is_read: boolean
  read_at?: string
  expires_at?: string
  created_at: string
}

// Backward compatibility types
export interface UserProfile extends User {}
export interface RideRequest extends RideBooking {}
