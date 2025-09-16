-- Fix RLS policies for user signup
-- This allows users to insert their own profile during signup

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view profiles in their university" ON user_profiles;

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

