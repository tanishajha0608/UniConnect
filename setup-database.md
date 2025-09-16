# Quick Database Setup

Since you're getting "university not found" errors, the database tables need to be created. Here's how to fix it:

## Option 1: Use Supabase Dashboard (Recommended)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor" in the left sidebar
4. Run these scripts in order:

### Step 1: Create Tables
Copy and paste the contents of `scripts/01-create-tables.sql` and run it.

### Step 2: Create Functions  
Copy and paste the contents of `scripts/02-create-functions.sql` and run it.

### Step 3: Set up Security
Copy and paste the contents of `scripts/03-row-level-security.sql` and run it.

### Step 4: Add Sample Data
Copy and paste the contents of `scripts/04-seed-data.sql` and run it.

## Option 2: Use Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref sxopdpzkbjsxusxtfdgf

# Run the migrations
supabase db push
```

## After Setup

Once the database is set up, the signup should work with these test universities:
- Stanford University (stanford.edu)
- UC Berkeley (berkeley.edu) 
- MIT (mit.edu)
- Harvard (harvard.edu)
- UCLA (ucla.edu)

You can use any email with these domains for testing, like:
- test@stanford.edu
- student@berkeley.edu
- etc. 