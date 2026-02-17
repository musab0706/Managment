import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeQuestion() {
  const { theme, setTheme, colors } = useTheme();

  const handleNext = () => {
    console.log('Selected theme:', theme);
    router.push('/(onboarding)/notification-intensity');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.question, { color: colors.text }]}>Choose your theme</Text>

        {/* Toggle Switch */}
        <View style={[styles.toggleContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              theme === 'light' && { backgroundColor: theme === 'light' ? '#e0e0e0' : '#333' },
            ]}
            onPress={() => setTheme('light')}
          >
            <Text style={[
              styles.toggleText,
              { color: theme === 'light' ? colors.text : colors.textSecondary },
            ]}>
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              theme === 'dark' && { backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0' },
            ]}
            onPress={() => setTheme('dark')}
          >
            <Text style={[
              styles.toggleText,
              { color: theme === 'dark' ? colors.text : colors.textSecondary },
            ]}>
              Dark
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: colors.primary }]} 
          onPress={handleNext}
        >
          <Text style={[styles.nextButtonText, { color: theme === 'dark' ? '#000' : '#fff' }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 48,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 32,
    padding: 4,
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 28,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
