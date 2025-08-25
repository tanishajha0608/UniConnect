#!/bin/bash

echo "🚀 UniConnect Quick Start Script"
echo "=================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here"
    echo "DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres"
    echo "NEXTAUTH_URL=http://localhost:3000"
    echo "NEXTAUTH_SECRET=your_random_secret_key_here"
    echo ""
    echo "See setup.md for detailed instructions."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "Please install it with: brew install supabase/tap/supabase"
    exit 1
fi

echo "✅ Dependencies installed"
echo "✅ Supabase CLI available"

# Start the development server
echo "🚀 Starting development server..."
echo "Open http://localhost:3000 in your browser"
echo ""
echo "📋 Next steps:"
echo "1. Set up your Supabase project (see setup.md)"
echo "2. Run the database scripts in Supabase SQL Editor"
echo "3. Configure authentication settings"
echo "4. Test the application features"
echo ""

npm run dev 