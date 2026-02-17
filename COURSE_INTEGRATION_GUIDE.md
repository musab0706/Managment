# Engineering Course Data Integration - Implementation Guide

## ✅ COMPLETED

### 1. **Comprehensive Course Database** (`data/courseData.ts`)
Created detailed course outlines for core engineering courses including:
- ENGG*1070 - Occupational Health and Safety
- ENGG*1100 - Engineering and Design I
- ENGG*1210 - Engineering Mechanics I
- ENGG*1500 - Engineering Analysis
- ENGG*2100 - Engineering and Design II
- ENGG*2120 - Material Science
- ENGG*2160 - Engineering Mechanics II (Dynamics)
- ENGG*2230 - Fluid Mechanics
- ENGG*2400 - Engineering Systems Analysis
- ENGG*2450 - Electric Circuits

### Each Course Contains:
✅ **Basic Information**
- Course code, name, credits
- Semester offered
- Prerequisites, corequisites, restrictions
- Lecture/lab hours

✅ **Learning Outcomes**
- Detailed learning objectives for each course

✅ **Assessment Structure** (for Grading System)
- All assignments, midterms, finals, labs, projects
- Percentage weights
- Due weeks
- Recurring vs one-time assessments

✅ **Weekly Topics** (for Weekly Checklists)
- 12 weeks of topics per course
- Specific tasks for each week
- Reading assignments
- Lab activities

✅ **Milestones** (for Reminders)
- Major deadlines (midterms, finals, projects)
- Typical week they occur
- Descriptions

✅ **Program Associations**
- Which engineering programs require each course
- Which programs can take as elective

### 2. **Integration Utilities** (`utils/courseIntegration.ts`)
Created helper functions for:

✅ **Task Generation**
- `generateWeeklyTasks()` - Creates tasks for specific week
- `generateSemesterTasks()` - Creates all tasks for entire semester
- Automatically categorizes by type (Assignment, Lab, Exam, etc.)
- Sets priorities based on importance

✅ **Reminder Generation**
- `generateCourseReminders()` - Creates reminders from milestones
- Auto-calculates reminder dates
- Sets notification timing (7 days for exams, 3 for assignments)

✅ **Grading System Integration**
- `getCourseGradingStructure()` - Gets all assessments with weights
- `calculateCurrentGrade()` - Calculates grade from completed work
- Provides grade breakdown by assessment type

✅ **Weekly Checklist Generation**
- `generateWeeklyChecklist()` - Creates weekly task list for all courses
- Organizes by course and topic
- Tracks completion status

✅ **Performance Tracking**
- `getCoursePerformance()` - Comprehensive performance metrics
- Tracks tasks completed vs total
- Shows current grade
- Counts upcoming assessments

✅ **Course Detail View**
- `getCourseDetailData()` - Full course information package
- Grading structure
- All topics organized
- Assessment timeline

## 🔄 NEXT STEPS - Integration into App Features

### 1. **Update Course Detail Screen** (`app/course-detail.tsx`)
**What to do:**
- Import `getCourseDetailData` from utils
- Display full course outline when tapping a course
- Show weekly topics, assessments, learning objectives
- Add textbook information

**Code to add:**
```typescript
import { getCourseDetailData } from '../utils/courseIntegration';
import ENGG_COURSES from '../data/courseData';

// In the component:
const courseData = getCourseDetailData(courseCode);
```

### 2. **Update Reminders Tab** (`app/(tabs)/reminders.tsx`)
**What to do:**
- Auto-generate reminders from course milestones
- When user enrolls in a course, create all milestone reminders
- Show exam reminders 7 days before
- Show assignment reminders 3 days before

**Code to add:**
```typescript
import { generateCourseReminders } from '../utils/courseIntegration';

// Generate reminders when course is added
const userCourses = ['ENGG*1100', 'ENGG*1210']; // From user's schedule
const semesterStart = new Date('2026-01-13'); // Winter 2026

userCourses.forEach(code => {
  const reminders = generateCourseReminders(code, semesterStart);
  // Save to AsyncStorage
});
```

### 3. **Update Tasks/Calendar** (`app/(tabs)/calendar.tsx`)
**What to do:**
- Auto-generate tasks from course data
- Show weekly tasks based on course schedule
- Mark tasks as complete
- Filter by course

**Code to add:**
```typescript
import { generateWeeklyTasks, generateSemesterTasks } from '../utils/courseIntegration';

// Generate tasks for current week
const currentWeek = 5; // Calculate from semester start
const weekTasks = generateWeeklyTasks('ENGG*1100', currentWeek, semesterStart);
```

### 4. **Update Grading/Performance** (`app/(tabs)/performance.tsx`)
**What to do:**
- Show grading structure from course data
- Calculate grades automatically
- Display assessment weights
- Track completion of assessments

**Code to add:**
```typescript
import { getCourseGradingStructure, calculateCurrentGrade } from '../utils/courseIntegration';

const gradingStructure = getCourseGradingStructure('ENGG*1100');
const currentGrade = calculateCurrentGrade('ENGG*1100', userScores);
```

### 5. **Create Weekly Checklist Feature**
**What to do:**
- New screen or tab for weekly checklists
- Shows all courses' tasks for the week
- Check off completed items
- Shows progress per course

**Code to add:**
```typescript
import { generateWeeklyChecklist } from '../utils/courseIntegration';

const currentWeek = getCurrentWeek(semesterStart);
const checklist = generateWeeklyChecklist(userCourses, currentWeek);
```

### 6. **Update Classes Tab** (`app/(tabs)/classes.tsx`)
**What to do:**
- Show course information from course data
- Display upcoming assessments
- Show weekly topics
- Link to full course outline

### 7. **Add Semester Setup**
**What to do:**
- Create a setup flow where users:
  1. Select semester start date
  2. Choose their courses
  3. App auto-generates ALL tasks, reminders, checklists
- Store semester start date in AsyncStorage

## 📊 DATA STRUCTURE

### Course Data Storage
```typescript
{
  courseCode: 'ENGG*1100',
  name: 'Engineering and Design I',
  credits: 0.75,
  weeklyTopics: [/* 12 weeks */],
  assessments: [/* all graded work */],
  milestones: [/* major deadlines */],
  learningObjectives: [/* learning goals */]
}
```

### Generated Task Structure
```typescript
{
  id: 'ENGG*1100_W5_T1',
  title: 'Lab: Concept sketches',
  description: 'Week 5: Concept Generation, Brainstorming Techniques',
  dueDate: Date,
  courseCode: 'ENGG*1100',
  type: 'Lab',
  priority: 'Medium',
  completed: false
}
```

### Generated Reminder Structure
```typescript
{
  id: 'ENGG*1100_REMINDER_0',
  title: 'Midterm Design Project Due',
  description: 'First major design project with presentation',
  date: Date,
  courseCode: 'ENGG*1100',
  type: 'Project',
  notifyBefore: 3
}
```

## 🎯 BENEFITS

1. **Automated Task Management**: Students don't need to manually enter every assignment
2. **Never Miss a Deadline**: Auto-generated reminders for all major milestones
3. **Accurate Grade Tracking**: Grading structure matches actual course structure
4. **Weekly Planning**: Easy-to-follow weekly checklists
5. **Comprehensive Course Info**: Full course outlines at students' fingertips
6. **Semester-Long View**: See entire semester planned out from day 1

## 🔮 FUTURE EXPANSION

To add more courses:
1. Get course outline from University of Guelph website
2. Add to `data/courseData.ts` following the same structure
3. All features automatically work with new courses!

Currently need to add:
- ENGG*2340 (Kinematics and Dynamics)
- ENGG*2180 (Manufacturing)
- ENGG*3100, 3240, 3260, 3280, etc. (3rd year courses)
- ENGG*4000+ (4th year courses)
- CIS courses (for Computer Engineering)
- MATH courses
- PHYS courses
- CHEM courses

## 📝 TESTING CHECKLIST

Before full deployment:
- [ ] Test task generation for each course
- [ ] Verify reminder dates are correct
- [ ] Test grade calculations
- [ ] Verify weekly checklist accuracy
- [ ] Test with different semester start dates
- [ ] Test with different course combinations

## 🚀 READY TO INTEGRATE!

All the data and utilities are ready. Now we just need to update the UI components to use this data instead of manual input!
