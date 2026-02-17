# Supabase Setup Guide

This guide will help you set up Supabase as the backend for the Student Manager app.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Project Name**: Student Manager
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (1-2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to:
   - **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Configure the App

1. Open `lib/supabase.ts` in the project
2. Replace the placeholder values:
   ```typescript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to:
   - **SQL Editor**
2. Click "New query"
3. Copy the entire content from `database-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to create all tables

## Step 5: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable "Email" authentication
3. Configure email templates if needed

## Database Tables Created

- ✅ **users** - User profiles and settings
- ✅ **courses** - Course catalog (admin managed)
- ✅ **course_enrollments** - User's courses with colors
- ✅ **course_outlines** - Parsed syllabus data
- ✅ **weekly_content** - Week-by-week course content
- ✅ **course_schedules** - Class meeting times
- ✅ **assignments** - Exams, labs, projects, etc.
- ✅ **reminders** - User reminders with priority
- ✅ **sub_reminders** - Checklist items for reminders
- ✅ **notes** - User notes for each course/week
- ✅ **weekly_progress** - Study tracking and difficulty ratings
- ✅ **important_notes** - Critical notes with criticality levels
- ✅ **focus_sessions** - Focus mode history
- ✅ **gpa_components** - Grade tracking
- ✅ **study_plans** - AI-generated study plans
- ✅ **calendar_events** - All calendar events
- ✅ **reminder_history** - Completed reminders archive
- ✅ **admin_users** - Admin dashboard access

## Security

- ✅ Row Level Security (RLS) enabled on all user tables
- ✅ Users can only access their own data
- ✅ Courses table is publicly readable
- ✅ PINs are hashed, never stored in plain text

## Next Steps

1. Test the connection by running the app
2. Create a test user through signup
3. Add sample courses to the `courses` table
4. Configure email templates for password reset
5. Set up storage buckets for profile photos and PDFs

## Admin Dashboard

For the admin dashboard (separate web app), you'll need to:
1. Create admin users in the `admin_users` table
2. Use Supabase client with admin credentials
3. Build a separate Next.js or React web app
4. Connect to same Supabase project

## Troubleshooting

- **Connection Error**: Check if API keys are correct
- **RLS Error**: Make sure policies are created
- **Auth Error**: Enable email provider in Supabase dashboard
