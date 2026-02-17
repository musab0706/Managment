import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Dimensions, KeyboardAvoidingView, Platform, PanResponder, Animated, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Reminder {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  sectionId: string;
  date: string;
  time?: string;
  notes?: string;
  gpaPercentage?: number;
  earlyReminders?: string[];
  reminderSound?: 'none' | 'default' | 'loud' | 'soft';
  vibrationIntensity?: 'none' | 'light' | 'medium' | 'strong';
}

interface ReminderSection {
  id: string;
  name: string;
  color: string;
  type: 'course' | 'custom';
}

interface Course {
  id: string;
  code: string;
  name: string;
  color: string;
  professor?: string;
}

// Swipeable Reminder Card Component
function SwipeableReminderCard({
  reminder,
  section,
  onPress,
  onDelete,
  colors,
  isDark
}: {
  reminder: Reminder;
  section: ReminderSection | undefined;
  onPress: () => void;
  onDelete: (resetFn: () => void) => void;
  colors: any;
  isDark: boolean;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -80));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -40) {
          Animated.spring(translateX, {
            toValue: -80,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
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
      friction: 8,
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

      {/* Reminder Card */}
      <Animated.View
        style={[
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[styles.reminderCard, { backgroundColor: colors.card }]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          {/* Content */}
          <View style={styles.reminderContent}>
            <Text style={[
              styles.reminderTitle,
              { color: colors.text },
              reminder.completed && styles.completedText
            ]}>
              {reminder.title}
            </Text>
            <View style={styles.reminderMeta}>
              {reminder.time && (
                <Text style={[styles.reminderTime, { color: colors.textSecondary }]}>
                  {reminder.time}
                </Text>
              )}
              {section && (
                <View style={styles.sectionBadge}>
                  <View style={[styles.sectionBadgeDot, { backgroundColor: section.color }]} />
                  <Text style={[styles.sectionBadgeText, { color: colors.textSecondary }]}>
                    {section.name}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Arrow */}
          <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// Swipeable Section Card Component
function SwipeableSectionCard({
  section,
  total,
  completed,
  onPress,
  onDelete,
  colors,
  isDark
}: {
  section: ReminderSection;
  total: number;
  completed: number;
  onPress: () => void;
  onDelete: (resetFn: () => void) => void;
  colors: any;
  isDark: boolean;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -80));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -40) {
          Animated.spring(translateX, {
            toValue: -80,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
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
      friction: 8,
    }).start();
  };

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

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

      {/* Section Card */}
      <Animated.View
        style={[
          { transform: [{ translateX }], backgroundColor: colors.background },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[styles.sectionListItem, { backgroundColor: colors.card }]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.sectionLeft}>
            <View style={styles.colorDotsGroup}>
              <View style={[styles.colorDot, { backgroundColor: section.color }]} />
              <View style={[styles.colorDot, { backgroundColor: section.color }]} />
              <View style={[styles.colorDot, { backgroundColor: section.color }]} />
            </View>
            <View style={styles.sectionInfo}>
              <Text style={[styles.sectionListName, { color: colors.text }]}>
                {section.name}
              </Text>
              <View style={styles.miniProgress}>
                <View style={[styles.miniProgressBar, { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
                  <View
                    style={[
                      styles.miniProgressFill,
                      { backgroundColor: section.color, width: `${percentage}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.sectionRight}>
            <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
              {total}
            </Text>
            <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function RemindersScreen() {
  const { colors, theme } = useTheme();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [newReminderText, setNewReminderText] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionColor, setNewSectionColor] = useState('#FF3B30');
  const [currentDayOffset, setCurrentDayOffset] = useState(0); // 0 = today, -1 = yesterday, 1 = tomorrow
  
  // Add Reminder Modal States
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('Feb 13, Mon');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderPriority, setReminderPriority] = useState<'high' | 'medium' | 'low' | undefined>(undefined);
  const [reminderNotes, setReminderNotes] = useState('');
  const [reminderTargetSection, setReminderTargetSection] = useState<string>('');
  const [reminderGpaPercentage, setReminderGpaPercentage] = useState('');
  const [reminderEarlyReminders, setReminderEarlyReminders] = useState<string[]>([]);
  const [reminderSound, setReminderSound] = useState<'none' | 'default' | 'loud' | 'soft'>('default');
  const [reminderVibration, setReminderVibration] = useState<'none' | 'light' | 'medium' | 'strong'>('medium');
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [customTimeType, setCustomTimeType] = useState<'hours' | 'days' | 'weeks'>('hours');
  const [customTimeValue, setCustomTimeValue] = useState('1');
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Generate number options 1-99 for the picker
  const numberOptions = Array.from({ length: 99 }, (_, i) => i + 1);
  
  const isDark = theme === 'dark';

  // Color palette for custom sections - expanded color wheel
  const SECTION_COLORS = [
    // Reds
    '#FF0000', '#FF1A1A', '#FF3333', '#FF4D4D', '#FF6666',
    // Oranges
    '#FF4500', '#FF5722', '#FF6F00', '#FF8C00', '#FFA500',
    // Yellows
    '#FFB300', '#FFC107', '#FFD54F', '#FFEB3B', '#FFFF00',
    // Greens
    '#66BB6A', '#4CAF50', '#388E3C', '#2E7D32', '#1B5E20',
    '#00C853', '#00E676', '#69F0AE', '#B9F6CA', '#00BFA5',
    // Cyans/Teals
    '#00ACC1', '#0097A7', '#00838F', '#006064', '#00BCD4',
    // Blues
    '#0288D1', '#0277BD', '#01579B', '#1976D2', '#1E88E5',
    '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#2962FF',
    // Purples
    '#4A148C', '#6A1B9A', '#7B1FA2', '#8E24AA', '#9C27B0',
    '#AB47BC', '#BA68C8', '#CE93D8', '#E1BEE7', '#7C4DFF',
    // Pinks
    '#C2185B', '#D81B60', '#E91E63', '#EC407A', '#F06292',
    '#FF4081', '#F50057', '#C51162', '#880E4F', '#AD1457',
    // Browns/Grays
    '#4E342E', '#5D4037', '#6D4C41', '#795548', '#8D6E63',
    '#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD',
    // Black/White
    '#000000', '#FFFFFF', '#EEEEEE', '#E0E0E0', '#F5F5F5',
  ];

  // Sample registered courses + custom sections
  const [sections, setSections] = useState<ReminderSection[]>([]);

  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load courses from AsyncStorage and create reminder sections
  const loadCoursesAndSections = async () => {
    try {
      const storedCourses = await AsyncStorage.getItem('userCourses');
      const storedSections = await AsyncStorage.getItem('reminderSections');
      const storedReminders = await AsyncStorage.getItem('reminders');
      
      if (storedCourses) {
        const courses: Course[] = JSON.parse(storedCourses);
        
        // Convert courses to reminder sections
        const courseSections: ReminderSection[] = courses.map(course => ({
          id: course.id,
          name: course.code,
          color: course.color,
          type: 'course' as const
        }));
        
        // Load custom sections if they exist
        let customSections: ReminderSection[] = [];
        if (storedSections) {
          customSections = JSON.parse(storedSections);
        }
        
        // Combine course sections with custom sections
        setSections([...courseSections, ...customSections]);
      } else {
        // If no courses, just load custom sections
        if (storedSections) {
          setSections(JSON.parse(storedSections));
        }
      }
      
      // Load reminders
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.error('Error loading courses and sections:', error);
    }
  };

  // Save custom sections (not course sections) to AsyncStorage
  const saveCustomSections = async (allSections: ReminderSection[]) => {
    try {
      const customSections = allSections.filter(s => s.type === 'custom');
      await AsyncStorage.setItem('reminderSections', JSON.stringify(customSections));
    } catch (error) {
      console.error('Error saving custom sections:', error);
    }
  };

  // Save reminders to AsyncStorage
  const saveReminders = async (updatedReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  useEffect(() => {
    loadCoursesAndSections();
  }, []);

  // Reload when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCoursesAndSections();
    }, [])
  );

  const toggleReminder = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    const isNowCompleted = !reminder.completed;
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, completed: isNowCompleted } : r
    );
    setReminders(updatedReminders);
    saveReminders(updatedReminders);

    // If reminder has GPA percentage and is being marked complete, sync with course grades
    if (isNowCompleted && reminder.gpaPercentage && reminder.sectionId) {
      try {
        const section = sections.find(s => s.id === reminder.sectionId);
        if (section && section.type === 'course') {
          // Load current grades for this course
          const storedGrades = await AsyncStorage.getItem(`course_grades_${section.id}`);
          let courseGrades = storedGrades ? JSON.parse(storedGrades) : [];

          // Check if this reminder category already exists
          const existingIndex = courseGrades.findIndex((g: any) => g.name === reminder.title);
          
          if (existingIndex >= 0) {
            // Update existing category score
            courseGrades[existingIndex] = {
              ...courseGrades[existingIndex],
              score: reminder.gpaPercentage,
              weight: reminder.gpaPercentage
            };
          } else {
            // Add new category
            courseGrades.push({
              name: reminder.title,
              weight: reminder.gpaPercentage,
              score: reminder.gpaPercentage
            });
          }

          // Save updated grades
          await AsyncStorage.setItem(`course_grades_${section.id}`, JSON.stringify(courseGrades));
        }
      } catch (error) {
        console.error('Error syncing reminder grade:', error);
      }
    }
  };

  const deleteReminder = (id: string, title: string, resetFn: () => void) => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${title}"?`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => resetFn()
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedReminders = reminders.filter(r => r.id !== id);
            setReminders(updatedReminders);
            saveReminders(updatedReminders);
          },
        },
      ]
    );
  };

  const deleteSection = (sectionId: string, sectionName: string, resetFn: () => void) => {
    Alert.alert(
      'Delete Section',
      `Are you sure you want to delete "${sectionName}" and all its reminders?`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => resetFn()
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Remove section
            const updatedSections = sections.filter(s => s.id !== sectionId);
            setSections(updatedSections);
            saveCustomSections(updatedSections);
            
            // Remove all reminders in this section
            const updatedReminders = reminders.filter(r => r.sectionId !== sectionId);
            setReminders(updatedReminders);
            saveReminders(updatedReminders);
          },
        },
      ]
    );
  };

  const addSection = () => {
    if (newSectionName.trim()) {
      const newSection: ReminderSection = {
        id: Date.now().toString(),
        name: newSectionName,
        color: newSectionColor,
        type: 'custom',
      };
      const updatedSections = [...sections, newSection];
      setSections(updatedSections);
      saveCustomSections(updatedSections);
      setNewSectionName('');
      setNewSectionColor('#FF3B30');
      setShowAddSection(false);
    }
  };

  const addReminder = () => {
    if (reminderTitle.trim() && reminderTargetSection) {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: reminderTitle,
        completed: false,
        sectionId: reminderTargetSection,
        date: reminderDate,
        time: reminderTime || undefined,
        priority: reminderPriority,
        notes: reminderNotes || undefined,
        gpaPercentage: reminderGpaPercentage ? parseFloat(reminderGpaPercentage) : undefined,
        earlyReminders: reminderEarlyReminders.length > 0 ? reminderEarlyReminders : undefined,
        reminderSound: reminderSound,
        vibrationIntensity: reminderVibration,
      };
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
      
      // Reset form
      setReminderTitle('');
      setReminderDate('Feb 13, Mon');
      setReminderTime('');
      setReminderPriority(undefined);
      setReminderNotes('');
      setReminderGpaPercentage('');
      setReminderEarlyReminders([]);
      setReminderSound('default');
      setReminderVibration('medium');
      setShowAddReminder(false);
    }
  };

  const toggleEarlyReminder = (value: string) => {
    if (reminderEarlyReminders.includes(value)) {
      setReminderEarlyReminders(reminderEarlyReminders.filter(v => v !== value));
    } else {
      setReminderEarlyReminders([...reminderEarlyReminders, value]);
    }
  };

  const handleDoubleTap = (type: 'hours' | 'days' | 'weeks') => {
    // Provide haptic feedback when long press is triggered
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCustomTimeType(type);
    setCustomTimeValue('');
    setShowCustomTimeModal(true);
  };

  const handlePressIn = (type: 'hours' | 'days' | 'weeks') => {
    const timer = setTimeout(() => {
      handleDoubleTap(type);
    }, 2000);
    setPressTimer(timer);
  };

  const handlePressOut = (value: string) => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
      // If timer was cleared before 2 seconds, it's a tap (not long press)
      toggleEarlyReminder(value);
    }
  };

  const addCustomReminder = () => {
    if (customTimeValue) {
      const value = `${customTimeValue}${customTimeType}`;
      if (!reminderEarlyReminders.includes(value)) {
        setReminderEarlyReminders([...reminderEarlyReminders, value]);
      }
      setShowCustomTimeModal(false);
      setCustomTimeValue('1');
    }
  };

  const handleVibrationSelection = async (intensity: 'none' | 'light' | 'medium' | 'strong') => {
    setReminderVibration(intensity);
    
    // Provide haptic feedback based on intensity
    switch (intensity) {
      case 'none':
        // No vibration
        break;
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        // Stronger medium - 4 medium vibrations
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }, 100);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 200);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }, 300);
        break;
      case 'strong':
        // Maximum intensity - combine heavy impacts with notification feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 80);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 160);
        setTimeout(async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }, 240);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 320);
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 400);
        setTimeout(async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }, 480);
        break;
    }
  };

  const formatReminderLabel = (value: string) => {
    // Parse custom values like "12hours", "3days", "2weeks"
    const match = value.match(/^(\d+)(hours|days|weeks)$/);
    if (match) {
      const num = match[1];
      const unit = match[2];
      return `${num} ${unit === 'hours' ? 'Hour' : unit === 'days' ? 'Day' : 'Week'}${num !== '1' ? 's' : ''}`;
    }
    // Handle default values
    if (value === '1hour') return '1 Hour';
    if (value === '1day') return '1 Day';
    if (value === '1week') return '1 Week';
    return value;
  };

  const openAddReminder = (sectionId: string) => {
    // If opening from "All", default to first section
    if (sectionId === 'all') {
      setReminderTargetSection(sections[0]?.id || '');
    } else {
      setReminderTargetSection(sectionId);
    }
    setShowAddReminder(true);
  };

  const renderModals = () => (
    <>
      {/* Add Section Modal */}
      <Modal
        visible={showAddSection}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddSection(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowAddSection(false);
            setNewSectionName('');
            setNewSectionColor('#FF3B30');
          }}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Section</Text>
              
              <TextInput
                style={[styles.modalInput, { 
                  color: colors.text,
                  backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                  borderColor: isDark ? '#38383A' : '#E5E5EA'
                }]}
                placeholder="Section name"
                placeholderTextColor={colors.textSecondary}
                value={newSectionName}
                onChangeText={setNewSectionName}
              />

              {/* Color Picker */}
              <View style={styles.colorPickerSection}>
                <Text style={[styles.colorPickerLabel, { color: colors.text }]}>Choose Color</Text>
                <ScrollView 
                  style={styles.colorScrollView}
                  contentContainerStyle={styles.colorGrid}
                  showsVerticalScrollIndicator={false}
                >
                  {SECTION_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newSectionColor === color && styles.colorOptionSelected,
                        (color === '#FFFFFF' || color === '#EEEEEE' || color === '#E0E0E0' || color === '#F5F5F5') && {
                          borderWidth: 1,
                          borderColor: isDark ? '#444' : '#ddd'
                        }
                      ]}
                      onPress={() => setNewSectionColor(color)}
                    >
                      {newSectionColor === color && (
                        <Text style={[
                          styles.colorCheckmark,
                          (color === '#FFFFFF' || color === '#EEEEEE' || color === '#E0E0E0' || color === '#F5F5F5') && { color: '#000' }
                        ]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddSection(false);
                    setNewSectionName('');
                    setNewSectionColor('#FF3B30');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.createButton, { backgroundColor: newSectionColor }]}
                  onPress={addSection}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Add Reminder Modal */}
      <Modal
        visible={showAddReminder}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddReminder(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.addReminderModalContainer}>
            <TouchableOpacity 
              style={styles.addReminderBackdrop}
              activeOpacity={1}
              onPress={() => setShowAddReminder(false)}
            />
            
            <View style={[styles.addReminderModal, { backgroundColor: colors.background }]}>
              {/* Header */}
              <View style={styles.addReminderHeader}>
                <TouchableOpacity onPress={() => setShowAddReminder(false)}>
                  <Text style={[styles.addReminderCancel, { color: '#007AFF' }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.addReminderTitle, { color: colors.text }]}>New Reminder</Text>
                <TouchableOpacity onPress={addReminder}>
                  <Text style={[styles.addReminderDone, { color: '#007AFF' }]}>Add</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.addReminderContent} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Title Input */}
                <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                  <TextInput
                    style={[styles.addReminderInput, { color: colors.text }]}
                    placeholder="Title"
                    placeholderTextColor={colors.textSecondary}
                    value={reminderTitle}
                    onChangeText={setReminderTitle}
                    multiline
                  />
                </View>

                {/* Section Picker */}
                <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>List</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionPicker}>
                    {sections.map((section) => (
                      <TouchableOpacity
                        key={section.id}
                        style={[
                          styles.sectionPickerItem,
                          { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                          reminderTargetSection === section.id && { backgroundColor: section.color }
                        ]}
                        onPress={() => setReminderTargetSection(section.id)}
                      >
                        <View style={[styles.sectionPickerDot, { backgroundColor: section.color }]} />
                        <Text style={[
                          styles.sectionPickerText,
                          { color: reminderTargetSection === section.id ? '#fff' : colors.text }
                        ]}>
                          {section.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Date & Time */}
                <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                  <View style={styles.addReminderRow}>
                    <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>Date</Text>
                    <TextInput
                      style={[styles.addReminderRowInput, { color: colors.text }]}
                      placeholder="Feb 13, Mon"
                      placeholderTextColor={colors.textSecondary}
                      value={reminderDate}
                      onChangeText={setReminderDate}
                    />
                  </View>
                  <View style={[styles.addReminderDivider, { backgroundColor: isDark ? '#38383A' : '#E5E5EA' }]} />
                  <View style={styles.addReminderRow}>
                    <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>Time</Text>
                    <TextInput
                      style={[styles.addReminderRowInput, { color: colors.text }]}
                      placeholder="09:00"
                      placeholderTextColor={colors.textSecondary}
                      value={reminderTime}
                      onChangeText={setReminderTime}
                    />
                  </View>
                </View>

                {/* Priority */}
                <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>Priority</Text>
                  <View style={styles.priorityButtons}>
                    {[
                      { value: 'high' as const, label: 'High', color: '#FF3B30' },
                      { value: 'medium' as const, label: 'Medium', color: '#FF9500' },
                      { value: 'low' as const, label: 'Low', color: '#34C759' },
                    ].map((priority) => (
                      <TouchableOpacity
                        key={priority.value}
                        style={[
                          styles.priorityButton,
                          { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                          reminderPriority === priority.value && { backgroundColor: priority.color }
                        ]}
                        onPress={() => setReminderPriority(reminderPriority === priority.value ? undefined : priority.value)}
                      >
                        <Text style={[
                          styles.priorityButtonText,
                          { color: reminderPriority === priority.value ? '#fff' : colors.text }
                        ]}>
                          {priority.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* GPA Percentage - Only show for course sections */}
                {(() => {
                  const selectedSectionObj = sections.find(s => s.id === reminderTargetSection);
                  if (selectedSectionObj?.type === 'course') {
                    return (
                      <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                        <View style={styles.addReminderRow}>
                          <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>GPA Weight (%)</Text>
                          <TextInput
                            style={[styles.addReminderRowInput, { color: colors.text }]}
                            placeholder="e.g., 15"
                            placeholderTextColor={colors.textSecondary}
                            value={reminderGpaPercentage}
                            onChangeText={(text) => {
                              // Only allow numbers and one decimal point
                              const filtered = text.replace(/[^0-9.]/g, '').replace(',', '.');
                              // Ensure only one decimal point
                              const parts = filtered.split('.');
                              if (parts.length > 2) {
                                setReminderGpaPercentage(parts[0] + '.' + parts.slice(1).join(''));
                              } else {
                                setReminderGpaPercentage(filtered);
                              }
                            }}
                            keyboardType="decimal-pad"
                          />
                        </View>
                      </View>
                    );
                  }
                  return null;
                })()}

                {/* Early Reminder */}
                <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>Early Reminders (Select Multiple)</Text>
                  <View style={styles.earlyReminderButtons}>
                    <TouchableOpacity
                      style={[
                        styles.earlyReminderButton,
                        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                        reminderEarlyReminders.includes('1hour') && { 
                          backgroundColor: isDark ? '#1C1C1E' : '#000'
                        }
                      ]}
                      onPress={() => toggleEarlyReminder('1hour')}
                    >
                      <Text style={[
                        styles.earlyReminderButtonText,
                        { color: reminderEarlyReminders.includes('1hour') ? '#fff' : colors.text }
                      ]}>
                        1 Hour
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.earlyReminderButton,
                        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                        reminderEarlyReminders.includes('1day') && { 
                          backgroundColor: isDark ? '#1C1C1E' : '#000'
                        }
                      ]}
                      onPress={() => toggleEarlyReminder('1day')}
                    >
                      <Text style={[
                        styles.earlyReminderButtonText,
                        { color: reminderEarlyReminders.includes('1day') ? '#fff' : colors.text }
                      ]}>
                        1 Day
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.earlyReminderButton,
                        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                        reminderEarlyReminders.includes('2days') && { 
                          backgroundColor: isDark ? '#1C1C1E' : '#000'
                        }
                      ]}
                      onPress={() => toggleEarlyReminder('2days')}
                    >
                      <Text style={[
                        styles.earlyReminderButtonText,
                        { color: reminderEarlyReminders.includes('2days') ? '#fff' : colors.text }
                      ]}>
                        2 Days
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.earlyReminderButton,
                        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                        reminderEarlyReminders.includes('1week') && { 
                          backgroundColor: isDark ? '#1C1C1E' : '#000'
                        }
                      ]}
                      onPress={() => toggleEarlyReminder('1week')}
                    >
                      <Text style={[
                        styles.earlyReminderButtonText,
                        { color: reminderEarlyReminders.includes('1week') ? '#fff' : colors.text }
                      ]}>
                        1 Week
                      </Text>
                    </TouchableOpacity>

                    {/* Add Custom Button */}
                    <TouchableOpacity
                      style={[
                        styles.earlyReminderButton,
                        { 
                          backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                          borderWidth: 2,
                          borderColor: isDark ? '#1C1C1E' : '#000',
                          borderStyle: 'dashed'
                        }
                      ]}
                      onPress={() => setShowCustomTimeModal(true)}
                    >
                      <Text style={[styles.earlyReminderButtonText, { color: isDark ? '#fff' : '#000', fontSize: 14 }]}>
                        +
                      </Text>
                    </TouchableOpacity>

                    {/* Show custom reminders */}
                    {reminderEarlyReminders.filter(r => !['1hour', '1day', '2days', '1week'].includes(r)).map((customReminder) => (
                      <TouchableOpacity
                        key={customReminder}
                        style={[
                          styles.earlyReminderButton,
                          { backgroundColor: isDark ? '#1C1C1E' : '#000' }
                        ]}
                        onPress={() => toggleEarlyReminder(customReminder)}
                      >
                        <Text style={[styles.earlyReminderButtonText, { color: '#fff' }]}>
                          {formatReminderLabel(customReminder)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Sound Settings */}
                <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>Reminder Sound</Text>
                  <View style={styles.soundVibrationButtons}>
                    {[
                      { value: 'none' as const, label: 'None' },
                      { value: 'soft' as const, label: 'Soft' },
                      { value: 'default' as const, label: 'Default' },
                      { value: 'loud' as const, label: 'Loud' },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.soundVibrationButton,
                          { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                          reminderSound === option.value && { 
                            backgroundColor: isDark ? '#1C1C1E' : '#000'
                          }
                        ]}
                        onPress={() => setReminderSound(option.value)}
                      >
                        <Text style={[
                          styles.soundVibrationButtonText,
                          { color: reminderSound === option.value ? '#fff' : colors.text }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Vibration Settings */}
                <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>Vibration Intensity (Tap to feel)</Text>
                  <View style={styles.soundVibrationButtons}>
                    {[
                      { value: 'none' as const, label: 'None' },
                      { value: 'light' as const, label: 'Light' },
                      { value: 'medium' as const, label: 'Medium' },
                      { value: 'strong' as const, label: 'Strong' },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.soundVibrationButton,
                          { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                          reminderVibration === option.value && { 
                            backgroundColor: isDark ? '#1C1C1E' : '#000'
                          }
                        ]}
                        onPress={() => handleVibrationSelection(option.value)}
                      >
                        <Text style={[
                          styles.soundVibrationButtonText,
                          { color: reminderVibration === option.value ? '#fff' : colors.text }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Notes */}
                <View style={[styles.addReminderCard, { backgroundColor: colors.card }]}>
                  <Text style={[styles.addReminderLabel, { color: colors.textSecondary }]}>Notes</Text>
                  <TextInput
                    style={[styles.addReminderTextArea, { color: colors.text }]}
                    placeholder="Add notes..."
                    placeholderTextColor={colors.textSecondary}
                    value={reminderNotes}
                    onChangeText={setReminderNotes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Extra spacing for keyboard */}
                <View style={{ height: 200 }} />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Custom Time Modal - iOS Alarm Style Picker */}
      <Modal
        visible={showCustomTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCustomTimeModal(false)}
      >
        <View style={styles.alarmPickerModalContainer}>
          <TouchableOpacity 
            style={styles.alarmPickerBackdrop}
            activeOpacity={1}
            onPress={() => setShowCustomTimeModal(false)}
          />
          
          <View style={[styles.alarmPickerModal, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.alarmPickerHeader}>
              <TouchableOpacity onPress={() => {
                setShowCustomTimeModal(false);
                setCustomTimeValue('1');
              }}>
                <Text style={[styles.alarmPickerCancel, { color: '#007AFF' }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.alarmPickerTitle, { color: colors.text }]}>Custom Reminder</Text>
              <TouchableOpacity onPress={addCustomReminder}>
                <Text style={[styles.alarmPickerDone, { color: '#007AFF' }]}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* iOS Picker Wheel Container */}
            <View style={[styles.pickerWheelContainer, { backgroundColor: isDark ? '#000' : '#fff' }]}>
              {/* Number Picker - Left Side */}
              <View style={styles.pickerColumn}>
                <ScrollView 
                  style={styles.pickerScrollView}
                  contentContainerStyle={styles.pickerScrollContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                  decelerationRate="fast"
                >
                  {/* Top spacer for centering */}
                  <View style={{ height: 88 }} />
                  {numberOptions.map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={styles.pickerItem}
                      onPress={() => setCustomTimeValue(num.toString())}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        { color: colors.text },
                        customTimeValue === num.toString() && styles.pickerItemTextSelected
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* Bottom spacer for centering */}
                  <View style={{ height: 88 }} />
                </ScrollView>
              </View>

              {/* Unit Picker - Right Side */}
              <View style={styles.pickerColumn}>
                <ScrollView 
                  style={styles.pickerScrollView}
                  contentContainerStyle={styles.pickerScrollContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                  decelerationRate="fast"
                >
                  {/* Top spacer for centering */}
                  <View style={{ height: 88 }} />
                  {[
                    { value: 'hours' as const, label: customTimeValue === '1' ? 'Hour' : 'Hours' },
                    { value: 'days' as const, label: customTimeValue === '1' ? 'Day' : 'Days' },
                    { value: 'weeks' as const, label: customTimeValue === '1' ? 'Week' : 'Weeks' },
                  ].map((unit) => (
                    <TouchableOpacity
                      key={unit.value}
                      style={styles.pickerItem}
                      onPress={() => setCustomTimeType(unit.value)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        { color: colors.text },
                        customTimeType === unit.value && styles.pickerItemTextSelected
                      ]}>
                        {unit.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* Bottom spacer for centering */}
                  <View style={{ height: 88 }} />
                </ScrollView>
              </View>

              {/* Selection Box Overlay - Top Border */}
              <View style={[styles.pickerSelectionTop, { 
                borderTopColor: isDark ? '#38383A' : '#C6C6C8',
                borderBottomColor: isDark ? '#38383A' : '#C6C6C8'
              }]} />
              
              {/* Selection Box Overlay - Bottom Border */}
              <View style={[styles.pickerSelectionBottom, { 
                borderBottomColor: isDark ? '#38383A' : '#C6C6C8'
              }]} />

              {/* Gradient Fade Overlays */}
              <View style={[styles.pickerFadeTop, { 
                backgroundColor: isDark ? '#000' : '#fff'
              }]} />
              <View style={[styles.pickerFadeBottom, { 
                backgroundColor: isDark ? '#000' : '#fff'
              }]} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );

  const groupByDate = (remindersList: Reminder[]) => {
    const grouped: { [key: string]: Reminder[] } = {};
    remindersList.forEach(reminder => {
      if (!grouped[reminder.date]) {
        grouped[reminder.date] = [];
      }
      grouped[reminder.date].push(reminder);
    });
    return grouped;
  };

  const getDateString = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', weekday: 'short' };
    const formatted = date.toLocaleDateString('en-US', options);
    const parts = formatted.split(', ');
    return `${parts[0].substring(0, 3)} ${parts[1]}, ${parts[2]}`;
  };

  const getRemindersForDate = (offset: number) => {
    const dateString = getDateString(offset);
    return reminders.filter(r => r.date === dateString);
  };

  // Create pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to horizontal swipes
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Swipe left (next day)
      if (gestureState.dx < -50) {
        setCurrentDayOffset(currentDayOffset + 1);
      }
      // Swipe right (previous day)
      else if (gestureState.dx > 50) {
        setCurrentDayOffset(currentDayOffset - 1);
      }
    },
  });

  const getCompletedCount = (sectionId: string) => {
    const sectionReminders = reminders.filter(r => r.sectionId === sectionId);
    const completed = sectionReminders.filter(r => r.completed).length;
    return { completed, total: sectionReminders.length };
  };

  // If viewing "All" or specific section with reminders
  if (selectedSection !== null) {
    // For "All" section, show swipeable day view
    if (selectedSection === 'all') {
      const currentDateString = getDateString(currentDayOffset);
      const todayReminders = getRemindersForDate(currentDayOffset);

      return (
        <>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  setSelectedSection(null);
                  setCurrentDayOffset(0);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.backArrow, { color: '#007AFF' }]}>←</Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>All</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Text style={[styles.editButtonText, { color: colors.text }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: '#C7F54A' }]}
                onPress={() => openAddReminder('all')}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Navigation */}
          <View style={styles.dateNavigation}>
            <View style={styles.dateDisplay}>
              <Text style={[styles.currentDate, { color: colors.text }]}>
                {currentDayOffset === 0 ? 'Today' : 
                 currentDayOffset === -1 ? 'Yesterday' : 
                 currentDayOffset === 1 ? 'Tomorrow' : 
                 currentDateString}
              </Text>
              <Text style={[styles.currentDateFull, { color: colors.textSecondary }]}>
                {currentDateString}
              </Text>
            </View>
          </View>

          {/* Reminders List for Current Day */}
          <View 
            style={{ flex: 1 }}
            {...panResponder.panHandlers}
          >
            <ScrollView 
              style={styles.remindersList}
              contentContainerStyle={{ paddingBottom: 140 }}
              showsVerticalScrollIndicator={false}
            >
            {todayReminders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No reminders for this day
                </Text>
              </View>
            ) : (
              <View style={styles.dateGroup}>
                {todayReminders.map((reminder) => {
                  const section = sections.find(s => s.id === reminder.sectionId);
                  return (
                    <SwipeableReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      section={section}
                      onPress={() => toggleReminder(reminder.id)}
                      onDelete={(resetFn) => deleteReminder(reminder.id, reminder.title, resetFn)}
                      colors={colors}
                      isDark={isDark}
                    />
                  );
                })}
              </View>
            )}
          </ScrollView>
          </View>
        </View>
        {renderModals()}
        </>
      );
    }

    // For specific course sections, show all dates
    const filteredReminders = reminders.filter(r => r.sectionId === selectedSection);
    const groupedReminders = groupByDate(filteredReminders);
    const currentSection = sections.find(s => s.id === selectedSection);

    return (
      <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedSection(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.backArrow, { color: '#007AFF' }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {selectedSection === 'all' ? 'All' : currentSection?.name}
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Text style={[styles.editButtonText, { color: colors.text }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: '#C7F54A' }]}
              onPress={() => openAddReminder(selectedSection)}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reminders List */}
        <ScrollView 
          style={styles.remindersList}
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {Object.keys(groupedReminders).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No reminders
              </Text>
            </View>
          ) : (
            Object.entries(groupedReminders).map(([date, dateReminders]) => (
              <View key={date} style={styles.dateGroup}>
                {/* Date Header */}
                <Text style={[styles.dateHeader, { color: colors.text }]}>{date}</Text>

                {/* Reminders for this date */}
                {dateReminders.map((reminder) => {
                  const section = sections.find(s => s.id === reminder.sectionId);
                  return (
                    <SwipeableReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      section={section}
                      onPress={() => toggleReminder(reminder.id)}
                      onDelete={(resetFn) => deleteReminder(reminder.id, reminder.title, resetFn)}
                      colors={colors}
                      isDark={isDark}
                    />
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      </View>
      {renderModals()}
      </>
    );
  }

  // Main view - showing sections vertically
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reminders</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: '#C7F54A' }]}
          onPress={() => setShowAddSection(true)}
        >
          <Text style={styles.addButtonText}>+ Section</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.sectionsListScroll}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's To-Do List */}
        <View style={[styles.todayCard, { backgroundColor: colors.card }]}>
          <View style={styles.todayHeader}>
            <Text style={[styles.todayDate, { color: colors.text }]}>
              {getDateString(0)}
            </Text>
          </View>

          <View style={styles.todayReminders}>
            {getRemindersForDate(0).map((reminder) => {
              const section = sections.find(s => s.id === reminder.sectionId);
              return (
                <TouchableOpacity
                  key={reminder.id}
                  style={styles.todayReminderItem}
                  onPress={() => toggleReminder(reminder.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.todayCheckbox,
                    { borderColor: reminder.completed ? '#34C759' : colors.textSecondary },
                    reminder.completed && { backgroundColor: '#34C759' }
                  ]}>
                    {reminder.completed && (
                      <Text style={styles.todayCheckmark}>✓</Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.todayReminderText,
                      { color: colors.text },
                      reminder.completed && styles.completedText
                    ]}>
                      {reminder.title}
                    </Text>
                    {section && (
                      <View style={styles.todayReminderMeta}>
                        <View style={[styles.todayDot, { backgroundColor: section.color }]} />
                        <Text style={[styles.todayReminderSection, { color: colors.textSecondary }]}>
                          {section.name}
                        </Text>
                        {reminder.time && (
                          <Text style={[styles.todayReminderTime, { color: colors.textSecondary }]}>
                            • {reminder.time}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* All Section */}
        <TouchableOpacity
          style={[styles.sectionListItem, { backgroundColor: colors.card }]}
          onPress={() => setSelectedSection('all')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionLeft}>
            <View style={styles.colorDotsGroup}>
              <View style={[styles.miniDot, { backgroundColor: '#FF3B30' }]} />
              <View style={[styles.miniDot, { backgroundColor: '#007AFF' }]} />
              <View style={[styles.miniDot, { backgroundColor: '#34C759' }]} />
            </View>
            <Text style={[styles.sectionListName, { color: colors.text }]}>All</Text>
          </View>
          <View style={styles.sectionRight}>
            <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
              {reminders.length}
            </Text>
            <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Individual Sections */}
        {sections.map((section) => {
          const { completed, total } = getCompletedCount(section.id);
          
          // Only allow deleting custom sections, not course sections
          if (section.type === 'course') {
            // Course sections can't be deleted - render as regular TouchableOpacity
            return (
              <TouchableOpacity
                key={section.id}
                style={[styles.sectionListItem, { backgroundColor: colors.card }]}
                onPress={() => setSelectedSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionLeft}>
                  <View style={[styles.colorDot, { backgroundColor: section.color }]} />
                  <Text style={[styles.sectionListName, { color: colors.text }]}>{section.name}</Text>
                  <View style={styles.miniProgress}>
                    <View style={[styles.miniProgressBar, { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
                      <View
                        style={[
                          styles.miniProgressFill,
                          { backgroundColor: section.color, width: `${total > 0 ? (completed / total) * 100 : 0}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.sectionRight}>
                  <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
                    {total}
                  </Text>
                  <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
                </View>
              </TouchableOpacity>
            );
          }
          
          // Custom sections can be deleted
          return (
            <SwipeableSectionCard
              key={section.id}
              section={section}
              total={total}
              completed={completed}
              onPress={() => setSelectedSection(section.id)}
              onDelete={(resetFn) => deleteSection(section.id, section.name, resetFn)}
              colors={colors}
              isDark={isDark}
            />
          );
        })}
      </ScrollView>

      {renderModals()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  sectionsListScroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  sectionListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  colorDotsGroup: {
    flexDirection: 'row',
    gap: 3,
  },
  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionListName: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 4,
  },
  miniProgress: {
    width: 80,
  },
  miniProgressBar: {
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionCount: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  remindersList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 17,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  reminderTime: {
    fontSize: 14,
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionBadgeText: {
    fontSize: 13,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  dateDisplay: {
    alignItems: 'center',
  },
  currentDate: {
    fontSize: 20,
    fontWeight: '600',
  },
  currentDateFull: {
    fontSize: 14,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  colorPickerSection: {
    marginBottom: 20,
  },
  colorPickerLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorScrollView: {
    maxHeight: 200,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  colorCheckmark: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    // backgroundColor set inline
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addReminderModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  addReminderBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addReminderModal: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  addReminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  addReminderCancel: {
    fontSize: 17,
  },
  addReminderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addReminderDone: {
    fontSize: 17,
    fontWeight: '600',
  },
  addReminderContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addReminderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addReminderInput: {
    fontSize: 17,
    minHeight: 44,
  },
  addReminderLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addReminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  addReminderRowInput: {
    fontSize: 17,
    textAlign: 'right',
    flex: 1,
  },
  addReminderDivider: {
    height: 0.5,
    marginVertical: 8,
  },
  addReminderTextArea: {
    fontSize: 16,
    minHeight: 80,
  },
  sectionPicker: {
    flexDirection: 'row',
  },
  sectionPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    gap: 6,
  },
  sectionPickerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionPickerText: {
    fontSize: 15,
    fontWeight: '500',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  earlyReminderScrollContent: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 16,
  },
  earlyReminderButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  earlyReminderButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  earlyReminderButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeUnitSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  timeUnitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeUnitText: {
    fontSize: 15,
    fontWeight: '600',
  },
  soundVibrationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  soundVibrationButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  soundVibrationButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  alarmPickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  alarmPickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alarmPickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  alarmPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#38383A',
  },
  alarmPickerCancel: {
    fontSize: 17,
    fontWeight: '400',
  },
  alarmPickerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  alarmPickerDone: {
    fontSize: 17,
    fontWeight: '600',
  },
  pickerWheelContainer: {
    height: 260,
    paddingVertical: 20,
    position: 'relative',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 250,
    marginBottom: 20,
    gap: 16,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerScrollView: {
    flex: 1,
  },
  pickerScrollContent: {
    alignItems: 'center',
  },
  pickerItem: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pickerItemText: {
    fontSize: 23,
    fontWeight: '400',
    opacity: 0.3,
  },
  pickerItemTextSelected: {
    opacity: 1,
    fontWeight: '400',
    fontSize: 23,
  },
  pickerSelectionTop: {
    position: 'absolute',
    top: 88,
    left: 0,
    right: 0,
    height: 44,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    pointerEvents: 'none',
  },
  pickerSelectionBottom: {
    position: 'absolute',
    top: 132,
    left: 0,
    right: 0,
    height: 0,
    pointerEvents: 'none',
  },
  pickerFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 88,
    opacity: 0.9,
    pointerEvents: 'none',
  },
  pickerFadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 88,
    opacity: 0.9,
    pointerEvents: 'none',
  },
  customTimeModalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    maxHeight: '70%',
  },
  pickerSelectionOverlay: {
    position: 'absolute',
    top: 115,
    left: 24,
    right: 24,
    height: 50,
    borderRadius: 8,
    opacity: 0.5,
    pointerEvents: 'none',
  },
  swipeContainer: {
    position: 'relative',
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 12,
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  todayCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  todayHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  todayDate: {
    fontSize: 18,
    fontWeight: '600',
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
  },
  todayStat: {
    flex: 1,
    alignItems: 'center',
  },
  todayStatNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  todayStatLabel: {
    fontSize: 12,
  },
  todayDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  todayEmpty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  todayEmptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  todayReminders: {
    gap: 12,
  },
  todayReminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCheckmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  todayReminderText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  todayReminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  todayReminderSection: {
    fontSize: 13,
  },
  todayReminderTime: {
    fontSize: 13,
  },
  viewAllButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
