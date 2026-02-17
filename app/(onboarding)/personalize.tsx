import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/ThemeContext';

export default function PersonalizeScreen() {
  const { setTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    theme: 'light',
    major: '',
    courses: [] as string[],
    morningNotification: '',
    morningTime: '',
    weekStart: '',
  });
  const [showMorningTime, setShowMorningTime] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [majorSearch, setMajorSearch] = useState('');
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

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
    'Mechatronics Engineering',
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

  // Comprehensive list of University of Guelph courses
  const uofgCourses = [
    { code: 'ENGG*1100', name: 'Engineering and Design I' },
    { code: 'ENGG*1500', name: 'Engineering and Design II' },
    { code: 'ENGG*2100', name: 'Engineering Mechanics - Statics' },
    { code: 'ENGG*2120', name: 'Material Science' },
    { code: 'ENGG*2160', name: 'Engineering Mechanics - Dynamics' },
    { code: 'ENGG*2230', name: 'Thermodynamics' },
    { code: 'ENGG*2340', name: 'Fluid Mechanics' },
    { code: 'ENGG*2400', name: 'Engineering Systems Analysis' },
    { code: 'ENGG*2450', name: 'Circuits and Machines' },
    { code: 'ENGG*2550', name: 'Engineering Materials' },
    { code: 'ENGG*3050', name: 'Engineering Economics' },
    { code: 'ENGG*3080', name: 'Energy Resources and Technologies' },
    { code: 'ENGG*3120', name: 'Computer Aided Design and Manufacturing' },
    { code: 'ENGG*3150', name: 'Engineering Biomechanics' },
    { code: 'ENGG*3170', name: 'Biomaterials' },
    { code: 'ENGG*3240', name: 'Water Resources Engineering' },
    { code: 'ENGG*3250', name: 'Energy Management and Utilization' },
    { code: 'ENGG*3260', name: 'Soil and Water Quality Engineering' },
    { code: 'ENGG*3280', name: 'Hydrology and Water Resources' },
    { code: 'ENGG*3390', name: 'Signal Processing' },
    { code: 'ENGG*3410', name: 'Systems and Control' },
    { code: 'ENGG*3450', name: 'Electronic Devices' },
    { code: 'ENGG*3490', name: 'Introduction to Mechatronic Systems Design' },
    { code: 'ENGG*3640', name: 'Bioprocess Engineering' },
    { code: 'ENGG*3650', name: 'Biomechanics' },
    { code: 'ENGG*3660', name: 'Biomedical Instrumentation' },
    { code: 'ENGG*3670', name: 'Biomaterials' },
    { code: 'ENGG*3700', name: 'Optimization for Engineers' },
    { code: 'ENGG*4030', name: 'Manufacturing System Design' },
    { code: 'ENGG*4050', name: 'Quality Control' },
    { code: 'ENGG*4110', name: 'Fluid Mechanics II' },
    { code: 'ENGG*4220', name: 'Interdisciplinary Mechanical Engineering Design' },
    { code: 'ENGG*4230', name: 'Energy Conversion' },
    { code: 'ENGG*4310', name: 'Advanced Dynamics' },
    { code: 'ENGG*4350', name: 'Finite Element Analysis' },
    { code: 'ENGG*4400', name: 'Biomechanical Engineering Design' },
    { code: 'ENGG*4410', name: 'Instrumentation and Measurement' },
    { code: 'ENGG*4430', name: 'Neuro-Fuzzy and Soft Computing Systems' },
    { code: 'ENGG*4440', name: 'Computational Fluid Dynamics' },
    { code: 'ENGG*4460', name: 'Robotic Systems' },
    { code: 'ENGG*4470', name: 'Finite Element Analysis' },
    { code: 'ENGG*4480', name: 'Advanced Mechatronic Systems Design' },
    { code: 'ENGG*4490', name: 'Sampled Data Control Design' },
    { code: 'ENGG*4510', name: 'Assessment and Management of Risk' },
    { code: 'ENGG*4540', name: 'Computer Aided Engineering' },
    { code: 'ENGG*4580', name: 'Sustainable Energy Systems Design' },
    { code: 'ENGG*4630', name: 'Biomedical Engineering Design I' },
    { code: 'ENGG*4640', name: 'Biomedical Engineering Design II' },
    { code: 'ENGG*4660', name: 'Medical Image Processing' },
  ].sort((a, b) => a.code.localeCompare(b.code));

  const getFilteredCourses = () => {
    if (!courseSearch.trim()) return uofgCourses;
    const search = courseSearch.toLowerCase();
    
    // Prioritize matches in course name, then include code matches
    return uofgCourses.filter(course => 
      course.name.toLowerCase().includes(search) || 
      course.code.toLowerCase().includes(search)
    ).sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(search);
      const bNameMatch = b.name.toLowerCase().includes(search);
      
      // Prioritize name matches over code matches
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      // If both match in name or both match in code, sort alphabetically
      return a.code.localeCompare(b.code);
    });
  };

  const questions = [
    {
      step: 1,
      question: 'What theme would you like to use?',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      key: 'theme',
      isThemeToggle: true,
    },
    {
      step: 2,
      question: 'What is your major?',
      options: [],
      key: 'major',
      isSearchable: true,
    },
    {
      step: 3,
      question: 'Which courses are you taking?',
      options: [],
      key: 'courses',
      isMultiSelect: true,
      isSearchable: true,
    },
    {
      step: 4,
      question: 'Do you want morning notifications?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      key: 'morningNotification',
    },
    {
      step: 4.5,
      question: 'What time would you like your morning notification?',
      options: [
        { label: '6:00 AM', value: '6am' },
        { label: '7:00 AM', value: '7am' },
        { label: '8:00 AM', value: '8am' },
        { label: '9:00 AM', value: '9am' },
      ],
      key: 'morningTime',
      showIf: () => answers.morningNotification === 'yes',
    },
    {
      step: 5,
      question: 'What day does your week start?',
      options: [
        { label: 'Saturday', value: 'saturday' },
        { label: 'Sunday', value: 'sunday' },
        { label: 'Monday', value: 'monday' },
      ],
      key: 'weekStart',
    },
  ];

  // Get visible questions based on conditions
  const getVisibleQuestions = () => {
    return questions.filter(q => !q.showIf || q.showIf());
  };

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions.find((q) => q.step === currentStep || (currentStep === 5 && q.step === 5.5 && q.showIf?.()));

  const handleSelect = (value: string) => {
    if (displayQuestion) {
      // Handle major search selection
      if (displayQuestion.isSearchable && displayQuestion.key === 'major') {
        setAnswers({ ...answers, major: value });
        setMajorSearch(value);
        setShowMajorDropdown(false);
      }
      // Handle course search selection (multi-select)
      else if (displayQuestion.isSearchable && displayQuestion.key === 'courses') {
        const currentCourses = answers.courses;
        const updatedCourses = currentCourses.includes(value)
          ? currentCourses.filter(c => c !== value)
          : [...currentCourses, value];
        setAnswers({ ...answers, courses: updatedCourses });
      }
      // Handle multi-select for courses
      else if (displayQuestion.isMultiSelect && displayQuestion.key === 'courses') {
        const currentCourses = answers.courses;
        const updatedCourses = currentCourses.includes(value)
          ? currentCourses.filter(c => c !== value)
          : [...currentCourses, value];
        setAnswers({ ...answers, courses: updatedCourses });
      }
      // If selecting 'yes' for morning notification, show the time picker
      else if (displayQuestion.key === 'morningNotification') {
        if (value === 'yes') {
          setAnswers({ ...answers, [displayQuestion.key]: value });
          setShowMorningTime(true);
        } else {
          setAnswers({ ...answers, [displayQuestion.key]: value, morningTime: '' });
          setShowMorningTime(false);
        }
      } else {
        setAnswers({ ...answers, [displayQuestion.key]: value });
      }
    }
  };

  const getFilteredMajors = () => {
    if (!majorSearch.trim()) return uofgMajors;
    return uofgMajors.filter(major => 
      major.toLowerCase().includes(majorSearch.toLowerCase())
    );
  };

  const handleThemeToggle = (isDark: boolean) => {
    const newTheme = isDark ? 'dark' : 'light';
    setAnswers({ ...answers, theme: newTheme });
    setTheme(newTheme as 'light' | 'dark');
  };

  const handleNext = async () => {
    // If on morning notification question and they said yes, show time selection
    if (currentStep === 4 && answers.morningNotification === 'yes' && !answers.morningTime) {
      // Stay on step 4, but now show the time picker
      setShowMorningTime(true);
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setShowMorningTime(false);
    } else {
      // Show thank you screen
      setShowThankYou(true);
      
      // Save preferences
      await AsyncStorage.setItem('userPreferences', JSON.stringify(answers));
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      
      // Also create initial course objects from selected courses
      const availableColors = ['#FF3B30', '#FF9500', '#007AFF', '#34C759', '#5856D6', '#AF52DE', '#FF2D55'];
      const initialCourses = answers.courses.map((courseCode, index) => {
        const courseInfo = uofgCourses.find(c => c.code === courseCode);
        return {
          id: `initial-${index}`,
          code: courseCode,
          name: courseInfo?.name || '',
          professor: '',
          color: availableColors[index % availableColors.length],
          icon: '',
          progress: {
            completed: 0,
            inProgress: 0,
            toDo: 0,
            total: 0,
          },
          currentGrade: 0,
        };
      });
      await AsyncStorage.setItem('userCourses', JSON.stringify(initialCourses));
      
      // Navigate to main app after 2 seconds
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentStep === 4 && showMorningTime) {
      // If on time picker, go back to yes/no question
      setShowMorningTime(false);
      setAnswers({ ...answers, morningTime: '' });
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowMorningTime(false);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    router.replace('/(tabs)');
  };

  // Determine which question to show
  const displayQuestion = showMorningTime && currentStep === 4
    ? questions.find(q => q.key === 'morningTime')
    : currentQuestion;

  // Check if answered - theme defaults to 'light' so it's always answered
  const isAnswered = displayQuestion 
    ? (displayQuestion.key === 'theme' 
        ? true 
        : displayQuestion.key === 'courses'
          ? answers.courses.length > 0
          : displayQuestion.key === 'major'
            ? answers.major !== ''
            : answers[displayQuestion.key as keyof typeof answers] !== '')
    : false;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
      {showThankYou ? (
        // Thank You Screen
        <View style={styles.thankYouContainer}>
          <Text style={styles.thankYouEmoji}>🎉</Text>
          <Text style={styles.thankYouTitle}>Thank You</Text>
          <Text style={styles.thankYouMessage}>
            Welcome to a more organized year
          </Text>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      ) : (
        <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Personalize Your Experience</Text>
        <Text style={styles.subtitle}>Step {currentStep} of 5</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 5) * 100}%` }]} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        {displayQuestion && (
          <>
            <Text style={styles.question}>{displayQuestion.question}</Text>

            {/* Theme Toggle Switch */}
            {displayQuestion.isThemeToggle ? (
              <View style={styles.themeToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.glassyToggleTrack,
                    answers.theme === 'dark' && styles.glassyToggleTrackActive
                  ]}
                  onPress={() => handleThemeToggle(answers.theme !== 'dark')}
                  activeOpacity={0.9}
                >
                  <BlurView 
                    intensity={answers.theme === 'dark' ? 40 : 30} 
                    tint="light" 
                    style={styles.glassyToggleBlur}
                  >
                    <View style={[
                      styles.glassyToggleThumb,
                      answers.theme === 'dark' && styles.glassyToggleThumbRight
                    ]}>
                      <BlurView intensity={70} tint="light" style={styles.thumbBlur}>
                        <View style={styles.thumbInner}>
                          <View style={styles.thumbIndicator} />
                        </View>
                      </BlurView>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </View>
            ) : displayQuestion.key === 'major' && displayQuestion.isSearchable ? (
              /* Searchable Major Input */
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for your major..."
                  placeholderTextColor="#999"
                  value={majorSearch}
                  onChangeText={(text) => {
                    setMajorSearch(text);
                    setShowMajorDropdown(true);
                  }}
                  onFocus={() => setShowMajorDropdown(true)}
                />
                {showMajorDropdown && (
                  <ScrollView 
                    style={styles.majorDropdown}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {getFilteredMajors().map((major) => (
                      <TouchableOpacity
                        key={major}
                        style={[
                          styles.majorOption,
                          answers.major === major && styles.majorOptionSelected
                        ]}
                        onPress={() => handleSelect(major)}
                      >
                        <Text style={[
                          styles.majorOptionText,
                          answers.major === major && styles.majorOptionTextSelected
                        ]}>
                          {major}
                        </Text>
                        {answers.major === major && (
                          <Text style={styles.majorCheckmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                    {getFilteredMajors().length === 0 && (
                      <Text style={styles.noResultsText}>No majors found</Text>
                    )}
                  </ScrollView>
                )}
              </View>
            ) : displayQuestion.key === 'courses' && displayQuestion.isSearchable ? (
              /* Searchable Course Input with Multi-Select */
              <View style={styles.searchContainer}>
                {/* Selected Courses Display */}
                {answers.courses.length > 0 && (
                  <View style={styles.selectedCoursesContainer}>
                    <Text style={styles.selectedCoursesLabel}>Selected Courses:</Text>
                    <View style={styles.selectedCoursesChips}>
                      {answers.courses.map((courseCode) => {
                        const courseInfo = uofgCourses.find(c => c.code === courseCode);
                        return (
                          <TouchableOpacity
                            key={courseCode}
                            style={styles.selectedCourseChip}
                            onPress={() => handleSelect(courseCode)}
                          >
                            <Text style={styles.selectedCourseChipText}>{courseCode}</Text>
                            <Text style={styles.removeChipText}>✕</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                {/* Search Input */}
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for courses..."
                  placeholderTextColor="#999"
                  value={courseSearch}
                  onChangeText={(text) => {
                    setCourseSearch(text);
                    setShowCourseDropdown(true);
                  }}
                  onFocus={() => setShowCourseDropdown(true)}
                />

                {/* Dropdown Results */}
                {showCourseDropdown && (
                  <ScrollView 
                    style={styles.majorDropdown}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {getFilteredCourses().map((course) => {
                      const isSelected = answers.courses.includes(course.code);
                      return (
                        <TouchableOpacity
                          key={course.code}
                          style={[
                            styles.majorOption,
                            isSelected && styles.majorOptionSelected
                          ]}
                          onPress={() => handleSelect(course.code)}
                        >
                          <View style={styles.courseOptionContent}>
                            <Text style={[
                              styles.courseCodeText,
                              isSelected && styles.majorOptionTextSelected
                            ]}>
                              {course.code}
                            </Text>
                            <Text style={[
                              styles.courseNameText,
                              isSelected && styles.courseNameTextSelected
                            ]}>
                              {course.name}
                            </Text>
                          </View>
                          {isSelected && (
                            <Text style={styles.majorCheckmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                    {getFilteredCourses().length === 0 && (
                      <Text style={styles.noResultsText}>No courses found</Text>
                    )}
                  </ScrollView>
                )}
              </View>
            ) : (
              /* Regular Options */
              <View style={styles.optionsContainer}>
                {displayQuestion.options.map((option) => {
                  const isSelected = displayQuestion.isMultiSelect
                    ? answers.courses.includes(option.value)
                    : answers[displayQuestion.key as keyof typeof answers] === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                      onPress={() => handleSelect(option.value)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {option.label}
                      </Text>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
                {displayQuestion.isMultiSelect && (
                  <Text style={styles.multiSelectHint}>
                    Select all courses you're taking
                  </Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !isAnswered && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isAnswered}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 5 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
        </>
      )}
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#d1d5db',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b9dc3',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e1e1e',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#8b9dc3',
    borderColor: '#8b9dc3',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e1e1e',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  multiSelectHint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#e8ecf4',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#8b9dc3',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#8b9dc3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0.1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  themeToggleContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  glassyToggleTrack: {
    width: 300,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: 'rgba(120, 120, 128, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassyToggleTrackActive: {
    backgroundColor: 'rgba(120, 120, 128, 0.24)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  glassyToggleBlur: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    position: 'relative',
  },
  glassyToggleThumb: {
    position: 'absolute',
    left: 10,
    width: 135,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  glassyToggleThumbRight: {
    left: 155,
  },
  thumbBlur: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  thumbInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumbIndicator: {
    width: 50,
    height: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 2.5,
  },
  toggleCard: {
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e1e1e',
  },
  thankYouContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  thankYouEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  thankYouTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e1e1e',
    textAlign: 'center',
    marginBottom: 16,
  },
  thankYouMessage: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 28,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    backgroundColor: '#8b9dc3',
    width: 24,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#1e1e1e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  majorDropdown: {
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  majorOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  majorOptionSelected: {
    backgroundColor: '#8b9dc3',
  },
  majorOptionText: {
    fontSize: 15,
    color: '#1e1e1e',
    fontWeight: '500',
  },
  majorOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  majorCheckmark: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  noResultsText: {
    padding: 20,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  selectedCoursesContainer: {
    marginBottom: 16,
  },
  selectedCoursesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedCoursesChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedCourseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  selectedCourseChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeChipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  courseOptionContent: {
    flex: 1,
  },
  courseCodeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  courseNameText: {
    fontSize: 13,
    color: '#666',
  },
  courseNameTextSelected: {
    color: '#fff',
  },
});
