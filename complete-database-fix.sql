-- Complete Database Fix for UniConnect
-- Run this in your Supabase SQL Editor

-- 1. First, make sure all tables exist (run 01-create-tables.sql first if not done)
-- 2. Then run this script to fix RLS policies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view profiles in their university" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Create new policies that allow signup
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

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

-- Make sure universities table has the required data
-- Insert UC universities if they don't exist
INSERT INTO universities (id, name, slug, city, state, email_domain, type, is_active) VALUES
('uc-berkeley', 'University of California, Berkeley', 'berkeley', 'Berkeley', 'CA', 'berkeley.edu', 'Public', true),
('uc-davis', 'University of California, Davis', 'davis', 'Davis', 'CA', 'ucdavis.edu', 'Public', true),
('ucla', 'University of California, Los Angeles', 'ucla', 'Los Angeles', 'CA', 'ucla.edu', 'Public', true),
('uc-san-diego', 'University of California, San Diego', 'ucsd', 'San Diego', 'CA', 'ucsd.edu', 'Public', true),
('uc-irvine', 'University of California, Irvine', 'uci', 'Irvine', 'CA', 'uci.edu', 'Public', true),
('uc-santa-barbara', 'University of California, Santa Barbara', 'ucsb', 'Santa Barbara', 'CA', 'ucsb.edu', 'Public', true),
('uc-riverside', 'University of California, Riverside', 'riverside', 'Riverside', 'CA', 'ucr.edu', 'Public', true),
('uc-santa-cruz', 'University of California, Santa Cruz', 'ucsc', 'Santa Cruz', 'CA', 'ucsc.edu', 'Public', true),
('uc-merced', 'University of California, Merced', 'merced', 'Merced', 'CA', 'ucmerced.edu', 'Public', true),
('uc-san-francisco', 'University of California, San Francisco', 'ucsf', 'San Francisco', 'CA', 'ucsf.edu', 'Public', true)
ON CONFLICT (id) DO NOTHING;

-- Verify the setup
SELECT 'Database setup complete!' as status;
