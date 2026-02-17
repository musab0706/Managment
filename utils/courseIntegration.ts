// Course Integration Utilities
// This file provides helper functions to integrate course data across all app features

import { getCourse, getCourseAssessments, getWeeklyTopics, getCourseMilestones } from './courseData';

// ============================================
// TASK GENERATION FROM COURSE DATA
// ============================================

export interface GeneratedTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  courseCode: string;
  courseName: string;
  type: 'Assignment' | 'Lab' | 'Project' | 'Exam' | 'Reading' | 'Study';
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

/**
 * Generate tasks for a specific course and week
 */
export const generateWeeklyTasks = (
  courseCode: string,
  weekNumber: number,
  semesterStartDate: Date
): GeneratedTask[] => {
  const course = getCourse(courseCode);
  if (!course) return [];

  const weekData = getWeeklyTopics(courseCode, weekNumber);
  if (!weekData) return [];

  const tasks: GeneratedTask[] = [];
  const weekStartDate = new Date(semesterStartDate);
  weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7);

  // Generate tasks from weekly topics
  weekData.tasks?.forEach((task, index) => {
    tasks.push({
      id: `${courseCode}_W${weekNumber}_T${index}`,
      title: task,
      description: `Week ${weekNumber}: ${weekData.topics.join(', ')}`,
      dueDate: new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000), // End of week
      courseCode: course.code,
      courseName: course.name,
      type: task.toLowerCase().includes('assignment') ? 'Assignment' : 
            task.toLowerCase().includes('lab') ? 'Lab' :
            task.toLowerCase().includes('read') ? 'Reading' : 'Study',
      priority: 'Medium',
      completed: false
    });
  });

  return tasks;
};

/**
 * Generate all tasks for a course for the entire semester
 */
export const generateSemesterTasks = (
  courseCode: string,
  semesterStartDate: Date
): GeneratedTask[] => {
  const course = getCourse(courseCode);
  if (!course) return [];

  const allTasks: GeneratedTask[] = [];

  // Generate weekly tasks
  course.weeklyTopics.forEach((week) => {
    const weekTasks = generateWeeklyTasks(courseCode, week.week, semesterStartDate);
    allTasks.push(...weekTasks);
  });

  // Generate assessment tasks
  course.assessments.forEach((assessment, index) => {
    if (!assessment.isRecurring && assessment.dueWeek) {
      const dueDate = new Date(semesterStartDate);
      dueDate.setDate(dueDate.getDate() + (assessment.dueWeek - 1) * 7);

      allTasks.push({
        id: `${courseCode}_ASSESS_${index}`,
        title: assessment.name,
        description: `${assessment.type}: ${assessment.weight}% of final grade`,
        dueDate: dueDate,
        courseCode: course.code,
        courseName: course.name,
        type: assessment.type === 'Assignment' ? 'Assignment' :
              assessment.type === 'Lab' ? 'Lab' :
              assessment.type === 'Project' ? 'Project' : 'Exam',
        priority: assessment.type.includes('Exam') || assessment.type.includes('Project') ? 'High' : 'Medium',
        completed: false
      });
    }
  });

  return allTasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

// ============================================
// REMINDER GENERATION FROM COURSE DATA
// ============================================

export interface GeneratedReminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  courseCode: string;
  type: 'Exam' | 'Assignment' | 'Project' | 'Milestone';
  notifyBefore: number; // days before to notify
}

/**
 * Generate reminders from course milestones
 */
export const generateCourseReminders = (
  courseCode: string,
  semesterStartDate: Date
): GeneratedReminder[] => {
  const milestones = getCourseMilestones(courseCode);
  const course = getCourse(courseCode);
  if (!course || !milestones) return [];

  return milestones.map((milestone, index) => {
    const milestoneDate = new Date(semesterStartDate);
    milestoneDate.setDate(milestoneDate.getDate() + (milestone.typicalWeek - 1) * 7);

    return {
      id: `${courseCode}_REMINDER_${index}`,
      title: milestone.name,
      description: milestone.description,
      date: milestoneDate,
      courseCode: course.code,
      type: milestone.type === 'Midterm' || milestone.type === 'Final Exam' ? 'Exam' :
            milestone.type === 'Project Due' ? 'Project' :
            milestone.type === 'Assignment' ? 'Assignment' : 'Milestone',
      notifyBefore: milestone.type.includes('Exam') ? 7 : 3 // 7 days for exams, 3 for others
    };
  });
};

// ============================================
// GRADING SYSTEM INTEGRATION
// ============================================

export interface GradeBreakdown {
  assessmentName: string;
  type: string;
  weight: number;
  score?: number;
  maxScore: number;
  contribut ion: number; // contribution to final grade
}

/**
 * Get grading structure for a course
 */
export const getCourseGradingStructure = (courseCode: string): GradeBreakdown[] => {
  const assessments = getCourseAssessments(courseCode);
  
  return assessments.map(assessment => ({
    assessmentName: assessment.name,
    type: assessment.type,
    weight: assessment.weight,
    maxScore: 100,
    contribution: 0 // Will be calculated when scores are entered
  }));
};

/**
 * Calculate current grade based on completed assessments
 */
export const calculateCurrentGrade = (
  courseCode: string,
  scores: { assessmentName: string; score: number }[]
): number => {
  const structure = getCourseGradingStructure(courseCode);
  let totalWeight = 0;
  let earnedPoints = 0;

  scores.forEach(scoreEntry => {
    const assessment = structure.find(a => a.assessmentName === scoreEntry.assessmentName);
    if (assessment) {
      totalWeight += assessment.weight;
      earnedPoints += (scoreEntry.score / 100) * assessment.weight;
    }
  });

  return totalWeight > 0 ? (earnedPoints / totalWeight) * 100 : 0;
};

// ============================================
// WEEKLY CHECKLIST GENERATION
// ============================================

export interface WeeklyChecklistItem {
  id: string;
  week: number;
  courseCode: string;
  courseName: string;
  topic: string;
  tasks: string[];
  completed: boolean;
}

/**
 * Generate weekly checklist from course data
 */
export const generateWeeklyChecklist = (
  courseCodes: string[],
  weekNumber: number
): WeeklyChecklistItem[] => {
  const checklist: WeeklyChecklistItem[] = [];

  courseCodes.forEach(code => {
    const course = getCourse(code);
    const weekData = getWeeklyTopics(code, weekNumber);

    if (course && weekData) {
      checklist.push({
        id: `${code}_CHECKLIST_W${weekNumber}`,
        week: weekNumber,
        courseCode: course.code,
        courseName: course.name,
        topic: weekData.topics.join(', '),
        tasks: weekData.tasks || [],
        completed: false
      });
    }
  });

  return checklist;
};

// ============================================
// PERFORMANCE TRACKING INTEGRATION
// ============================================

export interface CoursePerformance {
  courseCode: string;
  courseName: string;
  currentGrade: number;
  tasksCompleted: number;
  totalTasks: number;
  upcomingAssessments: number;
  studyHours: number;
}

/**
 * Generate performance summary for a course
 */
export const getCoursePerformance = (
  courseCode: string,
  completedTasks: string[],
  scores: { assessmentName: string; score: number }[],
  studyHours: number
): CoursePerformance => {
  const course = getCourse(courseCode);
  if (!course) {
    return {
      courseCode,
      courseName: 'Unknown',
      currentGrade: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      upcomingAssessments: 0,
      studyHours: 0
    };
  }

  const totalTasks = course.weeklyTopics.reduce((sum, week) => sum + (week.tasks?.length || 0), 0);
  const tasksCompleted = completedTasks.length;
  const currentGrade = calculateCurrentGrade(courseCode, scores);
  const upcomingAssessments = course.assessments.filter(a => !a.isRecurring).length;

  return {
    courseCode: course.code,
    courseName: course.name,
    currentGrade,
    tasksCompleted,
    totalTasks,
    upcomingAssessments,
    studyHours
  };
};

// ============================================
// COURSE DETAIL INTEGRATION
// ============================================

/**
 * Get comprehensive course information for detail view
 */
export const getCourseDetailData = (courseCode: string) => {
  const course = getCourse(courseCode);
  if (!course) return null;

  return {
    ...course,
    gradingStructure: getCourseGradingStructure(courseCode),
    allTopics: course.weeklyTopics.map(w => w.topics).flat(),
    totalWeeks: course.weeklyTopics.length,
    assessmentCount: course.assessments.length
  };
};

export default {
  generateWeeklyTasks,
  generateSemesterTasks,
  generateCourseReminders,
  getCourseGradingStructure,
  calculateCurrentGrade,
  generateWeeklyChecklist,
  getCoursePerformance,
  getCourseDetailData
};
