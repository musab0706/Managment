import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function CourseDetailScreen() {
  const { colors, theme } = useTheme();
  const { courseId } = useLocalSearchParams();
  const isDark = theme === 'dark';

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const [importantNotes, setImportantNotes] = useState<string[]>([]);

  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');

  const [gradeCategories, setGradeCategories] = useState<Array<{ name: string; weight: number; score: number | null }>>([]);

  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [gradeInput, setGradeInput] = useState('');

  const [weeklyChecklist, setWeeklyChecklist] = useState<boolean[]>(Array(12).fill(false));

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const savedCourses = await AsyncStorage.getItem('userCourses');
      if (savedCourses) {
        const courses: Course[] = JSON.parse(savedCourses);
        const foundCourse = courses.find(c => c.id === courseId);
        
        if (foundCourse) {
          setCourse(foundCourse);
          
          // Load course-specific notes
          const notesKey = `course_notes_${courseId}`;
          const savedNotes = await AsyncStorage.getItem(notesKey);
          if (savedNotes) {
            setImportantNotes(JSON.parse(savedNotes));
          } else {
            // Set default notes if professor is available
            if (foundCourse.professor) {
              setImportantNotes([foundCourse.professor]);
            }
          }

          // Load course-specific grade categories
          const gradesKey = `course_grades_${courseId}`;
          const savedGrades = await AsyncStorage.getItem(gradesKey);
          if (savedGrades) {
            setGradeCategories(JSON.parse(savedGrades));
          } else {
            // Set default grade categories
            setGradeCategories([
              { name: 'Assignment 1', weight: 10, score: null },
              { name: 'Assignment 2', weight: 10, score: null },
              { name: 'Midterm', weight: 30, score: null },
              { name: 'Final', weight: 50, score: null },
            ]);
          }

          // Load course-specific weekly checklist
          const weeklyKey = `course_weekly_${courseId}`;
          const savedWeekly = await AsyncStorage.getItem(weeklyKey);
          if (savedWeekly) {
            setWeeklyChecklist(JSON.parse(savedWeekly));
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading course data:', error);
      setLoading(false);
    }
  };

  const saveNotes = async (notes: string[]) => {
    try {
      const notesKey = `course_notes_${courseId}`;
      await AsyncStorage.setItem(notesKey, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const saveGrades = async (grades: Array<{ name: string; weight: number; score: number | null }>) => {
    try {
      const gradesKey = `course_grades_${courseId}`;
      await AsyncStorage.setItem(gradesKey, JSON.stringify(grades));
    } catch (error) {
      console.error('Error saving grades:', error);
    }
  };

  const saveWeeklyChecklist = async (checklist: boolean[]) => {
    try {
      const weeklyKey = `course_weekly_${courseId}`;
      await AsyncStorage.setItem(weeklyKey, JSON.stringify(checklist));
    } catch (error) {
      console.error('Error saving weekly checklist:', error);
    }
  };

  const toggleWeek = (weekIndex: number) => {
    const updated = [...weeklyChecklist];
    updated[weekIndex] = !updated[weekIndex];
    setWeeklyChecklist(updated);
    saveWeeklyChecklist(updated);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      Alert.alert('Empty Note', 'Please enter a note');
      return;
    }

    const updatedNotes = [...importantNotes, newNote.trim()];
    setImportantNotes(updatedNotes);
    saveNotes(updatedNotes);
    setNewNote('');
    setShowAddNoteModal(false);
    Alert.alert('Success', 'Note added successfully!');
  };

  const handleDeleteNote = (index: number) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedNotes = importantNotes.filter((_, i) => i !== index);
            setImportantNotes(updatedNotes);
            saveNotes(updatedNotes);
          },
        },
      ]
    );
  };

  const handleOpenGradeInput = (index: number) => {
    setSelectedCategory(index);
    setGradeInput(gradeCategories[index].score?.toString() || '');
    setShowGradeModal(true);
  };

  const handleSaveGrade = () => {
    if (selectedCategory === null) return;

    const grade = parseFloat(gradeInput);
    const maxScore = gradeCategories[selectedCategory].weight;
    
    if (isNaN(grade) || grade < 0 || grade > maxScore) {
      Alert.alert('Invalid Grade', `Please enter a grade between 0 and ${maxScore}`);
      return;
    }

    const updatedCategories = [...gradeCategories];
    updatedCategories[selectedCategory].score = grade;
    setGradeCategories(updatedCategories);
    saveGrades(updatedCategories);
    setShowGradeModal(false);
    setGradeInput('');
    setSelectedCategory(null);
  };

  const handleClearGrade = () => {
    if (selectedCategory === null) return;

    const updatedCategories = [...gradeCategories];
    updatedCategories[selectedCategory].score = null;
    setGradeCategories(updatedCategories);
    saveGrades(updatedCategories);
    setShowGradeModal(false);
    setGradeInput('');
    setSelectedCategory(null);
  };

  const calculateCurrentGrade = () => {
    let totalScore = 0;

    gradeCategories.forEach(category => {
      if (category.score !== null) {
        totalScore += category.score;
      }
    });

    // Convert to percentage (totalScore is already out of totalWeight)
    if (totalWeight === 0) return 0;
    return (totalScore / totalWeight) * 100;
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

  const currentGrade = calculateCurrentGrade();
  const gradeLetter = getGradeLetter(currentGrade);
  const gradeColor = currentGrade >= 80 ? '#34C759' : currentGrade >= 70 ? '#FF9500' : currentGrade >= 60 ? '#FF9500' : '#FF3B30';

  const totalWeight = gradeCategories.reduce((sum, cat) => sum + cat.weight, 0);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={[styles.backArrow, { color: '#007AFF' }]}>←</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.loadingText, { color: colors.text }]}>Course not found</Text>
      </View>
    );
  }

  const progressPercent = course.progress.total > 0 
    ? Math.round((course.progress.completed / course.progress.total) * 100) 
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backArrow, { color: '#007AFF' }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{course.code}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {course.name}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Progress: {course.progress.completed} of {course.progress.total} tasks ({progressPercent}%)
          </Text>
          <View style={[styles.progressBar, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: '#007AFF', width: `${progressPercent}%` },
              ]}
            />
          </View>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#34C759' }]}>
                {course.progress.completed}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#FF9500' }]}>
                {course.progress.inProgress}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {course.progress.toDo}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Not Started</Text>
            </View>
          </View>
        </View>

        {/* Important Notes */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.notesHeaderContainer}>
            <View style={styles.notesHeader}>
              <View style={[styles.warningIndicator, { backgroundColor: '#FF3B30' }]} />
              <Text style={[styles.cardTitle, { color: '#FF3B30' }]}>IMPORTANT NOTES</Text>
            </View>
            <TouchableOpacity
              style={[styles.addNoteButton, { backgroundColor: '#FF3B30' }]}
              onPress={() => setShowAddNoteModal(true)}
            >
              <Text style={styles.addNoteButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          {importantNotes.map((note, index) => (
            <TouchableOpacity
              key={index}
              style={styles.noteItem}
              onLongPress={() => handleDeleteNote(index)}
              activeOpacity={0.7}
            >
              <View style={[styles.noteBullet, { backgroundColor: '#FF3B30' }]} />
              <Text style={[styles.noteText, { color: colors.text }]}>{note}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grade Calculator */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.calculatorHeader}>
            <View style={[styles.calculatorIndicator, { backgroundColor: '#007AFF' }]} />
            <Text style={[styles.cardTitle, { color: '#007AFF' }]}>GRADE CALCULATOR</Text>
          </View>

          <View style={[styles.gradeTable, { borderColor: colors.border }]}>
            {/* Table Header */}
            <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.tableHeaderText, { color: colors.text }]}>Category</Text>
              <Text style={[styles.tableHeaderText, { color: colors.text }]}>Weight</Text>
              <Text style={[styles.tableHeaderText, { color: colors.text }]}>Score</Text>
            </View>

            {/* Table Rows */}
            {gradeCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tableRow,
                  { borderBottomColor: colors.border },
                  index === gradeCategories.length - 1 && styles.lastRow,
                ]}
                onPress={() => handleOpenGradeInput(index)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                <Text style={[styles.categoryWeight, { color: colors.text }]}>
                  {category.weight}%
                </Text>
                <Text style={[
                  styles.categoryScore, 
                  { color: category.score !== null ? '#007AFF' : colors.textSecondary }
                ]}>
                  {category.score !== null ? `${category.score.toFixed(1)}` : 'Tap to add'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.totalWeight}>
            <Text style={[styles.totalText, { color: colors.textSecondary }]}>
              Current Grade
            </Text>
            <Text style={[styles.currentGrade, { color: gradeColor }]}>
              {currentGrade.toFixed(1)}% ({gradeLetter})
            </Text>
          </View>
        </View>

        {/* Weekly Checklist */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.weeklyHeader}>
            <View style={[styles.weeklyIndicator, { backgroundColor: '#34C759' }]} />
            <Text style={[styles.cardTitle, { color: '#34C759' }]}>WEEKLY CHECKLIST</Text>
          </View>
          <Text style={[styles.weeklySubtitle, { color: colors.textSecondary }]}>
            Track your weekly progress through the semester
          </Text>

          <View style={styles.weekGrid}>
            {Array.from({ length: 12 }, (_, i) => i).map((weekIndex) => (
              <TouchableOpacity
                key={weekIndex}
                style={[
                  styles.weekBox,
                  { 
                    backgroundColor: weeklyChecklist[weekIndex] 
                      ? '#34C759' 
                      : isDark ? '#2C2C2E' : '#F2F2F7',
                    borderColor: weeklyChecklist[weekIndex] 
                      ? '#34C759' 
                      : isDark ? '#3A3A3C' : '#E5E5EA'
                  }
                ]}
                onPress={() => toggleWeek(weekIndex)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.weekNumber,
                  { color: weeklyChecklist[weekIndex] ? '#fff' : colors.text }
                ]}>
                  {weekIndex + 1}
                </Text>
                {weeklyChecklist[weekIndex] && (
                  <Text style={styles.weekCheckmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.weeklyProgress}>
            <Text style={[styles.weeklyProgressText, { color: colors.textSecondary }]}>
              {weeklyChecklist.filter(w => w).length} / 12 weeks completed
            </Text>
            <Text style={[styles.weeklyProgressPercent, { color: '#34C759' }]}>
              {Math.round((weeklyChecklist.filter(w => w).length / 12) * 100)}%
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Note Modal */}
      <Modal
        visible={showAddNoteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddNoteModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add Important Note</Text>
                <TouchableOpacity onPress={() => setShowAddNoteModal(false)}>
                  <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalForm}>
                <TextInput
                  style={[styles.noteInput, { 
                    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                    color: colors.text
                  }]}
                  placeholder="Enter important note..."
                  placeholderTextColor={colors.textSecondary}
                  value={newNote}
                  onChangeText={setNewNote}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: '#FF3B30' }]}
                  onPress={handleAddNote}
                >
                  <Text style={styles.submitButtonText}>Add Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Grade Input Modal */}
      <Modal
        visible={showGradeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGradeModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedCategory !== null ? gradeCategories[selectedCategory].name : ''}
                </Text>
                <TouchableOpacity onPress={() => setShowGradeModal(false)}>
                  <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalForm}>
                <View style={styles.gradeInputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    Enter your score (0-{selectedCategory !== null ? gradeCategories[selectedCategory].weight : 100})
                  </Text>
                  <TextInput
                    style={[styles.gradeTextInput, { 
                      backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                      color: colors.text
                    }]}
                    placeholder={selectedCategory !== null ? `e.g., ${(gradeCategories[selectedCategory].weight * 0.85).toFixed(1)}` : '0'}
                    placeholderTextColor={colors.textSecondary}
                    value={gradeInput}
                    onChangeText={(text) => {
                      // Only allow numbers and decimal point
                      if (/^\d*\.?\d*$/.test(text)) {
                        setGradeInput(text);
                      }
                    }}
                    keyboardType="decimal-pad"
                    autoFocus
                  />
                  {selectedCategory !== null && (
                    <Text style={[styles.weightInfo, { color: colors.textSecondary }]}>
                      Worth {gradeCategories[selectedCategory].weight}% of final grade
                    </Text>
                  )}
                </View>

                <View style={styles.buttonRow}>
                  {gradeCategories[selectedCategory || 0]?.score !== null && (
                    <TouchableOpacity
                      style={[styles.clearButton, { borderColor: colors.border }]}
                      onPress={handleClearGrade}
                    >
                      <Text style={[styles.clearButtonText, { color: colors.text }]}>Clear</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.submitButton, { 
                      backgroundColor: '#007AFF',
                      flex: gradeCategories[selectedCategory || 0]?.score !== null ? 1 : undefined
                    }]}
                    onPress={handleSaveGrade}
                  >
                    <Text style={styles.submitButtonText}>Save Grade</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: '400',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  notesHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addNoteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addNoteButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  warningIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  noteBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  noteText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  calculatorIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  gradeTable: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  categoryName: {
    fontSize: 14,
    flex: 1,
  },
  categoryWeight: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  categoryScore: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  totalWeight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  totalText: {
    fontSize: 13,
  },
  currentGrade: {
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
  noteInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    minHeight: 120,
    marginBottom: 20,
  },
  submitButton: {
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
  gradeInputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  gradeTextInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    textAlign: 'center',
  },
  weightInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  weeklyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  weeklyIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  weeklySubtitle: {
    fontSize: 13,
    marginBottom: 20,
  },
  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  weekBox: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  weekNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  weekCheckmark: {
    position: 'absolute',
    top: 4,
    right: 6,
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  weeklyProgressText: {
    fontSize: 14,
  },
  weeklyProgressPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
});
