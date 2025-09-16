-- Add UCR to the universities table
-- Using UUID for id field to match your database schema
INSERT INTO universities (name, slug, city, state, country, website, email_domains, type, timezone) VALUES
(
    'University of California, Riverside',
    'riverside',
    'Riverside',
    'CA',
    'USA',
    'https://ucr.edu',
    ARRAY['ucr.edu'],
    'Public',
    'America/Los_Angeles'
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    country = EXCLUDED.country,
    website = EXCLUDED.website,
    email_domains = EXCLUDED.email_domains,
    type = EXCLUDED.type,
    timezone = EXCLUDED.timezone;
