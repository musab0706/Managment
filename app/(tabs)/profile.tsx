import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userMajor, setUserMajor] = useState('Computer Science');

  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    studentId: '0123456',
    schoolEmail: 'jdoe@uoguelph.ca',
    university: 'University of Guelph',
    coursesEnrolled: 5,
    averageGPA: 3.7,
  };

  // Load major from AsyncStorage when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMajor();
    }, [])
  );

  const loadMajor = async () => {
    try {
      const saved = await AsyncStorage.getItem('userPreferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.major) {
          setUserMajor(parsed.major);
        }
      }
    } catch (error) {
      console.error('Error loading major:', error);
    }
  };

  const pickImage = async () => {
    // Request permission only when user wants to upload
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 140 }}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity 
          style={[styles.settingsButton, { backgroundColor: colors.card }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={[styles.settingsText, { color: colors.text }]}>⚙</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={pickImage} style={[styles.photoCircle, { backgroundColor: colors.primary }]}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
          ) : (
            <Text style={styles.photoText}>
              {userData.firstName[0]}{userData.lastName[0]}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.name, { color: colors.text }]}>
          {userData.firstName} {userData.lastName}
        </Text>
        <Text style={[styles.studentId, { color: colors.textSecondary }]}>
          ID: {userData.studentId}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {userData.schoolEmail}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>University</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {userData.university}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Major</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {userMajor}
            </Text>
          </View>
        </View>


      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Academic Overview
        </Text>
        <View style={styles.academicGrid}>
          <View style={[styles.academicCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.academicValue, { color: colors.text }]}>
              {userData.coursesEnrolled}
            </Text>
            <Text style={[styles.academicLabel, { color: colors.textSecondary }]}>
              Courses
            </Text>
          </View>
          <View style={[styles.academicCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.academicValue, { color: colors.text }]}>
              {userData.averageGPA}
            </Text>
            <Text style={[styles.academicLabel, { color: colors.textSecondary }]}>
              GPA
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.gpaButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/gpa-calculator')}
        >
          <Text style={styles.gpaButtonText}>View GPA Calculator</Text>
        </TouchableOpacity>
      </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsText: {
    fontSize: 20,
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  photoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  studentId: {
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 24,
  },
  infoRow: {
    width: '100%',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  academicGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  academicCard: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  academicEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  academicValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  academicLabel: {
    fontSize: 14,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  gpaButton: {
    marginTop: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gpaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
