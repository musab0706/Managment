import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';

export default function SoundSettings() {
  const [soundLevel, setSoundLevel] = useState(5); // 1-10 scale, 0 = disabled
  const [noSound, setNoSound] = useState(false);

  const handleNext = () => {
    // TODO: Save sound preference
    const finalSoundLevel = noSound ? 0 : soundLevel;
    console.log('Selected sound level:', finalSoundLevel);
    router.push('/(onboarding)/vibration');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.question}>Notification sound preferences</Text>

        <View style={styles.sliderContainer}>
          <View style={styles.labelsContainer}>
            <Text style={styles.label}>Low</Text>
            <Text style={styles.label}>High</Text>
          </View>

          <Slider
            style={[styles.slider, noSound && styles.sliderDisabled]}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={soundLevel}
            onValueChange={setSoundLevel}
            disabled={noSound}
            minimumTrackTintColor={noSound ? '#ddd' : '#ccc'}
            maximumTrackTintColor="#ddd"
            thumbTintColor={noSound ? '#ccc' : '#fff'}
          />

          <Text style={[styles.valueText, noSound && styles.valueTextDisabled]}>
            {Math.round(soundLevel)}/10
          </Text>

          {/* No Sound Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={noSound}
              onValueChange={setNoSound}
              color={noSound ? '#000' : undefined}
            />
            <Text style={styles.checkboxLabel}>I don't want sound</Text>
          </View>
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
  sliderDisabled: {
    opacity: 0.5,
  },
  valueText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  valueTextDisabled: {
    color: '#ccc',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
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
