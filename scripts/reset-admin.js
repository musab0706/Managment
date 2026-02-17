/**
 * Reset Admin Profile Script
 * 
 * This script clears all AsyncStorage data for the admin account.
 * Run this to start fresh with a clean profile.
 * 
 * Usage:
 * 1. In your app, press 'r' in the terminal to reload
 * 2. The app will restart with no stored data
 * 3. Log in with 1112222 / 0506 to go through onboarding again
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function resetAdminProfile() {
  try {
    console.log('🗑️ Starting admin profile reset...');
    
    // List of all keys we're using
    const keysToDelete = [
      'userPreferences',
      'userCourses',
      'hasCompletedOnboarding',
    ];
    
    // Delete all main keys
    for (const key of keysToDelete) {
      await AsyncStorage.removeItem(key);
      console.log(`✅ Deleted: ${key}`);
    }
    
    // Get all keys to find course-specific data
    const allKeys = await AsyncStorage.getAllKeys();
    
    // Delete all course-specific data (notes, grades, weekly checklists)
    const courseKeys = allKeys.filter(key => 
      key.startsWith('course_notes_') || 
      key.startsWith('course_grades_') || 
      key.startsWith('course_weekly_') ||
      key.startsWith('completedCourses_')
    );
    
    for (const key of courseKeys) {
      await AsyncStorage.removeItem(key);
      console.log(`✅ Deleted: ${key}`);
    }
    
    console.log('✨ Admin profile reset complete!');
    console.log('📱 Reload the app to start fresh');
    
    return true;
  } catch (error) {
    console.error('❌ Error resetting profile:', error);
    return false;
  }
}
