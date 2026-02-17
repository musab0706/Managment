import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { router } from 'expo-router';

type ViewMode = 'month' | 'week' | 'semester';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showViewPicker, setShowViewPicker] = useState(false);
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
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

  const renderCalendar = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    dayNames.forEach(day => {
      days.push(
        <View key={day} style={styles.dayName}>
          <Text style={[styles.dayNameText, { color: colors.textSecondary }]}>{day}</Text>
        </View>
      );
    });
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvents = events[day];
      const isToday = day === new Date().getDate() && 
                     month === new Date().getMonth() &&
                     year === new Date().getFullYear();
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && { ...styles.todayCell, backgroundColor: colors.primary + '20' }
          ]}
          onPress={() => {
            if (hasEvents) {
              setSelectedDate(new Date(year, month, day));
            }
          }}
        >
          <Text style={[
            styles.dayText,
            { color: colors.text },
            isToday && styles.todayText
          ]}>
            {day}
          </Text>
          {hasEvents && (
            <View style={styles.eventDots}>
              {hasEvents.slice(0, 3).map((event: any, index: number) => (
                <View
                  key={index}
                  style={[styles.eventDot, { backgroundColor: event.color }]}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  const selectedDay = selectedDate.getDate();
  const selectedEvents = events[selectedDay] || [];

  const renderWeekView = () => {
    const weeks = [];
    
    for (let week = 1; week <= 12; week++) {
      weeks.push(
        <TouchableOpacity
          key={week}
          style={[styles.weekCard, { backgroundColor: colors.card }]}
          onPress={() => router.push(`/week-detail?weekNumber=${week}`)}
        >
          <View style={styles.weekHeader}>
            <View>
              <Text style={[styles.weekTitle, { color: colors.text }]}>Week {week}</Text>
              <Text style={[styles.weekDates, { color: colors.textSecondary }]}>
                Sept {1 + (week - 1) * 7} - Sept {7 + (week - 1) * 7}
              </Text>
            </View>
            <Text style={[styles.weekArrow, { color: colors.textSecondary }]}>›</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return weeks;
  };

  const renderSemesterView = () => {
    const courseMonths = [
      { name: 'September', monthIndex: 8, year: 2024 },
      { name: 'October', monthIndex: 9, year: 2024 },
      { name: 'November', monthIndex: 10, year: 2024 },
      { name: 'December', monthIndex: 11, year: 2024 },
    ];
    
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    return courseMonths.map((month) => {
      const firstDay = new Date(month.year, month.monthIndex, 1).getDay();
      const daysInMonth = new Date(month.year, month.monthIndex + 1, 0).getDate();
      const calendarDays = [];
      
      // Add day name headers
      dayNames.forEach((day, idx) => {
        calendarDays.push(
          <View key={`header-${idx}`} style={styles.semesterDayHeader}>
            <Text style={[styles.semesterDayHeaderText, { color: colors.textSecondary }]}>{day}</Text>
          </View>
        );
      });
      
      // Add empty cells for days before month starts
      for (let i = 0; i < firstDay; i++) {
        calendarDays.push(<View key={`empty-${i}`} style={styles.semesterDayCell} />);
      }
      
      // Add actual days
      for (let day = 1; day <= daysInMonth; day++) {
        const hasEvents = events[day];
        calendarDays.push(
          <View key={day} style={styles.semesterDayCell}>
            <Text style={[
              styles.semesterDayText,
              { color: colors.text },
              hasEvents && styles.semesterDayWithEvents
            ]}>
              {day}
            </Text>
            {hasEvents && (
              <View style={styles.semesterEventIndicator}>
                {hasEvents.slice(0, 3).map((event: any, idx: number) => (
                  <View
                    key={idx}
                    style={[styles.semesterEventDot, { backgroundColor: event.color }]}
                  />
                ))}
              </View>
            )}
          </View>
        );
      }
      
      return (
        <View key={month.name} style={[styles.semesterMonth, { backgroundColor: colors.card }]}>
          <Text style={[styles.semesterMonthName, { color: colors.text }]}>{month.name} {month.year}</Text>
          <View style={styles.semesterCalendarGrid}>
            {calendarDays}
          </View>
        </View>
      );
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 140 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.viewSwitcher}
          onPress={() => setShowViewPicker(!showViewPicker)}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {viewMode === 'month' ? 'Month' : viewMode === 'week' ? 'Week' : 'Semester'} ▾
          </Text>
        </TouchableOpacity>
      </View>

      {showViewPicker && (
        <View style={[styles.viewPicker, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.viewOption, viewMode === 'month' && { backgroundColor: colors.primary }]}
            onPress={() => { setViewMode('month'); setShowViewPicker(false); }}
          >
            <Text style={[styles.viewOptionText, { color: viewMode === 'month' ? '#fff' : colors.text }]}>Month View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewOption, viewMode === 'week' && { backgroundColor: colors.primary }]}
            onPress={() => { setViewMode('week'); setShowViewPicker(false); }}
          >
            <Text style={[styles.viewOptionText, { color: viewMode === 'week' ? '#fff' : colors.text }]}>Week View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewOption, viewMode === 'semester' && { backgroundColor: colors.primary }]}
            onPress={() => { setViewMode('semester'); setShowViewPicker(false); }}
          >
            <Text style={[styles.viewOptionText, { color: viewMode === 'semester' ? '#fff' : colors.text }]}>Semester View</Text>
          </TouchableOpacity>
        </View>
      )}

      {viewMode === 'month' && (
        <>
          <View style={styles.monthNav}>
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: colors.card }]}
              onPress={() => setSelectedDate(new Date(year, month - 1, 1))}
            >
              <Text style={[styles.navButtonText, { color: colors.text }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.monthTitle, { color: colors.text }]}>
              {monthNames[month]} {year}
            </Text>
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: colors.card }]}
              onPress={() => setSelectedDate(new Date(year, month + 1, 1))}
            >
              <Text style={[styles.navButtonText, { color: colors.text }]}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.calendar, { backgroundColor: colors.card }]}>
            {renderCalendar()}
          </View>
        </>
      )}

      {viewMode === 'week' && (
        <View style={styles.weekContainer}>
          {renderWeekView()}
        </View>
      )}

      {viewMode === 'semester' && (
        <View style={styles.semesterContainer}>
          {renderSemesterView()}
        </View>
      )}

      {selectedEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Events on {monthNames[month]} {selectedDay}
          </Text>
          {selectedEvents.map((event: any, index: number) => (
            <View
              key={index}
              style={[styles.eventCard, { backgroundColor: colors.card }]}
            >
              <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
              <View style={styles.eventContent}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>
                  {event.title}
                </Text>
                {event.weight && (
                  <Text style={[styles.eventWeight, { color: '#FF4500' }]}>
                    Worth {event.weight} of grade
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  calendar: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayName: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  todayCell: {
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  todayText: {
    fontWeight: '700',
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  eventCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  eventColorBar: {
    width: 6,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventWeight: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewSwitcher: {
    padding: 4,
  },
  viewPicker: {
    margin: 16,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  viewOption: {
    padding: 14,
    borderRadius: 8,
    marginVertical: 4,
  },
  viewOptionText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  weekContainer: {
    padding: 16,
    gap: 12,
  },
  weekCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  weekDates: {
    fontSize: 14,
  },
  weekArrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  semesterContainer: {
    padding: 16,
    gap: 16,
  },
  semesterMonth: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  semesterMonthName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  semesterCalendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  semesterDayHeader: {
    width: '14.285%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  semesterDayHeaderText: {
    fontSize: 11,
    fontWeight: '600',
  },
  semesterDayCell: {
    width: '14.285%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  semesterDayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  semesterDayWithEvents: {
    fontWeight: '700',
  },
  semesterEventIndicator: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  semesterEventDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  semesterWeeks: {
    flexDirection: 'row',
    gap: 8,
  },
  semesterWeek: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  semesterWeekText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
