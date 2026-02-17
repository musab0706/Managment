import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';

// Complete University of Guelph Majors List (2025-2026)
const MAJORS = [
  'Accounting',
  'Agriculture',
  'Animal Biology',
  'Animal Science',
  'Anthropology',
  'Applied Geomatics',
  'Applied Human Nutrition',
  'Art History',
  'Arts and Sciences',
  'Bio-Medical Science',
  'Biochemistry',
  'Biodiversity',
  'Biological and Medical Physics',
  'Biological and Pharmaceutical Chemistry',
  'Biological Engineering',
  'Biological Science',
  'Biology',
  'Biomedical Engineering',
  'Biomedical Toxicology',
  'Biotechnology',
  'Black Canadian Studies',
  'Business',
  'Business Data Analytics',
  'Business Economics',
  'Chemical Physics',
  'Chemistry',
  'Child Studies',
  'Classical and Modern Cultures',
  'Classical Studies',
  'Computer Engineering',
  'Computer Science',
  'Computing and Information Science',
  'Creative Arts, Health and Wellness',
  'Creative Writing',
  'Criminal Justice and Public Policy',
  'Crop Science',
  'Culture and Technology Studies',
  'Earth Observation and Geographic Information Science',
  'Ecology',
  'Economics',
  'Engineering Systems and Computing',
  'English',
  'Entrepreneurship',
  'Environment and Resource Management',
  'Environmental Citizenship',
  'Environmental Conservation',
  'Environmental Economics and Policy',
  'Environmental Engineering',
  'Environmental Governance',
  'Environmental Management',
  'Environmental Sciences',
  'Equine Management',
  'European Cultures',
  'Family and Child Studies',
  'Family Studies and Human Development',
  'Food and Agricultural Business',
  'Food Engineering',
  'Food Science',
  'Food, Agricultural and Resource Economics',
  'French Studies',
  'Geography',
  'German',
  'Government, Economics and Management',
  'History',
  'Horticulture',
  'Hospitality and Tourism Management',
  'Human Kinetics',
  'Human Resources',
  'Indigenous Environmental Governance',
  'Indigenous Environmental Science and Practice',
  'International Business',
  'International Development Studies',
  'Italian',
  'Justice and Legal Studies',
  'Landscape Architecture',
  'Leadership',
  'Linguistics',
  'Management',
  'Management Economics and Finance',
  'Marine and Freshwater Biology',
  'Marketing',
  'Marketing Management',
  'Mathematical Economics',
  'Mathematical Science',
  'Mathematics',
  'Mechanical Engineering',
  'Mechatronics Engineering',
  'Media and Cinema Studies',
  'Microbiology',
  'Molecular Biology and Genetics',
  'Museum Studies',
  'Music',
  'Nanoscience',
  'Neuroscience',
  'Nutritional and Nutraceutical Sciences',
  'One Health',
  'Organic Agriculture',
  'Philosophy',
  'Physical Science',
  'Physics',
  'Plant Science',
  'Political Science',
  'Project Management',
  'Psychology',
  'Public Policy and Administration',
  'Real Estate',
  'Restaurant and Beverage Management',
  'Sexualities, Genders and Social Change',
  'Sociology',
  'Software Engineering',
  'Spanish and Hispanic Studies',
  'Sport and Event Management',
  'Statistics',
  'Studio Art',
  'Sustainable Business',
  'Theatre Studies',
  'Theoretical Physics',
  'Veterinary Medicine',
  'Water Resources Engineering',
  'Wildlife Biology and Conservation',
  'Zoology',
];

export default function MajorQuestion() {
  const [searchText, setSearchText] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredMajors = MAJORS.filter(major =>
    major.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major);
    setSearchText(major);
    setShowDropdown(false);
  };

  const handleNext = () => {
    if (selectedMajor) {
      // TODO: Save major preference
      console.log('Selected major:', selectedMajor);
      router.push('/(onboarding)/sound');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.question}>What is your major?</Text>

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
                setSelectedMajor('');
                setShowDropdown(false);
              }}
            >
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown List */}
        {showDropdown && filteredMajors.length > 0 && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredMajors}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectMajor(item)}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
            />
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, !selectedMajor && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedMajor}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 48,
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
    maxHeight: 250,
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 32,
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
});
