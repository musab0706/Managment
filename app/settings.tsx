import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { router } from 'expo-router';
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

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [preferences, setPreferences] = useState({
    morningNotification: 'no',
    morningTime: '7am',
    weekStart: 'monday',
    major: 'Computer Science',
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [majorSearch, setMajorSearch] = useState('');

  // Comprehensive list of University of Guelph majors
  const uofgMajors = [
    'Accounting',
    'Agricultural Business',
    'Animal Biology',
    'Animal Science',
    'Anthropology',
    'Applied Human Nutrition',
    'Applied Mathematics',
    'Biochemistry',
    'Biological and Medical Physics',
    'Biological and Pharmaceutical Chemistry',
    'Biological Engineering',
    'Biological Science',
    'Biomedical Engineering',
    'Biomedical Science',
    'Biomedical Toxicology',
    'Business Administration',
    'Chemical Engineering',
    'Chemical Physics',
    'Chemistry',
    'Civil Engineering',
    'Classical Studies',
    'Computer Engineering',
    'Computer Science',
    'Criminal Justice and Public Policy',
    'Crop, Horticulture and Turfgrass Sciences',
    'Economics',
    'Engineering Systems and Computing',
    'English',
    'Environmental Biology',
    'Environmental Design and Rural Development',
    'Environmental Engineering',
    'Environmental Geoscience',
    'Environmental Governance',
    'Environmental Management',
    'Environmental Science',
    'Equine Management',
    'European Studies',
    'Food, Agricultural and Resource Economics',
    'Food Industry Management',
    'Food Science',
    'French Studies',
    'General Business',
    'Geography',
    'History',
    'Hospitality and Tourism Management',
    'Human Kinetics',
    'International Development',
    'Management',
    'Management Economics and Finance',
    'Marine and Freshwater Biology',
    'Marketing Management',
    'Mathematical Economics',
    'Mathematical Physics',
    'Mathematical Science',
    'Mathematics',
    'Mechanical Engineering',
    'Microbiology',
    'Molecular Biology and Genetics',
    'Music',
    'Nanoscience',
    'Neuroscience',
    'Nutritional and Nutraceutical Sciences',
    'Philosophy',
    'Physics',
    'Plant Science',
    'Political Science',
    'Psychology',
    'Public Management',
    'Real Estate and Housing',
    'Software Engineering',
    'Sociology',
    'Spanish and Hispanic Studies',
    'Statistics',
    'Studio Art',
    'Theatre Studies',
    'Theoretical Physics',
    'Toxicology',
    'Undeclared',
    'Water Resources Engineering',
    'Wildlife Biology and Conservation',
    'Zoology',
  ].sort();

  const getFilteredMajors = () => {
    if (!majorSearch.trim()) return uofgMajors;
    return uofgMajors.filter(major => 
      major.toLowerCase().includes(majorSearch.toLowerCase())
    );
  };

  useEffect(() => {
    loadPreferences();
    loadCourses();
  }, []);

  // Reload courses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCourses();
    }, [])
  );

  const loadCourses = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem('userCourses');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    }
  };

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('userPreferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({
          morningNotification: parsed.morningNotification || 'no',
          morningTime: parsed.morningTime || '7am',
          weekStart: parsed.weekStart || 'monday',
          major: parsed.major || 'Computer Science',
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async (key: string, value: string) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      
      const saved = await AsyncStorage.getItem('userPreferences');
      const current = saved ? JSON.parse(saved) : {};
      await AsyncStorage.setItem('userPreferences', JSON.stringify({ ...current, [key]: value }));
      
      Alert.alert('Saved', 'Your preference has been updated');
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    studentId: '0123456',
    schoolEmail: 'jdoe@uoguelph.ca',
    university: 'University of Guelph',
    major: 'Computer Science',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backArrow, { color: '#007AFF' }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT INFO</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Name</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>
                {userData.firstName} {userData.lastName}
              </Text>
            </View>
          </View>

          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Student ID</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>
                {userData.studentId}
              </Text>
            </View>
          </View>

          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>
                {userData.schoolEmail}
              </Text>
            </View>
          </View>

          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>University</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>
                {userData.university}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.settingCard, { backgroundColor: colors.card }]}
            onPress={() => setShowMajorModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Major</Text>
              <View style={styles.settingValueContainer}>
                <Text style={[styles.settingValue, { color: colors.text }]}>
                  {preferences.major}
                </Text>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#d1d5db', true: '#8b9dc3' }}
                thumbColor="#fff"
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Morning Notification</Text>
              <Switch
                value={preferences.morningNotification === 'yes'}
                onValueChange={(value) => savePreferences('morningNotification', value ? 'yes' : 'no')}
                trackColor={{ false: '#d1d5db', true: '#8b9dc3' }}
                thumbColor="#fff"
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>

          {preferences.morningNotification === 'yes' && (
            <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary, marginBottom: 12 }]}>
                Morning Notification Time
              </Text>
              <View style={styles.timeOptions}>
                {['6am', '7am', '8am', '9am'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeButton,
                      { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                      preferences.morningTime === time && { backgroundColor: '#8b9dc3' }
                    ]}
                    onPress={() => savePreferences('morningTime', time)}
                  >
                    <Text style={[
                      styles.timeButtonText,
                      { color: preferences.morningTime === time ? '#fff' : colors.text }
                    ]}>
                      {time.replace('am', ':00 AM')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.settingLabel, { color: colors.textSecondary, marginBottom: 12 }]}>
              Week Starts On
            </Text>
            <View style={styles.weekStartOptions}>
              {[
                { label: 'Saturday', value: 'saturday' },
                { label: 'Sunday', value: 'sunday' },
                { label: 'Monday', value: 'monday' },
              ].map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.weekStartButton,
                    { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                    preferences.weekStart === day.value && { backgroundColor: '#8b9dc3' }
                  ]}
                  onPress={() => savePreferences('weekStart', day.value)}
                >
                  <Text style={[
                    styles.weekStartButtonText,
                    { color: preferences.weekStart === day.value ? '#fff' : colors.text }
                  ]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Courses Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CURRENT COURSES</Text>
          
          <TouchableOpacity 
            style={[styles.settingCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(tabs)/classes')}
            activeOpacity={0.7}
          >
            {courses.length > 0 ? (
              <>
                <View style={styles.coursesContainer}>
                  {courses.slice(0, 6).map((course) => (
                    <View 
                      key={course.id}
                      style={[styles.courseChip, { backgroundColor: course.color + '20', borderColor: course.color, borderWidth: 1 }]}
                    >
                      <Text style={[styles.courseChipText, { color: course.color }]}>
                        {course.code}
                      </Text>
                    </View>
                  ))}
                  {courses.length > 6 && (
                    <View 
                      style={[styles.courseChip, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                    >
                      <Text style={[styles.courseChipText, { color: colors.textSecondary }]}>
                        +{courses.length - 6} more
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.manageCoursesText, { color: colors.primary }]}>
                  Tap to manage courses →
                </Text>
              </>
            ) : (
              <View>
                <Text style={[styles.noCoursesText, { color: colors.textSecondary }]}>
                  No courses added yet
                </Text>
                <Text style={[styles.manageCoursesText, { color: colors.primary }]}>
                  Tap to add courses →
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Major Selection Modal */}
      <Modal
        visible={showMajorModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMajorModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Your Major</Text>
              <TouchableOpacity onPress={() => {
                setShowMajorModal(false);
                setMajorSearch('');
              }}>
                <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, { 
                  backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                  color: colors.text
                }]}
                placeholder="Search majors..."
                placeholderTextColor={colors.textSecondary}
                value={majorSearch}
                onChangeText={setMajorSearch}
                autoCapitalize="words"
              />
            </View>

            <ScrollView 
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {getFilteredMajors().map((major) => (
                <TouchableOpacity
                  key={major}
                  style={[
                    styles.majorOption,
                    { 
                      backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                      borderColor: preferences.major === major ? '#8b9dc3' : 'transparent'
                    },
                    preferences.major === major && styles.selectedMajor
                  ]}
                  onPress={() => {
                    savePreferences('major', major);
                    setShowMajorModal(false);
                    setMajorSearch('');
                  }}
                >
                  <Text style={[
                    styles.majorOptionText,
                    { color: preferences.major === major ? '#8b9dc3' : colors.text }
                  ]}>
                    {major}
                  </Text>
                  {preferences.major === major && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
              {getFilteredMajors().length === 0 && (
                <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
                  No majors found matching "{majorSearch}"
                </Text>
              )}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '400',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  weekStartOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  weekStartButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  weekStartButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
    maxHeight: '70%',
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 28,
    fontWeight: '300',
  },
  modalScroll: {
    paddingHorizontal: 24,
  },
  majorOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
  },
  selectedMajor: {
    borderColor: '#8b9dc3',
  },
  majorOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 20,
    color: '#8b9dc3',
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  noResultsText: {
    padding: 20,
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 4,
  },
  courseChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noCoursesText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  manageCoursesText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
});
