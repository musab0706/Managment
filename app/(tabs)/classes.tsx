import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Animated, PanResponder, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  color: string;
  icon: string;
  progress: {
    completed: number;
    inProgress: number;
    toDo: number;
    total: number;
  };
  currentGrade: number;
}

// Swipeable Course Card Component
function SwipeableCourseCard({ 
  course, 
  onDelete, 
  onPress,
  colors,
  isDark,
  progressPercent,
  gradeColor,
  gradeLetter
}: { 
  course: Course;
  onDelete: (resetFn: () => void) => void;
  onPress: () => void;
  colors: any;
  isDark: boolean;
  progressPercent: number;
  gradeColor: string;
  gradeLetter: string;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only trigger swipe if horizontal movement is significant and greater than vertical
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -200));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -60) {
          Animated.spring(translateX, {
            toValue: -200,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start();
        }
      },
    })
  ).current;

  const handleDelete = () => {
    onDelete(resetPosition);
  };

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  };

  return (
    <View style={styles.swipeContainer}>
      {/* Delete Button Background */}
      <View style={styles.deleteBackground}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Course Card */}
      <Animated.View
        style={[
          styles.animatedCardWrapper,
          { 
            transform: [{ translateX }],
            backgroundColor: colors.card,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.courseCard}
          onPress={onPress}
          activeOpacity={0.7}
        >
          {/* Course Header */}
          <View style={styles.courseHeader}>
            <View style={[styles.colorIndicator, { backgroundColor: course.color }]} />
            <View style={styles.courseInfo}>
              <Text style={[styles.courseCode, { color: colors.text }]}>{course.code}</Text>
              <Text style={[styles.courseName, { color: colors.textSecondary }]}>
                {course.name}
              </Text>
              <Text style={[styles.professor, { color: colors.textSecondary }]}>
                {course.professor}
              </Text>
            </View>
            <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                Progress
              </Text>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {course.progress.completed} of {course.progress.total} tasks
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: course.color, width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>

          {/* Task Stats */}
          <View style={styles.taskStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#34C759' }]}>
                {course.progress.completed}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Done</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#FF9500' }]}>
                {course.progress.inProgress}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                In Progress
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {course.progress.toDo}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>To Do</Text>
            </View>
          </View>

          {/* Current Grade */}
          <View style={styles.gradeSection}>
            <Text style={[styles.gradeLabel, { color: colors.textSecondary }]}>
              Current Grade
            </Text>
            <Text style={[styles.gradeValue, { color: gradeColor }]}>
              {course.currentGrade.toFixed(1)}% ({gradeLetter})
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function ClassesScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // University of Guelph courses list
  const uofgCourses = [
    { code: 'ACCT*1220', name: 'Introductory Financial Accounting' },
    { code: 'ACCT*1240', name: 'Applied Financial Accounting' },
    { code: 'ACCT*2230', name: 'Management Accounting' },
    { code: 'ANSC*1210', name: 'Introduction to Animal Science' },
    { code: 'ANSC*2340', name: 'Animal Nutrition' },
    { code: 'ANSC*3080', name: 'Dairy Cattle Feeding and Management' },
    { code: 'ANTH*1150', name: 'People and Cultures of the World' },
    { code: 'BIOC*2580', name: 'Introduction to Biochemistry' },
    { code: 'BIOC*3560', name: 'Molecular Biology' },
    { code: 'BIOL*1030', name: 'Biology I' },
    { code: 'BIOL*1040', name: 'Biology II' },
    { code: 'BIOL*1050', name: 'Biology of Microorganisms' },
    { code: 'BIOL*1070', name: 'Discovering Biodiversity' },
    { code: 'BIOL*1090', name: 'Biological Concepts' },
    { code: 'BIOL*2060', name: 'Ecology' },
    { code: 'BIOL*2400', name: 'Genetics' },
    { code: 'BOT*2100', name: 'Plant Biodiversity' },
    { code: 'BUS*1200', name: 'Introduction to Business Management' },
    { code: 'BUS*2230', name: 'Management I' },
    { code: 'BUS*2650', name: 'Human Resources Management' },
    { code: 'CHEM*1040', name: 'General Chemistry I' },
    { code: 'CHEM*1050', name: 'General Chemistry II' },
    { code: 'CHEM*2060', name: 'Structure and Bonding' },
    { code: 'CHEM*2480', name: 'Organic Chemistry I' },
    { code: 'CIS*1200', name: 'Introduction to Computing' },
    { code: 'CIS*1300', name: 'Programming' },
    { code: 'CIS*1500', name: 'Introduction to Programming' },
    { code: 'CIS*2500', name: 'Intermediate Programming' },
    { code: 'CIS*2520', name: 'Data Structures' },
    { code: 'CIS*2750', name: 'Software Systems Development and Integration' },
    { code: 'CIS*3110', name: 'Operating Systems I' },
    { code: 'CIS*3120', name: 'Digital Systems' },
    { code: 'CIS*3190', name: 'Software for Legacy Systems' },
    { code: 'CIS*3210', name: 'Computer Networks' },
    { code: 'CIS*3490', name: 'The Analysis and Design of Computer Algorithms' },
    { code: 'CIS*3750', name: 'System Analysis and Design in Applications' },
    { code: 'CIS*4650', name: 'Compilers' },
    { code: 'CROP*2240', name: 'Soil Science' },
    { code: 'ECON*1050', name: 'Introductory Microeconomics' },
    { code: 'ECON*1100', name: 'Introductory Macroeconomics' },
    { code: 'ECON*2310', name: 'Economic Development' },
    { code: 'ECON*2410', name: 'Money and Banking' },
    { code: 'ECON*2770', name: 'Quantitative Methods' },
    { code: 'ENGG*1100', name: 'Engineering and Design I' },
    { code: 'ENGG*1500', name: 'Engineering and Design II' },
    { code: 'ENGG*2100', name: 'Engineering Mechanics - Statics' },
    { code: 'ENGG*2120', name: 'Material Science' },
    { code: 'ENGG*2160', name: 'Engineering Mechanics - Dynamics' },
    { code: 'ENGG*2230', name: 'Thermodynamics' },
    { code: 'ENGG*2340', name: 'Fluid Mechanics' },
    { code: 'ENGG*2400', name: 'Engineering Systems Analysis' },
    { code: 'ENGG*2450', name: 'Circuits and Machines' },
    { code: 'ENGG*3050', name: 'Engineering Economics' },
    { code: 'ENGG*3240', name: 'Water Resources Engineering' },
    { code: 'ENGG*3260', name: 'Soil and Water Quality Engineering' },
    { code: 'ENGG*3280', name: 'Hydrology and Water Resources' },
    { code: 'ENGG*3410', name: 'Systems and Control' },
    { code: 'ENGG*3640', name: 'Bioprocess Engineering' },
    { code: 'ENGL*1080', name: 'Introduction to Literary Studies' },
    { code: 'ENGL*1200', name: 'Literary Studies I' },
    { code: 'ENVS*1030', name: 'Environmental Science' },
    { code: 'ENVS*2060', name: 'Environmental Citizenship' },
    { code: 'FOOD*2010', name: 'Principles of Food Science' },
    { code: 'FOOD*2400', name: 'Food Microbiology' },
    { code: 'GEOG*1220', name: 'Human Geography' },
    { code: 'GEOG*1300', name: 'Earth Systems' },
    { code: 'GEOG*2210', name: 'Environment and Resources' },
    { code: 'GEOG*2460', name: 'Introduction to GIS' },
    { code: 'HIST*1010', name: 'The Historian\'s Craft' },
    { code: 'HIST*1150', name: 'Canadian History to 1867' },
    { code: 'HTM*2700', name: 'Introduction to Hospitality and Tourism Management' },
    { code: 'HK*2810', name: 'Introductory Exercise Physiology' },
    { code: 'HK*3810', name: 'Exercise Biochemistry and Metabolism' },
    { code: 'MATH*1030', name: 'Business Mathematics' },
    { code: 'MATH*1080', name: 'Elements of Calculus I' },
    { code: 'MATH*1160', name: 'Linear Algebra I' },
    { code: 'MATH*1200', name: 'Calculus I' },
    { code: 'MATH*1210', name: 'Calculus II' },
    { code: 'MATH*2000', name: 'Calculus III' },
    { code: 'MATH*2130', name: 'Differential Equations' },
    { code: 'MATH*2150', name: 'Discrete Structures' },
    { code: 'MATH*2200', name: 'Advanced Calculus I' },
    { code: 'MATH*2270', name: 'Applied Differential Equations' },
    { code: 'MBG*2040', name: 'Genetics' },
    { code: 'MBG*3300', name: 'Molecular Biology' },
    { code: 'MICR*2420', name: 'Introductory Microbiology' },
    { code: 'MICR*3230', name: 'General Virology' },
    { code: 'MCS*2600', name: 'Scientific Communication' },
    { code: 'MUSC*1150', name: 'Introduction to Music History' },
    { code: 'NEUR*2000', name: 'Neurobiology' },
    { code: 'NUTR*1010', name: 'Introduction to Nutrition' },
    { code: 'NUTR*3090', name: 'Nutrition Through the Life Cycle' },
    { code: 'PHIL*1010', name: 'Introduction to Philosophy' },
    { code: 'PHIL*2600', name: 'Ethics' },
    { code: 'PHYS*1010', name: 'Introductory Physics' },
    { code: 'PHYS*1020', name: 'Introductory Physics II' },
    { code: 'PHYS*1070', name: 'Physics I' },
    { code: 'PHYS*1080', name: 'Physics II' },
    { code: 'PHYS*1300', name: 'Wave Motion, Electricity, Magnetism and Optics' },
    { code: 'PSYC*1000', name: 'Introductory Psychology' },
    { code: 'PSYC*2360', name: 'Personality' },
    { code: 'PSYC*2410', name: 'Social Psychology' },
    { code: 'PSYC*2650', name: 'Cognitive Psychology' },
    { code: 'POLS*1150', name: 'Introduction to Politics and Government' },
    { code: 'POLS*2250', name: 'International Relations' },
    { code: 'SOC*1100', name: 'Introduction to Sociology' },
    { code: 'SOC*2080', name: 'Social Inequality' },
    { code: 'SPAN*1100', name: 'Introductory Spanish I' },
    { code: 'STAT*2040', name: 'Statistics I' },
    { code: 'STAT*2060', name: 'Statistics for Business Decisions' },
    { code: 'STAT*2080', name: 'Introductory Applied Statistics I' },
    { code: 'STAT*2120', name: 'Probability and Applied Statistics I' },
    { code: 'TOX*2000', name: 'Introduction to Toxicology' },
    { code: 'UNIV*1200', name: 'First Year Seminar' },
    { code: 'ZOO*2090', name: 'Animal Diversity' },
    { code: 'ZOO*3200', name: 'Animal Behaviour' },
  ].sort((a, b) => a.code.localeCompare(b.code));

  const [courses, setCourses] = useState<Course[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourseCode, setSelectedCourseCode] = useState('');
  const [professor, setProfessor] = useState('');

  const availableColors = ['#FF3B30', '#FF9500', '#007AFF', '#34C759', '#5856D6', '#AF52DE', '#FF2D55'];

  // Load courses from AsyncStorage
  useEffect(() => {
    loadCourses();
  }, []);

  // Refresh courses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCourses();
    }, [])
  );

  const loadCourses = async () => {
    try {
      const savedCourses = await AsyncStorage.getItem('userCourses');
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses));
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const saveCourses = async (updatedCourses: Course[]) => {
    try {
      await AsyncStorage.setItem('userCourses', JSON.stringify(updatedCourses));
      
      // Also update the courses list in preferences for settings sync
      const courseCodes = updatedCourses.map(c => c.code);
      const prefs = await AsyncStorage.getItem('userPreferences');
      if (prefs) {
        const preferences = JSON.parse(prefs);
        preferences.courses = courseCodes;
        await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
      }
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  };

  const getFilteredCourses = () => {
    if (!courseSearch.trim()) return uofgCourses;
    const search = courseSearch.toLowerCase();
    return uofgCourses.filter(course => 
      course.code.toLowerCase().includes(search) || 
      course.name.toLowerCase().includes(search)
    );
  };

  const handleAddCourse = () => {
    if (!selectedCourseCode) {
      Alert.alert('Missing Information', 'Please select a course');
      return;
    }

    // Check if course already exists
    if (courses.some(c => c.code === selectedCourseCode)) {
      Alert.alert('Duplicate Course', 'This course is already in your list');
      return;
    }

    const courseInfo = uofgCourses.find(c => c.code === selectedCourseCode);
    if (!courseInfo) return;

    const usedColors = courses.map(c => c.color);
    const availableColor = availableColors.find(color => !usedColors.includes(color)) || availableColors[0];

    const course: Course = {
      id: Date.now().toString(),
      code: courseInfo.code,
      name: courseInfo.name,
      professor: professor.trim() || '',
      color: availableColor,
      icon: '',
      progress: {
        completed: 0,
        inProgress: 0,
        toDo: 0,
        total: 0,
      },
      currentGrade: 0,
    };

    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    
    setSelectedCourseCode('');
    setProfessor('');
    setCourseSearch('');
    setShowAddModal(false);
    Alert.alert('Success', 'Class added successfully!');
  };

  const handleDeleteCourse = async (courseId: string, courseName: string, resetFn: () => void) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete ${courseName}? This will also delete all notes, grades, and reminders for this class.`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => resetFn() // Reset card position when cancelled
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove course from list
              const updatedCourses = courses.filter(c => c.id !== courseId);
              setCourses(updatedCourses);
              await saveCourses(updatedCourses);

              // Delete course-specific data
              await AsyncStorage.removeItem(`course_notes_${courseId}`);
              await AsyncStorage.removeItem(`course_grades_${courseId}`);
              await AsyncStorage.removeItem(`course_weekly_${courseId}`);

              // Remove course from reminder sections
              const storedSections = await AsyncStorage.getItem('reminderSections');
              if (storedSections) {
                const sections = JSON.parse(storedSections);
                const updatedSections = sections.filter((s: any) => s.id !== courseId);
                await AsyncStorage.setItem('reminderSections', JSON.stringify(updatedSections));
              }

              // Remove all reminders associated with this course
              const storedReminders = await AsyncStorage.getItem('reminders');
              if (storedReminders) {
                const reminders = JSON.parse(storedReminders);
                const updatedReminders = reminders.filter((r: any) => r.sectionId !== courseId);
                await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
              }
            } catch (error) {
              console.error('Error deleting course data:', error);
            }
          },
        },
      ]
    );
  };

  const getProgressPercentage = (course: Course) => {
    return Math.round((course.progress.completed / course.progress.total) * 100);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 80) return '#34C759';
    if (grade >= 70) return '#FF9500';
    if (grade >= 60) return '#FF9500';
    return '#FF3B30';
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return 'A+';
    if (grade >= 85) return 'A';
    if (grade >= 80) return 'A-';
    if (grade >= 77) return 'B+';
    if (grade >= 73) return 'B';
    if (grade >= 70) return 'B-';
    if (grade >= 67) return 'C+';
    if (grade >= 63) return 'C';
    if (grade >= 60) return 'C-';
    if (grade >= 57) return 'D+';
    if (grade >= 53) return 'D';
    if (grade >= 50) return 'D-';
    return 'F';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Classes</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {courses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No classes added yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Tap "+ Add Class" to get started
            </Text>
          </View>
        ) : (
          courses.map((course) => {
            const progressPercent = getProgressPercentage(course);
            const gradeColor = getGradeColor(course.currentGrade);
            const gradeLetter = getGradeLetter(course.currentGrade);

            return (
              <SwipeableCourseCard
                key={course.id}
                course={course}
                onDelete={(resetFn) => handleDeleteCourse(course.id, course.code, resetFn)}
                onPress={() => router.push({ pathname: '/course-detail', params: { courseId: course.id } })}
                colors={colors}
                isDark={isDark}
                progressPercent={progressPercent}
                gradeColor={gradeColor}
                gradeLetter={gradeLetter}
              />
            );
          })
        )}
      </ScrollView>

      {/* Add Class Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Class</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Course Search and Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Search Course</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                    color: colors.text
                  }]}
                  placeholder="Search by code or name..."
                  placeholderTextColor={colors.textSecondary}
                  value={courseSearch}
                  onChangeText={setCourseSearch}
                />
              </View>

              {/* Selected Course Display */}
              {selectedCourseCode && (
                <View style={[styles.selectedCourseDisplay, { 
                  backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                  borderColor: colors.primary
                }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.selectedCourseCode, { color: colors.text }]}>
                      {selectedCourseCode}
                    </Text>
                    <Text style={[styles.selectedCourseName, { color: colors.textSecondary }]}>
                      {uofgCourses.find(c => c.code === selectedCourseCode)?.name}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setSelectedCourseCode('');
                    setCourseSearch('');
                  }}>
                    <Text style={[styles.clearSelection, { color: colors.primary }]}>Change</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Course List */}
              {!selectedCourseCode && courseSearch && (
                <ScrollView 
                  style={styles.courseDropdown}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {getFilteredCourses().slice(0, 10).map((course) => (
                    <TouchableOpacity
                      key={course.code}
                      style={[styles.courseOption, {
                        backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                      }]}
                      onPress={() => {
                        setSelectedCourseCode(course.code);
                        setCourseSearch('');
                      }}
                    >
                      <View>
                        <Text style={[styles.courseCodeText, { color: colors.text }]}>
                          {course.code}
                        </Text>
                        <Text style={[styles.courseNameText, { color: colors.textSecondary }]}>
                          {course.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {getFilteredCourses().length === 0 && (
                    <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                      No courses found
                    </Text>
                  )}
                </ScrollView>
              )}

              {/* Professor Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Professor (Optional)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                    color: colors.text
                  }]}
                  placeholder="e.g., Dr. Smith (optional)"
                  placeholderTextColor={colors.textSecondary}
                  value={professor}
                  onChangeText={setProfessor}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleAddCourse}
              >
                <Text style={styles.submitButtonText}>Add Class</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  swipeContainer: {
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
  },
  deleteBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 24,
    borderRadius: 16,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  animatedCardWrapper: {
    borderRadius: 16,
  },
  courseCard: {
    borderRadius: 16,
    padding: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  courseName: {
    fontSize: 14,
    marginBottom: 2,
  },
  professor: {
    fontSize: 12,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 13,
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
  taskStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  gradeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  gradeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  gradeValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 28,
    fontWeight: '300',
  },
  modalForm: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  submitButton: {
    marginTop: 12,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedCourseDisplay: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCourseCode: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectedCourseName: {
    fontSize: 14,
  },
  clearSelection: {
    fontSize: 14,
    fontWeight: '600',
  },
  courseDropdown: {
    maxHeight: 200,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  courseOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
  },
  courseCodeText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  courseNameText: {
    fontSize: 13,
  },
  noResultsText: {
    padding: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
