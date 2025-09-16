# UC Connect Setup Guide

## 🎯 **UC-Focused App Setup**

Your app is now configured specifically for University of California students! The database schema has been completely set up with all UC campuses and sample data.

## ✅ **Database Already Configured**

Your database is already set up with:
- ✅ All 10 UC campuses
- ✅ Sample UC students
- ✅ Sample rides between campuses and airports
- ✅ Sample study spots at each campus
- ✅ Proper relationships and constraints

## 🏫 **UC Campuses Supported**

The app now supports all 10 UC campuses:

1. **UC Berkeley** (`/berkeley`)
2. **UC Davis** (`/davis`) 
3. **UC Irvine** (`/irvine`)
4. **UCLA** (`/ucla`)
5. **UC Merced** (`/merced`)
6. **UC Riverside** (`/riverside`)
7. **UC San Diego** (`/ucsd`)
8. **UC San Francisco** (`/ucsf`)
9. **UC Santa Barbara** (`/ucsb`)
10. **UC Santa Cruz** (`/ucsc`)

## 🚗 **Sample UC Ride Scenarios**

- **UC Berkeley → Oakland Airport**: $18 (Prius)
- **UC San Diego → San Diego Airport**: $15 (Civic) 
- **UC Davis → Sacramento Airport**: $12 (Tesla)
- **UC Irvine → John Wayne Airport**: $15 (Subaru)
- **UC Riverside → Ontario Airport**: $20 (Ford)

## 📚 **Sample UC Study Spots**

- **UC Berkeley**: Doe Memorial Library - Main Reading Room
- **UCLA**: Powell Library - Reading Room
- **UC San Diego**: Geisel Library - Silent Study Floor
- **UC Irvine**: Langson Library - Study Commons
- **UC Davis**: Shields Library - Quiet Study
- **UC Santa Barbara**: UCSB Library - 24/7 Study Space

## 🧪 **Test the App**

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Visit the homepage**: `http://localhost:3000`
   - You'll see UC campus selection buttons

3. **Test individual campuses**:
   - `http://localhost:3000/berkeley`
   - `http://localhost:3000/ucla`
   - `http://localhost:3000/ucsd`

## 🔧 **What's Updated**

✅ **Database Schema**: Complete schema with all tables and relationships
✅ **TypeScript Types**: Updated to match the new database structure
✅ **API Routes**: Updated to fetch from Supabase
✅ **Server Components**: Converted to fetch real data
✅ **UC Data**: Real UC campuses, students, rides, and study spots
✅ **UC Branding**: All messaging focused on UC system

## 🎨 **UC-Specific Features**

- **UC-focused messaging**: "UC Students Connect"
- **All 10 UC campuses**: Direct navigation
- **Realistic UC scenarios**: Campus-to-airport rides
- **Famous study spots**: Actual UC library locations
- **UC student profiles**: Realistic majors and interests
- **Real-time data**: Fetched from your Supabase database

## 🚀 **Next Steps**

1. **Test the app** with different UC campuses
2. **Add more UC campus data** as needed
3. **Customize further** with UC-specific features
4. **Add authentication** when ready

## 📞 **Support**

If you encounter any issues:
1. Check the browser console for errors
2. Verify the Supabase connection
3. Test individual campus URLs
4. Check the database tables in Supabase dashboard

Your app is now ready for UC students! 🎓

## 🗄️ **Database Tables**

Your database includes:
- `universities` - All 10 UC campuses
- `users` - Sample UC students
- `vehicles` - Student vehicles
- `rides` - Campus-to-airport rides
- `ride_bookings` - Ride reservations
- `study_spots` - Campus study locations
- `study_sessions` - Active study sessions
- `reviews` - User reviews
- `messages` - User messaging
- `notifications` - System notifications
- `user_verifications` - Student verification
- `user_sessions` - User activity tracking 