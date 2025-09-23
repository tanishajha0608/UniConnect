-- Verify current database state
-- Run this to see what we actually have

-- Check table structure
\d users;
\d universities;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('users', 'universities', 'user_profiles');

-- Check university data
SELECT id, name, slug, email_domains
FROM universities
LIMIT 5;

-- Check if we have any user_profiles table
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name = 'user_profiles'
);