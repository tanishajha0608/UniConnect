# 🚀 UniConnect Setup Guide

## Prerequisites ✅
- Node.js v18+ (You have v20.13.1) ✅
- npm (You have it) ✅
- Supabase CLI (Installed via Homebrew) ✅

## Step 1: Set Up Supabase Database

### 1.1 Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `uniconnect`
   - Database Password: Create a strong password
   - Region: Choose closest to you
6. Click "Create new project"

### 1.2 Get Your Project Credentials
1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - anon/public key

### 1.3 Configure Environment Variables
Edit `.env.local` and add your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Database URL (for Supabase CLI)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key_here
```

## Step 2: Set Up Database Schema

### 2.1 Initialize Supabase CLI
```bash
supabase login
```

### 2.2 Run Database Scripts
The database schema is already prepared in the `scripts/` folder. You can run these manually in the Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run each script in order:
   - `scripts/01-create-tables.sql`
   - `scripts/02-create-functions.sql`
   - `scripts/03-row-level-security.sql`
   - `scripts/04-seed-data.sql`

## Step 3: Configure Authentication

### 3.1 Set Up Email Templates
In Supabase Dashboard → Authentication → Email Templates:
- Customize the confirmation email template
- Set up password reset template

### 3.2 Configure Auth Settings
In Supabase Dashboard → Authentication → Settings:
- Enable "Enable email confirmations"
- Set redirect URLs to include `http://localhost:3000`

## Step 4: Run the Application

### 4.1 Start Development Server
```bash
npm run dev
```

### 4.2 Access the Application
Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

### 5.1 Create Test Data
1. Sign up with a university email
2. Verify your email
3. Complete your profile
4. Test creating rides and study spots

### 5.2 Test Features
- User registration and login
- University selection
- Ride creation and requests
- Study spot check-ins
- Messaging system
- Notifications

## Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure your DATABASE_URL is correct
2. **Authentication**: Check that email confirmations are enabled
3. **CORS Issues**: Verify your Supabase URL is correct
4. **RLS Policies**: Make sure row-level security is properly configured

### Getting Help:
- Check Supabase logs in the dashboard
- Review browser console for errors
- Verify environment variables are loaded

## Next Steps

Once everything is working:
1. Add real university data to the database
2. Configure email providers for notifications
3. Set up file upload for avatars and study spot images
4. Deploy to production (Vercel recommended)

## File Structure Overview

```
uniconnect/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── [university]/      # University-specific pages
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # React components
├── lib/                   # Utility functions
├── scripts/               # Database setup scripts
└── public/               # Static assets
```

## Features Included

✅ **Authentication System**
- University email verification
- User profiles
- Password reset

✅ **Ride Sharing**
- Create and join rides
- Request system
- Driver verification
- Vehicle management

✅ **Study Spots**
- Real-time occupancy tracking
- Check-in/check-out system
- Amenity filtering

✅ **Messaging & Notifications**
- Direct messaging
- Push notifications
- Email notifications

✅ **Reviews & Ratings**
- User ratings
- Ride reviews
- Study spot reviews

✅ **University Management**
- Multi-university support
- University-specific content
- Email domain verification 