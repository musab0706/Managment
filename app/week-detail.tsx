import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function WeekDetailScreen() {
  const { colors } = useTheme();
  const { weekNumber } = useLocalSearchParams();
  
  const week = parseInt(weekNumber as string);
  const startDate = 1 + (week - 1) * 7;
  
  // Sample events (would come from your data)
  const events: any = {
    15: [
      { title: 'MATH*1200 - Midterm', color: '#FF0000', weight: '25%' },
      { title: 'Study Group', color: '#00FF00', weight: null }
    ],
    18: [
      { title: 'PHYS*1300 - Lab Report', color: '#0000FF', weight: '15%' }
    ],
    22: [
      { title: 'CHEM*1050 - Quiz', color: '#FFD700', weight: '10%' }
    ]
  };

  const days = [
    { name: 'Monday', date: startDate },
    { name: 'Tuesday', date: startDate + 1 },
    { name: 'Wednesday', date: startDate + 2 },
    { name: 'Thursday', date: startDate + 3 },
    { name: 'Friday', date: startDate + 4 },
    { name: 'Saturday', date: startDate + 5 },
    { name: 'Sunday', date: startDate + 6 },
  ];

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Week {week}</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={[styles.dateRange, { color: colors.textSecondary }]}>
        Sept {startDate} - Sept {startDate + 6}, 2024
      </Text>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {days.map((day, index) => {
          const dayEvents = events[day.date] || [];
          
          return (
            <View 
              key={index}
              style={[styles.dayCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.dayHeader}>
                <View>
                  <Text style={[styles.dayName, { color: colors.text }]}>
                    {day.name}
                  </Text>
                  <Text style={[styles.dayDate, { color: colors.textSecondary }]}>
                    September {day.date}
                  </Text>
                </View>
                <Text style={[styles.dayNumber, { color: colors.primary }]}>
                  Day {index + 1}
                </Text>
              </View>

              {dayEvents.length > 0 ? (
                <View style={styles.eventsContainer}>
                  {dayEvents.map((event: any, eventIndex: number) => (
                    <View
                      key={eventIndex}
                      style={[styles.eventItem, { borderLeftColor: event.color }]}
                    >
                      <Text style={[styles.eventTitle, { color: colors.text }]}>
                        {event.title}
                      </Text>
                      {event.weight && (
                        <Text style={[styles.eventWeight, { color: '#FF4500' }]}>
                          Worth {event.weight} of grade
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.noEvents, { color: colors.textSecondary }]}>
                  No events scheduled
                </Text>
              )}
            </View>
          );
        })}
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
    paddingBottom: 8,
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
  dateRange: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  dayCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 14,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventsContainer: {
    gap: 8,
  },
  eventItem: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 8,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventWeight: {
    fontSize: 13,
    fontWeight: '500',
  },
  noEvents: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
