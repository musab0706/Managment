import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

export default function VibrationSettings() {
  const [vibrationLevel, setVibrationLevel] = useState(5); // 1-10 scale

  const handleSliderChange = (value: number) => {
    setVibrationLevel(value);
    // Vibrate with intensity matching the slider position
    if (value < 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (value < 7) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleNext = () => {
    // TODO: Save vibration preference
    console.log('Selected vibration level:', vibrationLevel);
    router.push('/(onboarding)/courses');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.question}>Vibration intensity</Text>

        <View style={styles.sliderContainer}>
          <View style={styles.labelsContainer}>
            <Text style={styles.label}>Low</Text>
            <Text style={styles.label}>High</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={vibrationLevel}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#ddd"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#fff"
          />

          <Text style={styles.valueText}>{Math.round(vibrationLevel)}/10</Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 64,
  },
  sliderContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  nextButton: {
    backgroundColor: '#000',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
