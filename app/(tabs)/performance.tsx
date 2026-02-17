import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

interface Course {
  id: string;
  code: string;
  name: string;
  color: string;
  professor?: string;
}

interface GradeCategory {
  name: string;
  weight: number;
  score: number | null;
}

export default function PerformanceScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseGrades, setCourseGrades] = useState<{ [courseId: string]: GradeCategory[] }>({});
  const [overallGPA, setOverallGPA] = useState<string>('0.00');

  // Load courses and grades from AsyncStorage
  const loadCoursesAndGrades = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem('userCourses');
      if (storedCourses) {
        const parsedCourses: Course[] = JSON.parse(storedCourses);
        setCourses(parsedCourses);

        // Load grades for each course
        const gradesMap: { [courseId: string]: GradeCategory[] } = {};
        for (const course of parsedCourses) {
          const storedGrades = await AsyncStorage.getItem(`course_grades_${course.id}`);
          if (storedGrades) {
            gradesMap[course.id] = JSON.parse(storedGrades);
          }
        }
        setCourseGrades(gradesMap);

        // Calculate overall GPA
        const gpa = calculateOverallGPA(parsedCourses, gradesMap);
        setOverallGPA(gpa);
      } else {
        setCourses([]);
        setCourseGrades({});
        setOverallGPA('0.00');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
      setCourseGrades({});
      setOverallGPA('0.00');
    }
  };

  const calculateCourseGrade = (grades: GradeCategory[]) => {
    let totalScore = 0;
    let totalWeight = 0;

    grades.forEach(category => {
      if (category.score !== null) {
        totalScore += category.score;
        totalWeight += category.weight;
      }
    });

    if (totalWeight === 0) return 0;
    return (totalScore / totalWeight) * 100;
  };

  const gradeToGPA = (grade: number) => {
    if (grade >= 90) return 4.0;
    if (grade >= 85) return 3.9;
    if (grade >= 80) return 3.7;
    if (grade >= 77) return 3.3;
    if (grade >= 73) return 3.0;
    if (grade >= 70) return 2.7;
    if (grade >= 67) return 2.3;
    if (grade >= 63) return 2.0;
    if (grade >= 60) return 1.7;
    return 0.0;
  };

  const calculateOverallGPA = (coursesData: Course[], gradesMap: { [courseId: string]: GradeCategory[] }) => {
    let totalGPA = 0;
    let courseCount = 0;

    coursesData.forEach(course => {
      const grades = gradesMap[course.id];
      if (grades && grades.length > 0) {
        const courseGrade = calculateCourseGrade(grades);
        if (courseGrade > 0) {
          totalGPA += gradeToGPA(courseGrade);
          courseCount++;
        }
      }
    });

    if (courseCount === 0) return '0.00';
    return (totalGPA / courseCount).toFixed(2);
  };

  useEffect(() => {
    loadCoursesAndGrades();
  }, []);

  // Reload courses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCoursesAndGrades();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Performance</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Stats */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Overall Stats</Text>

        {/* Academic Tree */}
        <TouchableOpacity 
          style={[styles.statCard, { backgroundColor: colors.card }]}
          onPress={() => router.push('/academic-tree')}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.statLabel, { color: colors.text }]}>Academic Tree</Text>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              Track your degree progress
            </Text>
          </View>
        </TouchableOpacity>

        {/* Overdue Tasks */}
        {/* TODO: Calculate actual overdue from reminders
        {tasksOverdue > 0 && (
          <View style={[styles.overdueCard, { backgroundColor: '#FF3B30' + '15' }]}>
            <View style={[styles.overdueIndicator, { backgroundColor: '#FF3B30' }]} />
            <Text style={[styles.overdueText, { color: '#FF3B30' }]}>
              {tasksOverdue} tasks overdue
            </Text>
          </View>
        )}
        */}

        {/* Academic Overview */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Academic Overview
        </Text>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardContent}>
            <Text style={[styles.statLabel, { color: colors.text }]}>Overall GPA</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.gpaNumber, { color: colors.text }]}>
              {overallGPA}
            </Text>
            <Text style={[styles.gpaScale, { color: colors.textSecondary }]}>
              / 4.0
            </Text>
          </View>
          <Text style={[styles.statText, { color: colors.textSecondary, marginTop: 8 }]}>
            Based on {courses.filter(c => courseGrades[c.id] && courseGrades[c.id].length > 0).length} course{courses.filter(c => courseGrades[c.id] && courseGrades[c.id].length > 0).length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* By Course */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          By Course
        </Text>

        {courses.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No courses added yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Add courses in the Classes tab to see performance tracking
            </Text>
          </View>
        ) : (
          courses.map((course) => {
            const grades = courseGrades[course.id] || [];
            const courseGrade = calculateCourseGrade(grades);
            const courseGPA = gradeToGPA(courseGrade);
            
            return (
              <View key={course.id} style={[styles.courseCard, { backgroundColor: colors.card }]}>
                <View style={styles.courseHeader}>
                  <View>
                    <Text style={[styles.courseCode, { color: colors.text }]}>{course.code}</Text>
                    <Text style={[styles.courseName, { color: colors.textSecondary }]}>{course.name}</Text>
                  </View>
                  <View style={styles.courseGradeContainer}>
                    <Text style={[styles.courseGradeNumber, { color: course.color }]}>
                      {courseGrade > 0 ? courseGrade.toFixed(1) : '-'}%
                    </Text>
                    <Text style={[styles.courseGPA, { color: colors.textSecondary }]}>
                      GPA: {courseGrade > 0 ? courseGPA.toFixed(1) : '-'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.progressBar, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: course.color, width: `${Math.min(courseGrade, 100)}%` },
                    ]}
                  />
                </View>
                {grades.length === 0 && (
                  <Text style={[styles.courseStats, { color: colors.textSecondary }]}>
                    No grades entered yet
                  </Text>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statText: {
    fontSize: 14,
  },
  statPercentage: {
    fontSize: 24,
    fontWeight: '700',
  },
  gpaNumber: {
    fontSize: 48,
    fontWeight: '700',
  },
  gpaScale: {
    fontSize: 24,
    fontWeight: '500',
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  overdueCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  overdueIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  overdueText: {
    fontSize: 16,
    fontWeight: '700',
  },
  courseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  courseName: {
    fontSize: 13,
  },
  courseGradeContainer: {
    alignItems: 'flex-end',
  },
  courseGradeNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  courseGPA: {
    fontSize: 12,
    marginTop: 2,
  },
  coursePercentage: {
    fontSize: 20,
    fontWeight: '700',
  },
  courseStats: {
    fontSize: 13,
    marginTop: 8,
  },
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
