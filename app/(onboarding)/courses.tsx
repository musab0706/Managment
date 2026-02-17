import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { UOGUELPH_COURSES } from '../../data/uoguelph-courses';

// Convert to format expected by this component
const COURSES = UOGUELPH_COURSES.map(course => ({
  code: course.code,
  name: course.name,
  department: course.department,
}));

// Color wheel palette - organized by hue (like a real color wheel)
const COLOR_WHEEL_PALETTE = [
  // Reds
  ['#8B0000', '#B22222', '#DC143C', '#FF0000', '#FF4500', '#FF6347'],
  // Oranges
  ['#FF7F50', '#FF8C00', '#FFA500', '#FFB84D', '#FFD700', '#FFEB3B'],
  // Yellows
  ['#FFFF00', '#FFFF8D', '#FFFACD', '#F0E68C', '#EEE8AA', '#BDB76B'],
  // Greens
  ['#9ACD32', '#7FFF00', '#00FF00', '#32CD32', '#00FA9A', '#00FF7F'],
  // Teals/Cyans
  ['#40E0D0', '#48D1CC', '#00CED1', '#00FFFF', '#00E5FF', '#00BCD4'],
  // Blues
  ['#1E90FF', '#0000FF', '#0000CD', '#191970', '#000080', '#4169E1'],
  // Purples
  ['#9370DB', '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6'],
  // Pinks
  ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FF85C1', '#E91E63'],
  // Magentas
  ['#C71585', '#D02090', '#EE82EE', '#DDA0DD', '#FF00FF', '#8B008B'],
  // Browns/Neutrals
  ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#BC8F8F', '#F4A460'],
];

interface SelectedCourse {
  code: string;
  name: string;
  color: string;
}

export default function CourseSelection() {
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<{ code: string; name: string } | null>(null);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customR, setCustomR] = useState(255);
  const [customG, setCustomG] = useState(0);
  const [customB, setCustomB] = useState(0);

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const customColor = rgbToHex(customR, customG, customB);

  const filteredCourses = COURSES.filter(
    course =>
      (course.code.toLowerCase().includes(searchText.toLowerCase()) ||
       course.name.toLowerCase().includes(searchText.toLowerCase())) &&
      !selectedCourses.some(sc => sc.code === course.code)
  );

  const handleSelectCourse = (course: { code: string; name: string }) => {
    setPendingCourse(course);
    setShowColorPicker(true);
    setSearchText('');
    setShowDropdown(false);
  };

  const handleColorSelect = (color: string) => {
    if (pendingCourse) {
      setSelectedCourses([...selectedCourses, { ...pendingCourse, color }]);
      setPendingCourse(null);
      setShowColorPicker(false);
      setShowCustomPicker(false);
      // Reset custom color to red for next time
      setCustomR(255);
      setCustomG(0);
      setCustomB(0);
    }
  };

  const handleRemoveCourse = (code: string) => {
    setSelectedCourses(selectedCourses.filter(c => c.code !== code));
  };

  const handleNext = () => {
    if (selectedCourses.length > 0) {
      // TODO: Save selected courses with colors
      console.log('Selected courses:', selectedCourses);
      router.push('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>Select your courses</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setShowDropdown(text.length > 0);
            }}
            onFocus={() => setShowDropdown(searchText.length > 0)}
            placeholderTextColor="#999"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchText('');
                setShowDropdown(false);
              }}
            >
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown */}
        {showDropdown && filteredCourses.length > 0 && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredCourses}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectCourse(item)}
                >
                  <Text style={styles.courseCode}>{item.code}</Text>
                  <Text style={styles.courseName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
            />
          </View>
        )}

        {/* Selected Courses Pills */}
        <View style={styles.selectedCoursesContainer}>
          {selectedCourses.map((course) => (
            <View
              key={course.code}
              style={[styles.coursePill, { borderColor: course.color, borderWidth: 2 }]}
            >
              <Text style={styles.pillText}>{course.code}</Text>
              <TouchableOpacity onPress={() => handleRemoveCourse(course.code)}>
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, selectedCourses.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedCourses.length === 0}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal
        isVisible={showColorPicker}
        onBackdropPress={() => {
          setShowColorPicker(false);
          setShowCustomPicker(false);
        }}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose a color for {pendingCourse?.code}</Text>

          {!showCustomPicker ? (
            <>
              {/* Color Wheel Palette */}
              <ScrollView 
                style={styles.colorWheelScroll}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.colorWheelContainer}>
                  {COLOR_WHEEL_PALETTE.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.colorRow}>
                      {row.map((color) => (
                        <TouchableOpacity
                          key={color}
                          style={[styles.colorCircle, { backgroundColor: color }]}
                          onPress={() => handleColorSelect(color)}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Custom Color Button */}
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => setShowCustomPicker(true)}
              >
                <Text style={styles.customButtonText}>🎨 Custom Color</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Custom Color Picker */}
              <View style={styles.customPickerContainer}>
                {/* Color Preview with Hex */}
                <View style={[styles.colorPreview, { backgroundColor: customColor }]}>
                  <View style={styles.hexBadge}>
                    <Text style={styles.hexText}>{customColor.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Red Slider */}
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>🔴 Red: {Math.round(customR)}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={255}
                    value={customR}
                    onValueChange={setCustomR}
                    minimumTrackTintColor="#FF0000"
                    maximumTrackTintColor="#e0e0e0"
                    thumbTintColor="#FF0000"
                  />
                </View>

                {/* Green Slider */}
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>🟢 Green: {Math.round(customG)}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={255}
                    value={customG}
                    onValueChange={setCustomG}
                    minimumTrackTintColor="#00FF00"
                    maximumTrackTintColor="#e0e0e0"
                    thumbTintColor="#00FF00"
                  />
                </View>

                {/* Blue Slider */}
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>🔵 Blue: {Math.round(customB)}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={255}
                    value={customB}
                    onValueChange={setCustomB}
                    minimumTrackTintColor="#0000FF"
                    maximumTrackTintColor="#e0e0e0"
                    thumbTintColor="#0000FF"
                  />
                </View>

                {/* Buttons */}
                <View style={styles.customPickerButtons}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setShowCustomPicker(false)}
                  >
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleColorSelect(customColor)}
                  >
                    <Text style={styles.selectButtonText}>Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  question: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 24,
    color: '#999',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  dropdown: {
    flex: 1,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  courseCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
    color: '#666',
  },
  selectedCoursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
    minHeight: 50,
  },
  coursePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  removeText: {
    fontSize: 20,
    color: '#999',
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 420,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  colorWheelScroll: {
    maxHeight: 400,
  },
  colorWheelContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  customButton: {
    backgroundColor: '#000',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  customPickerContainer: {
    width: '100%',
  },
  colorPreview: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    marginBottom: 28,
    borderWidth: 3,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  hexText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  customPickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
