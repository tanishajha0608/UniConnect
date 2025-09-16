-- Safe Universities Setup - works with existing table structure
-- Run this in your Supabase SQL Editor

-- First, let's see what columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'universities' 
ORDER BY ordinal_position;

-- If the table doesn't have the right columns, let's add them
-- Add email_domain column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'universities' AND column_name = 'email_domain') THEN
        ALTER TABLE universities ADD COLUMN email_domain TEXT;
    END IF;
END $$;

-- Add other missing columns if needed
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'universities' AND column_name = 'type') THEN
        ALTER TABLE universities ADD COLUMN type TEXT DEFAULT 'Public';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'universities' AND column_name = 'is_active') THEN
        ALTER TABLE universities ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Now insert the universities data
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

-- Enable RLS if not already enabled
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Create policy for universities (public read access)
DROP POLICY IF EXISTS "Universities are viewable by everyone" ON universities;
CREATE POLICY "Universities are viewable by everyone" ON universities
    FOR SELECT USING (true);

SELECT 'Universities setup complete!' as status;

