-- Insert sample universities
INSERT INTO universities (name, slug, city, state, email_domain, type, website) VALUES
('Stanford University', 'stanford', 'Stanford', 'CA', 'stanford.edu', 'Private', 'https://www.stanford.edu'),
('University of California, Berkeley', 'berkeley', 'Berkeley', 'CA', 'berkeley.edu', 'Public', 'https://www.berkeley.edu'),
('Massachusetts Institute of Technology', 'mit', 'Cambridge', 'MA', 'mit.edu', 'Private', 'https://www.mit.edu'),
('Harvard University', 'harvard', 'Cambridge', 'MA', 'harvard.edu', 'Private', 'https://www.harvard.edu'),
('University of California, Los Angeles', 'ucla', 'Los Angeles', 'CA', 'ucla.edu', 'Public', 'https://www.ucla.edu');

-- Insert sample study spots for Stanford
INSERT INTO study_spots (university_id, name, description, location, building, capacity, type, amenities, hours_open, hours_close, image_url) 
SELECT 
    u.id,
    'Green Library - East Wing',
    'Quiet study area with individual carrels and natural lighting',
    'Main Quad, East Side',
    'Green Library',
    150,
    'individual',
    ARRAY['wifi', 'power_outlets', 'quiet', 'individual_desks'],
    '07:00'::TIME,
    '23:00'::TIME,
    '/placeholder.svg?height=200&width=300&text=Green+Library'
FROM universities u WHERE u.slug = 'stanford'

UNION ALL

SELECT 
    u.id,
    'Tresidder Union - Study Lounge',
    'Collaborative study space with comfortable seating and café nearby',
    'Tresidder Memorial Union',
    'Tresidder Union',
    80,
    'social',
    ARRAY['wifi', 'coffee', 'group_tables', 'moderate_noise'],
    '06:00'::TIME,
    '22:00'::TIME,
    '/placeholder.svg?height=200&width=300&text=Tresidder+Study+Lounge'
FROM universities u WHERE u.slug = 'stanford'

UNION ALL

SELECT 
    u.id,
    'Engineering Library',
    'Technical resources and quiet study environment for STEM students',
    'Shriram Center',
    'Shriram Center',
    100,
    'individual',
    ARRAY['wifi', 'power_outlets', 'quiet', 'whiteboards', 'technical_resources'],
    '08:00'::TIME,
    '00:00'::TIME,
    '/placeholder.svg?height=200&width=300&text=Engineering+Library'
FROM universities u WHERE u.slug = 'stanford';

-- Insert sample study spots for other universities
INSERT INTO study_spots (university_id, name, description, location, building, capacity, type, amenities, hours_open, hours_close) 
SELECT 
    u.id,
    'Main Library - Silent Floor',
    'Quiet study area for focused individual work',
    'Central Campus',
    'Main Library',
    120,
    'individual',
    ARRAY['wifi', 'power_outlets', 'quiet'],
    '07:00'::TIME,
    '23:00'::TIME
FROM universities u WHERE u.slug IN ('berkeley', 'mit', 'harvard', 'ucla');
