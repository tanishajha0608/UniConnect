# Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# For server-side operations (optional)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (optional)

## Database Setup

The application expects the following tables in your Supabase database:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  university_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Universities Table
```sql
CREATE TABLE universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'USA',
  website TEXT,
  email_domains TEXT[],
  type TEXT,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Authentication Setup

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production domain
   - **Email Templates**: Customize as needed

## Row Level Security (RLS)

Enable RLS on your tables:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Universities are public
CREATE POLICY "Universities are viewable by everyone" ON universities
  FOR SELECT USING (true);
```

## Testing the Setup

1. Start the development server: `npm run dev`
2. Go to `/signup` and try creating an account with a UC email
3. Check your Supabase dashboard to see if the user was created
4. Check your email for the verification link

## Troubleshooting

### Common Issues

1. **"Invalid email domain"** - Make sure you're using a valid UC email domain
2. **"University not found"** - Check that the universities table is populated
3. **"Failed to create account"** - Check your Supabase credentials and database setup

### Debug Mode

To enable debug logging, add this to your `.env.local`:
```bash
NEXT_PUBLIC_DEBUG=true
```

## Production Deployment

For production deployment:

1. Update your Supabase project settings:
   - **Site URL**: Your production domain
   - **Redirect URLs**: Add your production domain
2. Update environment variables in your deployment platform
3. Ensure RLS policies are properly configured
4. Test the authentication flow thoroughly