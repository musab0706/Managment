# 🔧 QUICK INTEGRATION CODE SNIPPETS

## Copy-Paste These Into Your App Components

### 1️⃣ IMPORT THE UTILITIES (Add to top of any file)

```typescript
import { 
  generateWeeklyTasks, 
  generateSemesterTasks, 
  generateCourseReminders,
  getCourseGradingStructure,
  calculateCurrentGrade,
  generateWeeklyChecklist,
  getCoursePerformance 
} from '../utils/courseIntegration';

import { getCourse } from '../data/courseData';
```

---

### 2️⃣ SETUP SEMESTER (Run once when user sets up schedule)

```typescript
// In personalize.tsx or setup screen
const setupSemester = async () => {
  const semesterStart = new Date('2026-01-13'); // Winter 2026
  const userCourses = ['ENGG*1100', 'ENGG*1210', 'ENGG*1500']; // From user selection
  
  // Save semester start date
  await AsyncStorage.setItem('semesterStartDate', semesterStart.toISOString());
  
  // Generate ALL tasks for all courses
  const allTasks = [];
  userCourses.forEach(courseCode => {
    const courseTasks = generateSemesterTasks(courseCode, semesterStart);
    allTasks.push(...courseTasks);
  });
  
  await AsyncStorage.setItem('generatedTasks', JSON.stringify(allTasks));
  
  // Generate ALL reminders
  const allReminders = [];
  userCourses.forEach(courseCode => {
    const courseReminders = generateCourseReminders(courseCode, semesterStart);
    allReminders.push(...courseReminders);
  });
  
  await AsyncStorage.setItem('generatedReminders', JSON.stringify(allReminders));
};
```

---

### 3️⃣ CALENDAR/TASKS TAB - Show Weekly Tasks

```typescript
// In app/(tabs)/calendar.tsx

const [tasks, setTasks] = useState([]);
const [currentWeek, setCurrentWeek] = useState(1);

useEffect(() => {
  loadWeeklyTasks();
}, [currentWeek]);

const loadWeeklyTasks = async () => {
  try {
    const semesterStartStr = await AsyncStorage.getItem('semesterStartDate');
    const userCoursesStr = await AsyncStorage.getItem('userCourses');
    
    if (semesterStartStr && userCoursesStr) {
      const semesterStart = new Date(semesterStartStr);
      const userCourses = JSON.parse(userCoursesStr);
      
      // Calculate current week
      const weekNumber = getCurrentWeek(semesterStart);
      setCurrentWeek(weekNumber);
      
      // Get tasks for this week for all courses
      const weekTasks = [];
      userCourses.forEach(course => {
        const courseTasks = generateWeeklyTasks(course.code, weekNumber, semesterStart);
        weekTasks.push(...courseTasks);
      });
      
      setTasks(weekTasks);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

const getCurrentWeek = (startDate) => {
  const now = new Date();
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
};

// In your JSX:
{tasks.map(task => (
  <View key={task.id}>
    <Text>{task.title}</Text>
    <Text>{task.courseCode} - Due: {task.dueDate.toLocaleDateString()}</Text>
    <Text>Priority: {task.priority}</Text>
  </View>
))}
```

---

### 4️⃣ REMINDERS TAB - Show Course Reminders

```typescript
// In app/(tabs)/reminders.tsx

const [reminders, setReminders] = useState([]);

useEffect(() => {
  loadReminders();
}, []);

const loadReminders = async () => {
  try {
    const savedReminders = await AsyncStorage.getItem('generatedReminders');
    if (savedReminders) {
      const allReminders = JSON.parse(savedReminders);
      
      // Filter upcoming reminders (within next 7 days)
      const now = new Date();
      const upcomingReminders = allReminders.filter(reminder => {
        const daysUntil = (reminder.date - now) / (1000 * 60 * 60 * 24);
        return daysUntil > 0 && daysUntil <= 7;
      });
      
      setReminders(upcomingReminders);
    }
  } catch (error) {
    console.error('Error loading reminders:', error);
  }
};

// In your JSX:
{reminders.map(reminder => (
  <View key={reminder.id} style={styles.reminderCard}>
    <Text>{reminder.title}</Text>
    <Text>{reminder.description}</Text>
    <Text>{reminder.courseCode}</Text>
    <Text>Date: {new Date(reminder.date).toLocaleDateString()}</Text>
    <Text>Type: {reminder.type}</Text>
  </View>
))}
```

---

### 5️⃣ COURSE DETAIL - Show Real Course Data

```typescript
// In app/course-detail.tsx

const [courseData, setCourseData] = useState(null);

useEffect(() => {
  loadCourseData();
}, [courseId]);

const loadCourseData = async () => {
  try {
    // Get the course from user's courses
    const savedCourses = await AsyncStorage.getItem('userCourses');
    if (savedCourses) {
      const courses = JSON.parse(savedCourses);
      const foundCourse = courses.find(c => c.id === courseId);
      
      if (foundCourse) {
        // Get full course data including outline
        const fullCourseData = getCourse(foundCourse.code);
        
        if (fullCourseData) {
          setCourseData(fullCourseData);
          
          // Auto-populate grading structure from course data
          const gradingStructure = getCourseGradingStructure(foundCourse.code);
          setGradeCategories(gradingStructure);
        }
      }
    }
  } catch (error) {
    console.error('Error loading course data:', error);
  }
};

// Display course outline in JSX:
{courseData && (
  <View style={styles.outlineSection}>
    <Text style={styles.sectionTitle}>Course Description</Text>
    <Text>{courseData.description}</Text>
    
    <Text style={styles.sectionTitle}>Learning Objectives</Text>
    {courseData.learningObjectives.map((obj, index) => (
      <Text key={index}>• {obj}</Text>
    ))}
    
    <Text style={styles.sectionTitle}>Prerequisites</Text>
    {courseData.prerequisites?.map((prereq, index) => (
      <Text key={index}>• {prereq}</Text>
    ))}
    
    <Text style={styles.sectionTitle}>Weekly Topics</Text>
    {courseData.weeklyTopics.map((week) => (
      <View key={week.week}>
        <Text>Week {week.week}: {week.topics.join(', ')}</Text>
      </View>
    ))}
  </View>
)}
```

---

### 6️⃣ PERFORMANCE TAB - Show Grade Calculation

```typescript
// In app/(tabs)/performance.tsx

const [coursePerformance, setCoursePerformance] = useState([]);

useEffect(() => {
  calculatePerformance();
}, []);

const calculatePerformance = async () => {
  try {
    const userCoursesStr = await AsyncStorage.getItem('userCourses');
    if (userCoursesStr) {
      const userCourses = JSON.parse(userCoursesStr);
      
      const performance = userCourses.map(course => {
        // Get saved scores for this course
        const savedScores = getSavedScores(course.id); // Your existing function
        const completedTasks = getCompletedTasks(course.id); // Your existing function
        const studyHours = getStudyHours(course.id); // Your existing function
        
        // Calculate performance using course data
        return getCoursePerformance(
          course.code,
          completedTasks,
          savedScores,
          studyHours
        );
      });
      
      setCoursePerformance(performance);
    }
  } catch (error) {
    console.error('Error calculating performance:', error);
  }
};

// Display performance:
{coursePerformance.map(perf => (
  <View key={perf.courseCode} style={styles.performanceCard}>
    <Text>{perf.courseName}</Text>
    <Text>Current Grade: {perf.currentGrade.toFixed(1)}%</Text>
    <Text>Tasks: {perf.tasksCompleted}/{perf.totalTasks}</Text>
    <Text>Upcoming Assessments: {perf.upcomingAssessments}</Text>
    <Text>Study Hours: {perf.studyHours}</Text>
  </View>
))}
```

---

### 7️⃣ WEEKLY CHECKLIST - New Feature

```typescript
// Create new component or add to existing tab

const [weeklyChecklist, setWeeklyChecklist] = useState([]);

useEffect(() => {
  loadWeeklyChecklist();
}, []);

const loadWeeklyChecklist = async () => {
  try {
    const semesterStartStr = await AsyncStorage.getItem('semesterStartDate');
    const userCoursesStr = await AsyncStorage.getItem('userCourses');
    
    if (semesterStartStr && userCoursesStr) {
      const semesterStart = new Date(semesterStartStr);
      const userCourses = JSON.parse(userCoursesStr);
      const courseCodes = userCourses.map(c => c.code);
      
      const currentWeek = getCurrentWeek(semesterStart);
      const checklist = generateWeeklyChecklist(courseCodes, currentWeek);
      
      setWeeklyChecklist(checklist);
    }
  } catch (error) {
    console.error('Error loading checklist:', error);
  }
};

// Display checklist:
<View>
  <Text style={styles.title}>Week {currentWeek} Checklist</Text>
  {weeklyChecklist.map(item => (
    <View key={item.id} style={styles.checklistItem}>
      <Text style={styles.courseCode}>{item.courseCode}</Text>
      <Text style={styles.courseName}>{item.courseName}</Text>
      <Text style={styles.topic}>Topic: {item.topic}</Text>
      <View>
        {item.tasks.map((task, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => toggleTask(item.id, index)}
          >
            <Text>
              {completedTasks[`${item.id}_${index}`] ? '✅' : '⬜'} {task}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  ))}
</View>
```

---

### 8️⃣ AUTO-POPULATE GRADE STRUCTURE

```typescript
// When loading grade categories in course-detail.tsx
// REPLACE the default categories with:

const loadGradeCategories = async () => {
  const gradesKey = `course_grades_${courseId}`;
  const savedGrades = await AsyncStorage.getItem(gradesKey);
  
  if (savedGrades) {
    setGradeCategories(JSON.parse(savedGrades));
  } else {
    // Auto-populate from course data!
    const courseCode = course.code; // e.g., 'ENGG*1100'
    const structure = getCourseGradingStructure(courseCode);
    setGradeCategories(structure);
    await AsyncStorage.setItem(gradesKey, JSON.stringify(structure));
  }
};
```

---

### 9️⃣ CALCULATE GRADE AUTOMATICALLY

```typescript
// In course-detail.tsx, REPLACE your calculateCurrentGrade function with:

const calculateCurrentGrade = () => {
  const courseCode = course.code;
  const scores = gradeCategories
    .filter(cat => cat.score !== null)
    .map(cat => ({
      assessmentName: cat.name,
      score: cat.score
    }));
  
  return calculateCurrentGrade(courseCode, scores);
};
```

---

## 🎯 COMPLETE EXAMPLE: Adding a Course

```typescript
// When user selects courses during onboarding:

const handleCourseSelection = async (selectedCourses) => {
  const semesterStart = new Date('2026-01-13');
  
  // 1. Save courses
  await AsyncStorage.setItem('userCourses', JSON.stringify(selectedCourses));
  await AsyncStorage.setItem('semesterStartDate', semesterStart.toISOString());
  
  // 2. Generate everything automatically
  const allTasks = [];
  const allReminders = [];
  
  selectedCourses.forEach(courseCode => {
    // Get full course data
    const courseData = getCourse(courseCode);
    
    if (courseData) {
      // Generate tasks
      const tasks = generateSemesterTasks(courseCode, semesterStart);
      allTasks.push(...tasks);
      
      // Generate reminders
      const reminders = generateCourseReminders(courseCode, semesterStart);
      allReminders.push(...reminders);
    }
  });
  
  // 3. Save generated data
  await AsyncStorage.setItem('generatedTasks', JSON.stringify(allTasks));
  await AsyncStorage.setItem('generatedReminders', JSON.stringify(allReminders));
  
  console.log(`✅ Generated ${allTasks.length} tasks and ${allReminders.length} reminders!`);
};
```

---

## 📱 TESTING

```typescript
// Test the system:
const testCourseData = () => {
  const courseCode = 'ENGG*1100';
  const semesterStart = new Date('2026-01-13');
  
  console.log('=== Testing Course Data System ===');
  
  // Test 1: Get course info
  const course = getCourse(courseCode);
  console.log('Course:', course.name);
  console.log('Credits:', course.credits);
  console.log('Total weeks:', course.weeklyTopics.length);
  
  // Test 2: Generate tasks for week 5
  const week5Tasks = generateWeeklyTasks(courseCode, 5, semesterStart);
  console.log(`Week 5 Tasks: ${week5Tasks.length}`);
  week5Tasks.forEach(task => console.log(`  - ${task.title}`));
  
  // Test 3: Generate semester tasks
  const allTasks = generateSemesterTasks(courseCode, semesterStart);
  console.log(`Total semester tasks: ${allTasks.length}`);
  
  // Test 4: Generate reminders
  const reminders = generateCourseReminders(courseCode, semesterStart);
  console.log(`Reminders: ${reminders.length}`);
  reminders.forEach(r => console.log(`  - ${r.title} (Week ${r.typicalWeek})`));
  
  // Test 5: Get grading structure
  const grading = getCourseGradingStructure(courseCode);
  console.log(`Grading categories: ${grading.length}`);
  grading.forEach(g => console.log(`  - ${g.assessmentName}: ${g.weight}%`));
};

// Run the test
testCourseData();
```

---

## 🚀 READY TO USE!

Just copy-paste these snippets into your components and the course data system will power your entire app!
