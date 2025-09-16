-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ride_requests_updated_at BEFORE UPDATE ON ride_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_spots_updated_at BEFORE UPDATE ON study_spots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update study spot occupancy
CREATE OR REPLACE FUNCTION update_study_spot_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- User checked in
        UPDATE study_spots 
        SET current_occupancy = current_occupancy + 1 
        WHERE id = NEW.study_spot_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- User checked out
        IF OLD.is_active = true AND NEW.is_active = false THEN
            UPDATE study_spots 
            SET current_occupancy = GREATEST(current_occupancy - 1, 0)
            WHERE id = NEW.study_spot_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Check-in record deleted
        IF OLD.is_active = true THEN
            UPDATE study_spots 
            SET current_occupancy = GREATEST(current_occupancy - 1, 0)
            WHERE id = OLD.study_spot_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for study spot occupancy
CREATE TRIGGER update_study_spot_occupancy_trigger
    AFTER INSERT OR UPDATE OR DELETE ON study_spot_checkins
    FOR EACH ROW EXECUTE FUNCTION update_study_spot_occupancy();

-- Function to update user ratings
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- New review added
        UPDATE user_profiles 
        SET 
            rating = (
                SELECT AVG(rating)::DECIMAL(3,2) 
                FROM reviews 
                WHERE reviewee_id = NEW.reviewee_id
            ),
            total_ratings = total_ratings + 1
        WHERE id = NEW.reviewee_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Review updated
        UPDATE user_profiles 
        SET rating = (
            SELECT AVG(rating)::DECIMAL(3,2) 
            FROM reviews 
            WHERE reviewee_id = NEW.reviewee_id
        )
        WHERE id = NEW.reviewee_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Review deleted
        UPDATE user_profiles 
        SET 
            rating = COALESCE((
                SELECT AVG(rating)::DECIMAL(3,2) 
                FROM reviews 
                WHERE reviewee_id = OLD.reviewee_id
            ), 5.0),
            total_ratings = GREATEST(total_ratings - 1, 0)
        WHERE id = OLD.reviewee_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for user ratings
CREATE TRIGGER update_user_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Function to automatically check out users after 4 hours
CREATE OR REPLACE FUNCTION auto_checkout_users()
RETURNS void AS $$
BEGIN
    UPDATE study_spot_checkins 
    SET 
        is_active = false,
        checked_out_at = NOW()
    WHERE 
        is_active = true 
        AND checked_in_at < NOW() - INTERVAL '4 hours'
        AND checked_out_at IS NULL;
END;
$$ language 'plpgsql';
