-- Student Manager Database Schema for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id VARCHAR(50) UNIQUE NOT NULL,
  school_email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  pin_hash VARCHAR(255) NOT NULL, -- Store hashed PIN
  phone VARCHAR(20),
  university VARCHAR(255) NOT NULL,
  major VARCHAR(255) NOT NULL,
  semester VARCHAR(50),
  bio TEXT,
  profile_photo_url TEXT,
  theme VARCHAR(10) DEFAULT 'light',
  notification_intensity INT DEFAULT 5,
  sound_volume INT DEFAULT 5,
  vibration_intensity INT DEFAULT 5,
  total_focus_points DECIMAL(10,2) DEFAULT 0,
  total_focus_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses Table (Admin managed)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code VARCHAR(50) UNIQUE NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  credits VARCHAR(10),
  semester VARCHAR(50),
  syllabus_pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Course Enrollments (User's selected courses with colors)
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  color VARCHAR(7) NOT NULL, -- Hex color code
  enrolled_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Course Outlines (Parsed from PDF)
CREATE TABLE course_outlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  total_weeks INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Weekly Course Content
CREATE TABLE weekly_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_outline_id UUID REFERENCES course_outlines(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  chapters JSONB, -- Array of chapter names
  topics TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Course Schedule (Class times)
CREATE TABLE course_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assignments (From course outline)
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- 'midterm', 'final', 'quiz', 'lab', 'assignment', 'project'
  due_date DATE,
  due_time TIME,
  gpa_weight DECIMAL(5,2),
  is_tba BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reminders
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  course_enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reminder_date DATE NOT NULL,
  reminder_time TIME NOT NULL,
  priority VARCHAR(10) NOT NULL, -- 'high', 'medium', 'low'
  sound_level INT DEFAULT 5,
  vibration_level INT DEFAULT 5,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50), -- 'daily', 'weekly', 'monthly'
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sub-reminders
CREATE TABLE sub_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_reminder_id UUID REFERENCES reminders(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  reminder_date DATE,
  reminder_time TIME,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  week_number INT,
  is_cheat_sheet BOOLEAN DEFAULT FALSE,
  content TEXT,
  character_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Weekly Study Progress
CREATE TABLE weekly_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  is_studied BOOLEAN DEFAULT FALSE,
  difficulty_rating INT, -- 1-5 stars
  studied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_enrollment_id, week_number)
);

-- Important Notes (Very Important Notes with criticality)
CREATE TABLE important_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  week_number INT,
  content TEXT NOT NULL,
  criticality VARCHAR(10) NOT NULL, -- 'high', 'medium', 'low'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Focus Sessions
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_seconds INT,
  points_earned DECIMAL(10,2),
  was_interrupted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- GPA Components
CREATE TABLE gpa_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  earned_grade DECIMAL(5,2),
  max_grade DECIMAL(5,2) DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Study Plans (Generated by Intelligent Study Planner)
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL, -- Contains day-by-day study plan
  created_at TIMESTAMP DEFAULT NOW()
);

-- Calendar Events (Generated from courses, assignments, schedules)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  event_type VARCHAR(50), -- 'class', 'exam', 'assignment', 'lab', etc.
  has_grade BOOLEAN DEFAULT TRUE,
  gpa_weight DECIMAL(5,2),
  extra_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reminder History
CREATE TABLE reminder_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reminder_id UUID REFERENCES reminders(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  grade_achieved DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin Users (For dashboard access)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(school_email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_reminders_user ON reminders(user_id);
CREATE INDEX idx_reminders_date ON reminders(reminder_date);
CREATE INDEX idx_notes_user_course ON notes(user_id, course_enrollment_id);
CREATE INDEX idx_focus_sessions_user ON focus_sessions(user_id);
CREATE INDEX idx_calendar_events_user_date ON calendar_events(user_id, event_date);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE important_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpa_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_history ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Course enrollments policies
CREATE POLICY "Users can view own enrollments" ON course_enrollments
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Reminders policies
CREATE POLICY "Users can manage own reminders" ON reminders
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Similar policies for other tables...
-- (Add more policies as needed)

-- Public access to courses table (read-only)
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);
