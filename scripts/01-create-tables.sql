-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_status AS ENUM ('pending', 'verified', 'suspended', 'banned');
CREATE TYPE ride_status AS ENUM ('active', 'full', 'completed', 'cancelled');
CREATE TYPE ride_request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
CREATE TYPE study_spot_type AS ENUM ('individual', 'group', 'social', 'mixed');

-- Universities table
CREATE TABLE universities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    website TEXT,
    email_domain TEXT NOT NULL, -- e.g., 'stanford.edu'
    type TEXT, -- e.g., 'Public', 'Private'
    coordinates POINT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    graduation_year INTEGER,
    major TEXT,
    status user_status DEFAULT 'pending',
    is_driver BOOLEAN DEFAULT false,
    driver_license_verified BOOLEAN DEFAULT false,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_ratings INTEGER DEFAULT 0,
    rides_as_driver INTEGER DEFAULT 0,
    rides_as_passenger INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT NOT NULL,
    license_plate TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 4,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rides table
CREATE TABLE rides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    destination TEXT NOT NULL,
    departure_location TEXT NOT NULL,
    departure_coordinates POINT,
    destination_coordinates POINT,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    available_spots INTEGER NOT NULL,
    total_spots INTEGER NOT NULL,
    price_per_person DECIMAL(10,2) NOT NULL,
    notes TEXT,
    status ride_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ride requests table
CREATE TABLE ride_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
    passenger_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    message TEXT,
    status ride_request_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ride_id, passenger_id)
);

-- Study spots table
CREATE TABLE study_spots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    building TEXT,
    floor TEXT,
    coordinates POINT,
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    type study_spot_type DEFAULT 'mixed',
    amenities TEXT[], -- Array of amenities like ['wifi', 'power_outlets', 'quiet']
    hours_open TIME,
    hours_close TIME,
    is_24_7 BOOLEAN DEFAULT false,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study spot check-ins table
CREATE TABLE study_spot_checkins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    study_spot_id UUID REFERENCES study_spots(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checked_out_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Reviews table (for both rides and study spots)
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reviewer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
    study_spot_id UUID REFERENCES study_spots(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT review_target_check CHECK (
        (ride_id IS NOT NULL AND study_spot_id IS NULL) OR
        (ride_id IS NULL AND study_spot_id IS NOT NULL)
    )
);

-- Messages table
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'ride_request', 'ride_accepted', 'study_spot_full', etc.
    data JSONB, -- Additional data for the notification
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_universities_slug ON universities(slug);
CREATE INDEX idx_universities_email_domain ON universities(email_domain);
CREATE INDEX idx_user_profiles_university ON user_profiles(university_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_rides_university ON rides(university_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_date ON rides(departure_date);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_ride_requests_ride ON ride_requests(ride_id);
CREATE INDEX idx_ride_requests_passenger ON ride_requests(passenger_id);
CREATE INDEX idx_study_spots_university ON study_spots(university_id);
CREATE INDEX idx_study_spot_checkins_spot ON study_spot_checkins(study_spot_id);
CREATE INDEX idx_study_spot_checkins_user ON study_spot_checkins(user_id);
CREATE INDEX idx_study_spot_checkins_active ON study_spot_checkins(is_active);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
