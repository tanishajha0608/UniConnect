# 🚀 UniConnect - University Ride Sharing & Study Spot Platform

A comprehensive platform for university students to share rides, find study spots, and connect with their campus community.

## ✨ Features

- **🚗 Ride Sharing**: Create and join rides to airports, events, and destinations
- **📚 Study Spots**: Find and check into study locations with real-time occupancy
- **👥 University Community**: Connect with verified university students
- **💬 Messaging**: Direct messaging between users
- **⭐ Reviews & Ratings**: Rate rides and study spots
- **🔔 Notifications**: Real-time notifications for ride requests and updates
- **🏫 Multi-University Support**: Works across thousands of US universities

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Radix UI, shadcn/ui
- **Authentication**: Supabase Auth with university email verification
- **Database**: PostgreSQL with Row Level Security

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (You have v20.13.1 ✅)
- npm (You have it ✅)
- Supabase CLI (Installed via Homebrew ✅)

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/Login with GitHub
   - Create a new project named `uniconnect`
   - Choose your region and set a database password

2. **Get Your Credentials**:
   - Go to Settings → API in your Supabase dashboard
   - Copy the Project URL and anon/public key

3. **Create Environment File**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_key_here
   ```

### 3. Set Up Database

1. **Run Database Scripts**:
   - Go to your Supabase dashboard → SQL Editor
   - Run each script in order:
     ```sql
     -- Run these in order:
     -- 1. Create tables
     -- 2. Create functions and triggers
     -- 3. Set up row-level security
     -- 4. Seed sample data
     ```

2. **Configure Authentication**:
   - Go to Authentication → Settings
   - Enable "Enable email confirmations"
   - Add `http://localhost:3000` to redirect URLs

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
uniconnect/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── rides/         # Ride management
│   │   ├── study-spots/   # Study spot operations
│   │   ├── users/         # User management
│   │   └── ...
│   ├── [university]/      # University-specific pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── rides/         # Ride listings
│   │   └── study-spots/   # Study spot listings
│   ├── login/             # Authentication
│   └── signup/
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client & types
│   ├── auth.ts           # Authentication helpers
│   └── ...
├── scripts/               # Database setup
│   ├── 01-create-tables.sql
│   ├── 02-create-functions.sql
│   ├── 03-row-level-security.sql
│   └── 04-seed-data.sql
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main tables:

- **universities**: University information and email domains
- **user_profiles**: Extended user profiles with university association
- **vehicles**: User vehicle information for ride sharing
- **rides**: Ride listings with departure/destination details
- **ride_requests**: Ride join requests and status
- **study_spots**: Study location information and amenities
- **study_spot_checkins**: Real-time occupancy tracking
- **reviews**: User ratings and reviews
- **messages**: Direct messaging between users
- **notifications**: System notifications

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **University Email Verification**: Only university emails allowed
- **User Authentication**: Secure login with Supabase Auth
- **Data Isolation**: Users can only access data from their university

## 🧪 Testing the Application

1. **Sign Up**: Use a university email address
2. **Verify Email**: Check your email and confirm
3. **Complete Profile**: Add your information
4. **Create a Ride**: Test the ride sharing feature
5. **Find Study Spots**: Check into study locations
6. **Send Messages**: Test the messaging system

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your environment variables
3. Check Supabase logs in the dashboard
4. Review the setup guide in `setup.md`

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time ride tracking
- [ ] Payment integration
- [ ] Advanced study spot analytics
- [ ] University admin dashboard
- [ ] Integration with university systems

---

**Built with ❤️ for university students everywhere**

---

## 🚦 **What You Can Do**

### **Option 1: Use an Organization**
- If you have access to an organization (like `EcoCar-CAV`), you can fork the repo there (if you have permission).

### **Option 2: Duplicate the Repo Manually**
If you want a new repo under your own account, you can **create a new repository and push your code to it**. Here’s how:

#### **Step-by-Step: Duplicate Your Repo Under Your Account**
1. **Create a new repository** on GitHub (e.g., `UniConnect-deploy`).
2. On your local machine, run:
    ```sh
    git clone https://github.com/tanishajha0608/UniConnect.git
    cd UniConnect
    git remote remove origin
    git remote add origin https://github.com/tanishajha0608/UniConnect-deploy.git
    git push -u origin main
    ```
3. Now you have a new, independent repo under your account.

### **Option 3: Delete Old Vercel Projects**
- If you want to keep using the original repo, delete or disconnect old Vercel projects using it until you’re under the 10-project limit.

---

## 💡 **Summary**
- **You cannot fork your own repo into your own account.**
- **You can fork to an organization** (if you have permission).
- **Or, create a new repo and push your code to it** (recommended for your case).

---

Would you like step-by-step help with creating a new repo and pushing your code to it?
