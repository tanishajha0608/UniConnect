-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_spot_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view profiles in their university" ON user_profiles
    FOR SELECT USING (
        university_id IN (
            SELECT university_id FROM user_profiles WHERE id = auth.uid()
        )
    );

-- Vehicles policies
CREATE POLICY "Users can manage their own vehicles" ON vehicles
    FOR ALL USING (auth.uid() = user_id);

-- Rides policies
CREATE POLICY "Users can view rides at their university" ON rides
    FOR SELECT USING (
        university_id IN (
            SELECT university_id FROM user_profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can create rides" ON rides
    FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their own rides" ON rides
    FOR UPDATE USING (auth.uid() = driver_id);

-- Ride requests policies
CREATE POLICY "Users can view ride requests for their rides" ON ride_requests
    FOR SELECT USING (
        ride_id IN (SELECT id FROM rides WHERE driver_id = auth.uid())
        OR passenger_id = auth.uid()
    );

CREATE POLICY "Users can create ride requests" ON ride_requests
    FOR INSERT WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "Users can update their own ride requests" ON ride_requests
    FOR UPDATE USING (
        passenger_id = auth.uid() 
        OR ride_id IN (SELECT id FROM rides WHERE driver_id = auth.uid())
    );

-- Study spot check-ins policies
CREATE POLICY "Users can manage their own check-ins" ON study_spot_checkins
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view check-ins at their university" ON study_spot_checkins
    FOR SELECT USING (
        study_spot_id IN (
            SELECT id FROM study_spots 
            WHERE university_id IN (
                SELECT university_id FROM user_profiles WHERE id = auth.uid()
            )
        )
    );

-- Reviews policies
CREATE POLICY "Users can view reviews" ON reviews
    FOR SELECT USING (
        reviewer_id = auth.uid() 
        OR reviewee_id = auth.uid()
        OR reviewee_id IN (
            SELECT id FROM user_profiles 
            WHERE university_id IN (
                SELECT university_id FROM user_profiles WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages
    FOR SELECT USING (
        sender_id = auth.uid() OR recipient_id = auth.uid()
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);
