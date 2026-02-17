import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

interface Reminder {
  id: string;
  title: string;
  course: string;
  courseColor: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export default function PerformanceDetailScreen() {
  const { colors, theme } = useTheme();
  const { period } = useLocalSearchParams();
  const isDark = theme === 'dark';

  const isWeek = period === 'week';
  const title = isWeek ? 'This Week' : 'All Time';
  const accentColor = isWeek ? '#007AFF' : '#34C759';

  // Sample reminders data
  const allReminders: Reminder[] = [
    { id: '1', title: 'Lab Report 1', course: 'ENGG 2120', courseColor: '#FF3B30', dueDate: 'Feb 10', priority: 'high', completed: true },
    { id: '2', title: 'Assignment 3', course: 'MATH 1200', courseColor: '#34C759', dueDate: 'Feb 12', priority: 'medium', completed: true },
    { id: '3', title: 'Read Chapter 5', course: 'GEOG 2210', courseColor: '#007AFF', dueDate: 'Feb 13', priority: 'low', completed: true },
    { id: '4', title: 'Project Milestone', course: 'ENGG 1500', courseColor: '#FF9500', dueDate: 'Feb 14', priority: 'high', completed: false },
    { id: '5', title: 'Quiz Prep', course: 'MATH 1200', courseColor: '#34C759', dueDate: 'Feb 15', priority: 'medium', completed: false },
    { id: '6', title: 'Lab Report 2', course: 'ENGG 2120', courseColor: '#FF3B30', dueDate: 'Feb 16', priority: 'high', completed: false },
    { id: '7', title: 'Study for Midterm', course: 'GEOG 2210', courseColor: '#007AFF', dueDate: 'Feb 18', priority: 'high', completed: false },
    { id: '8', title: 'Problem Set 4', course: 'MATH 1200', courseColor: '#34C759', dueDate: 'Feb 19', priority: 'low', completed: false },
  ];

  const completedReminders = allReminders.filter(r => r.completed);
  const pendingReminders = allReminders.filter(r => !r.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return colors.textSecondary;
    }
  };

  const renderReminder = (reminder: Reminder) => (
    <View 
      key={reminder.id}
      style={[styles.reminderCard, { backgroundColor: colors.card }]}
    >
      <View style={styles.reminderHeader}>
        <View style={[styles.courseIndicator, { backgroundColor: reminder.courseColor }]} />
        <View style={styles.reminderInfo}>
          <Text style={[styles.reminderTitle, { color: colors.text }]}>
            {reminder.title}
          </Text>
          <Text style={[styles.reminderCourse, { color: colors.textSecondary }]}>
            {reminder.course}
          </Text>
        </View>
        <View style={styles.reminderMeta}>
          <View style={[
            styles.priorityDot,
            { backgroundColor: getPriorityColor(reminder.priority) }
          ]} />
          <Text style={[styles.reminderDate, { color: colors.textSecondary }]}>
            {reminder.dueDate}
          </Text>
        </View>
      </View>
    </View>
  );

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: accentColor }]}>
                {completedReminders.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Completed
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.text }]}>
                {pendingReminders.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Pending
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.text }]}>
                {allReminders.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Total
              </Text>
            </View>
          </View>
        </View>

        {/* Completed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Completed ({completedReminders.length})
            </Text>
            <View style={[styles.checkCircle, { backgroundColor: accentColor }]}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>
          {completedReminders.map(renderReminder)}
        </View>

        {/* Pending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Pending ({pendingReminders.length})
            </Text>
            <View style={[styles.pendingCircle, { borderColor: colors.textSecondary }]}>
              <Text style={[styles.pendingDot, { color: colors.textSecondary }]}>•</Text>
            </View>
          </View>
          {pendingReminders.map(renderReminder)}
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
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  pendingCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    fontSize: 24,
    fontWeight: '700',
  },
  reminderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderCourse: {
    fontSize: 14,
  },
  reminderMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reminderDate: {
    fontSize: 12,
  },
});
