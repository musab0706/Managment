# Student Manager App 📚

A comprehensive iOS student management application built with React Native and Expo. Designed specifically for university students to manage courses, reminders, notes, focus time, and academic progress.

## ✨ Features

### 🔐 Authentication & Onboarding
- **Login**: Student ID or First Name + 4-digit PIN
- **Signup**: Complete profile with university email validation (.edu, .ca, academic domains)
- **6-Question Personalization Flow**:
  1. Theme Selection (Light/Dark)
  2. Notification Intensity (with haptic feedback preview)
  3. Major Selection (University of Guelph majors - 119 options)
  4. Sound Settings
  5. Vibration Settings
  6. Course Selection (300+ UofG courses with custom color picker)

### 🏠 Dashboard (Home Tab)
- **Today's schedule** with color-coded classes
- **Upcoming deadlines** with GPA weights
- **Quick stats**: Courses, reminders, focus points
- **Quick actions**: Add note, new reminder, start focus, view GPA
- **Welcome greeting** with current date

### 📅 Calendar Tab
- **Color-coded events** by course
- **Smart dot system**: Size indicates GPA weight, white ring for important events
- **Month navigation** with calendar grid
- **Event details** when clicking on dates
- **Course color legend**
- **Automatically populated** from enrolled courses

### 📝 Notes Tab
- **Auto-created sections** for each enrolled course
- **Three-level navigation**: Courses → Weeks → Week Details
- **Weekly checklists**:
  - Chapter tracking with checkboxes
  - Study completion tracking
  - Difficulty rating (1-5 stars, syncs with Study Planner)
- **Very Important Notes** with criticality levels (High/Medium/Low)
- **Unlimited Cheat Sheet** per course for exam prep
- **Week Summary** with character limit (1200 characters)

### ⏰ Advanced Reminder System
- **Multiple types**: Midterm, Final, Quiz, Lab, Assignment, Project
- **Priority levels**: High, Medium, Low (with custom sound/vibration)
- **Priority filtering**: View all or filter by priority
- **Sub-reminders**: Checklist items with individual completion tracking
- **Recurring reminders**: Daily, weekly, monthly
- **Templates**: Quick setup for common reminder types
- **Auto-reminders**: From course assignments
- **GPA integration**: Link reminders to grade components (shows % weight)
- **History tracking**: View completed reminders and grades
- **Visual priority badges**: Color-coded HIGH/MEDIUM/LOW indicators

### 🎯 In-App Focus Mode
- **Gamified points system**: 1 point per hour of focus
- **Minimalist interface**: Shows only current time in large font
- **Session tracking**: View focus history and stats
- **10-second hold to exit**: Prevents accidental exits with progress animation
- **No points for early exit**: Encourages full sessions
- **Lifetime points displayed** on profile
- **Today & weekly stats**: Track daily and weekly focus time
- **Recent sessions**: History of past focus sessions

### 👤 User Profile Tab
- **Profile photo circle** with initials
- **Required info**: Real name, school email, university, major
- **Optional info**: Photo, bio, semester
- **Private profile**: Only admin can see users
- **Focus statistics**: Lifetime points and total focus time
- **Academic overview**: Courses enrolled, GPA
- **Settings menu**: Notifications, theme, edit profile, logout

### 📊 Intelligent Study Planner (Data Structure Ready)
- **Weekly difficulty ratings** (1-5 stars) for each chapter
- **Personalized study plans** before exams based on:
  - Your difficulty ratings
  - Class average ratings
  - Time until exam
  - Number of chapters to cover
- **Day-by-day breakdown**: Suggested study schedule

### 🎨 Course Color System
- **Universal color application** across entire app
- **60-color wheel palette** organized by hue (reds, oranges, yellows, greens, blues, purples, pinks)
- **Custom RGB picker** with:
  - Live color preview with large swatch
  - Hex code display
  - Individual R/G/B sliders (0-255)
  - Emoji labels for each slider
  - Back/Select buttons
- **Color persistence** for all course-related elements

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Supabase (PostgreSQL) - Configuration ready
- **State Management**: React Context API (ThemeContext)
- **UI Components**: 
  - `expo-checkbox`
  - `@react-native-community/slider`
  - `react-native-modal`
- **Notifications**: `expo-notifications` (installed, ready to configure)
- **Haptics**: `expo-haptics` (integrated in onboarding)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Xcode) or physical iOS device

### Setup

1. **Navigate to project directory**:
   ```bash
   cd c:\Users\musab\OneDrive\Desktop\projects\Managment
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Set up Supabase** (optional, for backend):
   - See `SUPABASE_SETUP.md` for detailed instructions
   - Create Supabase project
   - Run `database-schema.sql` in SQL Editor
   - Add API keys to `lib/supabase.ts`

4. **Start the development server**:
   ```bash
   npx expo start
   ```

5. **Run on iOS**:
   - Press `i` to open iOS simulator
   - Or scan QR code with Expo Go app on physical device
   - Or run `npm run ios` (requires Mac)

## 📁 Project Structure

```
Managment/
├── app/
│   ├── (auth)/           # Authentication screens
│   │   ├── index.tsx     # Login screen (updated styling)
│   │   └── signup.tsx    # Signup screen (university email validation)
│   ├── (onboarding)/     # Personalization flow
│   │   ├── intro.tsx     # Welcome message (themed)
│   │   ├── theme.tsx     # Q1: Theme selection (dynamic)
│   │   ├── notification-intensity.tsx  # Q2: Slider
│   │   ├── major.tsx     # Q3: 119 UofG majors
│   │   ├── sound-settings.tsx  # Q4: Sound
│   │   ├── vibration-settings.tsx  # Q5: Vibration
│   │   └── courses.tsx   # Q6: 300+ courses + color wheel
│   ├── (tabs)/           # Main app tabs
│   │   ├── _layout.tsx   # Tab bar with icons
│   │   ├── index.tsx     # Home/Dashboard ✅
│   │   ├── calendar.tsx  # Calendar view ✅
│   │   ├── notes.tsx     # Notes system ✅
│   │   ├── reminders.tsx # Reminders ✅
│   │   ├── focus.tsx     # Focus mode ✅
│   │   └── profile.tsx   # User profile ✅
│   └── _layout.tsx       # Root layout with ThemeProvider
├── context/
│   └── ThemeContext.tsx  # Global theme management (light/dark)
├── data/
│   └── uoguelph-courses.ts  # 300+ UofG courses (17 departments)
├── lib/
│   └── supabase.ts       # Supabase client config (needs API keys)
├── database-schema.sql   # Complete DB schema (18 tables)
├── SUPABASE_SETUP.md    # Backend setup guide
├── package.json          # Dependencies
└── README.md            # This file
```

## 🎓 University of Guelph Integration

This app includes **300+ specific courses** from the University of Guelph (2025-2026), including:
- **Engineering** (ENGG) - 20+ courses
- **Mathematics** (MATH) - 25+ courses
- **Computing** (CIS) - 20+ courses
- **Physics** (PHYS) - 15+ courses
- **Chemistry** (CHEM) - 15+ courses
- **Biology** (BIOL) - 20+ courses
- **Economics** (ECON) - 20+ courses
- **Psychology** (PSYC) - 15+ courses
- **Business, Accounting, Management, Marketing** - 100+ courses
- **Statistics, English, History, Sociology, Political Science** - 50+ courses

Also includes **119 specific undergraduate majors** from UofG's 2025-2026 Academic Calendar.

## 🗄️ Database Schema

The `database-schema.sql` file includes **18 tables**:

1. **users** - User profiles and settings
2. **courses** - Course catalog (admin managed)
3. **course_enrollments** - User's courses with colors
4. **course_outlines** - Parsed syllabus data
5. **weekly_content** - Week-by-week course content
6. **course_schedules** - Class meeting times
7. **assignments** - Exams, labs, projects, etc.
8. **reminders** - User reminders with priority
9. **sub_reminders** - Checklist items for reminders
10. **notes** - User notes for each course/week
11. **weekly_progress** - Study tracking and difficulty ratings
12. **important_notes** - Critical notes with criticality levels
13. **focus_sessions** - Focus mode history
14. **gpa_components** - Grade tracking
15. **study_plans** - AI-generated study plans
16. **calendar_events** - All calendar events
17. **reminder_history** - Completed reminders archive
18. **admin_users** - Admin dashboard access

**Security Features**:
- ✅ Row Level Security (RLS) enabled on all user tables
- ✅ Users can only access their own data
- ✅ Courses table is publicly readable
- ✅ PINs should be hashed (implementation pending)

## 🎨 Design Philosophy

- **Minimalist & Clean**: Light/dark theme with subtle shadows and glass effects
- **Student-focused**: All features designed for academic success
- **Gamification**: Points system motivates focus and productivity
- **Intelligent**: Data-driven study planning
- **Personalized**: 6-question onboarding tailors the experience
- **Private**: No social features, only admin analytics

## 🧪 Testing the App

### Test Flow:

1. **First Time User**:
   - Open app → Login screen
   - Tap "Signup Now"
   - Fill in 6 fields (email: use `.edu` or `.ca` domain)
   - Complete 6-question onboarding:
     - Choose theme (see UI change in real-time)
     - Set notification intensity (feel haptic feedback)
     - Select major from 119 UofG majors
     - Configure sound & vibration
     - Select courses from 300+ options
     - Choose colors using color wheel or custom RGB picker
   - Navigate to main app with 6 tabs

2. **Explore Features**:
   - **Home**: View dashboard with stats and quick actions
   - **Calendar**: See month view, click on dates with events
   - **Notes**: Select a course, view weeks, check chapters, rate difficulty
   - **Reminders**: View reminders with priority filters, see sub-tasks
   - **Focus**: Start a focus session, hold for 10 seconds to exit
   - **Profile**: View stats, focus points, and settings

3. **Theme Switching**:
   - Currently requires going through onboarding again
   - Theme is stored in context and persists during session

### Current Limitations (Frontend Only):
- No backend connection yet (Supabase needs setup)
- Data is hardcoded sample data
- Authentication doesn't validate credentials
- Changes don't persist after app restart

## 🚀 Next Steps

To make this a fully functional app:

### Backend (Priority 1):
- [ ] Set up Supabase project (see SUPABASE_SETUP.md)
- [ ] Connect authentication
- [ ] Implement data persistence
- [ ] Create API endpoints for CRUD operations

### Features (Priority 2):
- [ ] **Admin Dashboard** (separate web app):
  - User analytics
  - Course management
  - PDF upload and parsing
- [ ] **GPA Calculator**: Full implementation with grade tracking
- [ ] **Push Notifications**: Configure expo-notifications
- [ ] **Study Planner AI**: Implement algorithm for personalized plans
- [ ] **PDF Parsing**: Extract course outline data from uploaded PDFs

### Enhancements (Priority 3):
- [ ] Settings page functionality
- [ ] Edit profile feature
- [ ] Theme switcher in app (not just onboarding)
- [ ] Export notes to PDF
- [ ] iOS widgets
- [ ] Dark mode UI polish
- [ ] Reminder notification scheduling
- [ ] Focus mode app locking feature

## 🤝 Admin Dashboard (Separate Project)

The admin dashboard will be a **separate web application** (Next.js/React) that:
- Shows total users and active users
- Displays user list with basic info (name, email, university, major)
- **No access to**: Notes, reminders, focus data, personal content
- Allows course outline uploads (PDF)
- Manages course catalog
- Views usage analytics
- Updates TBA dates in assignments

## 🔐 Privacy & Security

- ✅ **Private Profiles**: No public social features
- ✅ **Admin Analytics Only**: Admin can only see aggregate data and user list
- ✅ **University Email Validation**: Ensures real students
- ✅ **PIN Authentication**: 4-digit PIN (should be hashed in production)
- ✅ **Row Level Security**: Supabase RLS policies prevent unauthorized access

## 📱 Platform

- **Current**: iOS only
- **Future**: Potential Android expansion

## 📄 License

Private project - All rights reserved

## 🐛 Known Issues

- Dark theme colors need refinement in some screens
- Login button text ("Student Manager") could be larger
- No actual backend connection yet
- Sample data is hardcoded

## 💡 Tips

- Use Expo Go app for quickest testing on physical device
- iOS Simulator requires Mac with Xcode installed
- Check terminal console for navigation logs
- All screens are themed and should respond to light/dark mode

## 📞 Support

For questions or issues, refer to:
- Project plan: `c:\Users\musab\.cursor\plans\student_management_ios_app_098a9ff0.plan.md`
- Supabase setup: `SUPABASE_SETUP.md`
- Database schema: `database-schema.sql`

---

**Built with** ❤️ **using React Native, Expo, TypeScript, and Supabase**
