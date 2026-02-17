import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
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

export default function GPACalculatorScreen() {
  const { colors } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseGrades, setCourseGrades] = useState<{ [courseId: string]: GradeCategory[] }>({});
  const [loading, setLoading] = useState(true);

  // Load courses and their grades
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
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading courses and grades:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesAndGrades();
  }, []);

  // Reload when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCoursesAndGrades();
    }, [])
  );

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

  const calculateOverallGPA = () => {
    let totalGPA = 0;
    let courseCount = 0;

    courses.forEach(course => {
      const grades = courseGrades[course.id];
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

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>GPA Calculator</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>GPA Calculator</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Overall GPA Card */}
      <View style={[styles.overallCard, { backgroundColor: '#667eea' }]}>
        <Text style={styles.overallLabel}>Overall GPA</Text>
        <Text style={styles.overallGPA}>{calculateOverallGPA()}</Text>
        <Text style={styles.overallSubtext}>
          Based on {courses.filter(c => courseGrades[c.id] && courseGrades[c.id].length > 0).length} course{courses.filter(c => courseGrades[c.id] && courseGrades[c.id].length > 0).length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {courses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No courses added yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Add courses in the Classes tab to see GPA calculations
            </Text>
          </View>
        ) : (
          courses.map((course) => {
            const grades = courseGrades[course.id] || [];
            const courseGrade = calculateCourseGrade(grades);
            const courseGPA = gradeToGPA(courseGrade);

            return (
              <View key={course.id} style={[styles.courseCard, { backgroundColor: colors.card }]}>
                {/* Course Header */}
                <View style={styles.courseHeader}>
                  <View style={[styles.colorIndicator, { backgroundColor: course.color }]} />
                  <View style={styles.courseInfo}>
                    <Text style={[styles.courseCode, { color: colors.text }]}>{course.code}</Text>
                    <Text style={[styles.courseName, { color: colors.textSecondary }]}>{course.name}</Text>
                  </View>
                  <View style={styles.courseGrades}>
                    <Text style={[styles.courseGrade, { color: colors.text }]}>
                      {courseGrade > 0 ? `${courseGrade.toFixed(1)}%` : '-'}
                    </Text>
                    <Text style={[styles.courseGPA, { color: colors.textSecondary }]}>
                      GPA: {courseGrade > 0 ? courseGPA.toFixed(1) : '-'}
                    </Text>
                  </View>
                </View>

                {/* Grade Breakdown */}
                {grades.length > 0 ? (
                  <>
                    <View style={styles.gradeBreakdown}>
                      {grades.map((item, idx) => (
                        <View key={idx} style={styles.gradeItem}>
                          <View style={styles.gradeItemLeft}>
                            <Text style={[styles.gradeItemName, { color: colors.text }]}>{item.name}</Text>
                            <Text style={[styles.gradeItemWeight, { color: colors.textSecondary }]}>{item.weight}%</Text>
                          </View>
                          <Text style={[styles.gradeItemScore, { color: colors.primary }]}>
                            {item.score !== null ? `${item.score}` : '-'}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Progress Bar */}
                    {courseGrade > 0 && (
                      <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { backgroundColor: '#e0e0e0' }]}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${courseGrade}%`, 
                                backgroundColor: course.color 
                              }
                            ]} 
                          />
                        </View>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.noGradesContainer}>
                    <Text style={[styles.noGradesText, { color: colors.textSecondary }]}>
                      No grades entered yet
                    </Text>
                    <Text style={[styles.noGradesSubtext, { color: colors.textSecondary }]}>
                      Tap the course in Classes → Grade Calculator to add grades
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            GPA Scale: 4.0 (A+) to 0.0 (F)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  overallCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 8,
  },
  overallGPA: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  overallSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  courseCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  courseName: {
    fontSize: 13,
  },
  courseGrades: {
    alignItems: 'flex-end',
  },
  courseGrade: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  courseGPA: {
    fontSize: 12,
  },
  gradeBreakdown: {
    gap: 8,
    marginBottom: 16,
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  gradeItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradeItemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  gradeItemWeight: {
    fontSize: 12,
  },
  gradeItemScore: {
    fontSize: 15,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 13,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
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
  noGradesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noGradesText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  noGradesSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
});
