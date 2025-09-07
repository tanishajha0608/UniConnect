-- Simple Database Setup for UniConnect
-- Run this in your Supabase SQL Editor to get basic functionality working

-- 1. Create universities table
CREATE TABLE IF NOT EXISTS universities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    email_domain TEXT NOT NULL,
    type TEXT DEFAULT 'Public',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert UC universities
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

-- 3. Enable RLS on universities table
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- 4. Create policy for universities (public read access)
CREATE POLICY "Universities are viewable by everyone" ON universities
    FOR SELECT USING (true);

-- 5. Verify setup
SELECT 'Basic database setup complete! Universities table created.' as status;
