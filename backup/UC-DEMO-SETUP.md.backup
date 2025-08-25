# 🎓 UniConnect UC Campus Demo Mode

## Overview
This guide will help you run UniConnect in UC campus demo mode for testing and development without needing to set up a database.

## ✅ What's Working in UC Demo Mode

### **UC Ride Sharing Features**
- ✅ Browse available rides from UC campuses (mock data)
- ✅ View ride details and driver information
- ✅ Create new UC rides (simulated)
- ✅ Request rides (demo notifications)
- ✅ View "My Rides" with sample UC data
- ✅ All action buttons work with UC demo notifications

### **UC User Interface**
- ✅ UC campus selection (Berkeley, UCLA, Stanford, etc.)
- ✅ UC user navigation with demo user (alex@berkeley.edu)
- ✅ UC signup form (simulated)
- ✅ Toast notifications for all UC actions
- ✅ Responsive design

### **UC Study Spots**
- ✅ "Coming Soon" page
- ✅ Redirects to UC ride sharing

## 🚀 Quick Start

### **Step 1: Install Dependencies**
```bash
npm install --legacy-peer-deps
```

### **Step 2: Start Development Server**
```bash
npm run dev
```

### **Step 3: Open the Application**
Navigate to `http://localhost:3000`

## 🎯 UC Demo Features to Test

### **1. UC Campus Selection**
- Go to the home page
- Select a UC campus from the dropdown (Berkeley, UCLA, Stanford, etc.)
- Navigate to the UC campus dashboard

### **2. UC Ride Sharing**
- Click on "Ride Sharing" in the navigation
- Browse available rides in the "Available Rides" tab
- Try clicking "Request Ride" and "Message" buttons
- Switch to "My Rides" tab to see sample UC rides
- Try the "Create Ride" tab to test the UC form

### **3. UC User Actions**
- Click on the user avatar in the top right
- Try "Profile", "Settings", and "Log out" options
- All actions show UC demo notifications

### **4. UC Signup Process**
- Click "Sign Up" on the home page
- Fill out the form with any UC data
- Submit to see the UC demo signup process

## 📱 UC Demo Data

### **Sample UC Rides**
- San Francisco International Airport (SFO) - $15 (from UC Berkeley)
- Oakland International Airport (OAK) - $18 (from UC Berkeley)
- Los Angeles International Airport (LAX) - $22 (from UCLA)
- San Diego International Airport (SAN) - $20 (from UC San Diego)
- Sacramento International Airport (SMF) - $12 (from UC Davis)
- San Jose International Airport (SJC) - $15 (from UC Santa Cruz)

### **UC Campuses Available**
- University of California, Berkeley
- University of California, Los Angeles
- Stanford University
- Massachusetts Institute of Technology
- Harvard University

### **UC Demo User**
- Name: Alex Johnson
- Email: alex@berkeley.edu
- Campus: UC Berkeley

## 🔧 UC Demo Mode Indicators

Throughout the application, you'll see:
- "(Demo)" labels in titles
- "UC Demo Mode" toast notifications
- UC campus-specific user information
- UC Berkeley student badge

## 🚫 What's Not Working (Expected)

- Real UC user authentication
- Database persistence
- Email verification
- Real UC ride booking
- Study spots functionality (redirects to "Coming Soon")

## 🎨 UC Customization

### **Adding More UC Demo Rides**
Edit `lib/mock-data.ts` to add more UC sample rides:

```typescript
export const MOCK_RIDES: MockRide[] = [
  // Add your custom UC rides here
  {
    id: 7,
    destination: "Your Custom UC Destination",
    departureLocation: "UC Berkeley Campus",
    date: "2024-08-15",
    time: "10:00",
    spots: 2,
    totalSpots: 4,
    price: "$25",
    originalPrice: "$100",
    creator: {
      name: "Your UC Name",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      ridesCompleted: 20,
    },
    car: "Your UC Car Model",
    notes: "Your UC custom notes",
  }
]
```

### **Changing UC Demo User**
Edit `components/user-nav.tsx` to change the UC demo user:

```typescript
const user = {
  name: "Your UC Name",
  email: "your.email@berkeley.edu",
  image: "/your-uc-avatar.jpg",
}
```

## 🔄 Switching to UC Production Mode

When you're ready to use real UC data:

1. **Set up Supabase database** (see `PRODUCTION-SETUP.md`)
2. **Configure environment variables**
3. **Update the code** to use database queries instead of mock data
4. **Test with real UC authentication**

## 🐛 UC Troubleshooting

### **Common UC Issues**

1. **"Page Not Found" errors**
   - Make sure you're using valid UC campus slugs (berkeley, ucla, stanford, etc.)

2. **Buttons not working**
   - Check browser console for errors
   - Make sure all dependencies are installed

3. **Styling issues**
   - Run `npm run dev` to ensure Tailwind CSS is compiled

### **Getting UC Help**

1. Check the browser console for errors
2. Verify all dependencies are installed
3. Make sure you're running the latest version of Node.js

---

**🎓 Enjoy testing UniConnect in UC campus demo mode!** 