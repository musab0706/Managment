import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetData = async () => {
    Alert.alert(
      'Reset All Data? 🗑️',
      'This will delete all courses, preferences, notes, and grades. You will start completely fresh.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              // List of all keys we're using
              const keysToDelete = [
                'userPreferences',
                'userCourses',
                'hasCompletedOnboarding',
                'reminders',
                'reminderSections',
              ];
              
              // Delete all main keys
              for (const key of keysToDelete) {
                await AsyncStorage.removeItem(key);
              }
              
              // Get all keys to find course-specific data
              const allKeys = await AsyncStorage.getAllKeys();
              
              // Delete all course-specific data
              const courseKeys = allKeys.filter(key => 
                key.startsWith('course_notes_') || 
                key.startsWith('course_grades_') || 
                key.startsWith('course_weekly_') ||
                key.startsWith('completedCourses_') ||
                key.startsWith('selectedElectives_')
              );
              
              for (const key of courseKeys) {
                await AsyncStorage.removeItem(key);
              }
              
              Alert.alert('✅ Reset Complete!', 'All data has been cleared. You can now create a fresh admin profile.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data: ' + error);
            }
          }
        }
      ]
    );
  };

  const handleLogin = async () => {
    if (!email || pin.length !== 4) {
      Alert.alert('Error', 'Please enter your email and 4-digit PIN');
      return;
    }

    // Admin bypass - show onboarding
    if (email === '1112222' && pin === '0506') {
      Alert.alert('Welcome Admin! 👑', 'Logging in...');
      router.push('/(onboarding)/personalize');
      return;
    }

    setLoading(true);
    
    try {
      // Pad 4-digit PIN to 6 characters (adds "00" at end)
      const paddedPin = pin + '00';
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: paddedPin,
      });

      if (error) {
        Alert.alert('Login Error', error.message);
        setLoading(false);
        return;
      }

      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        Alert.alert(
          'Email Not Verified',
          'Please verify your email before logging in. Check your inbox for the verification link.',
          [
            {
              text: 'Resend Email',
              onPress: async () => {
                const { error } = await supabase.auth.resend({
                  type: 'signup',
                  email: email,
                });
                if (!error) {
                  Alert.alert('Success', 'Verification email sent!');
                }
              },
            },
            { text: 'OK' },
          ]
        );
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Login successful
      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Managly</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Welcome</Text>
        </View>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? '#2C2C2E' : '#f5f5f5',
              color: colors.text
            }]}
            placeholder="Email / Student ID"
            placeholderTextColor={isDark ? '#8E8E93' : '#b8b8b8'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, { 
              backgroundColor: isDark ? '#2C2C2E' : '#f5f5f5',
              color: colors.text
            }]}
            placeholder="4 - Digit PIN"
            placeholderTextColor={isDark ? '#8E8E93' : '#b8b8b8'}
            value={pin}
            onChangeText={(text) => {
              if (/^\d{0,4}$/.test(text)) {
                setPin(text);
              }
            }}
            secureTextEntry={true}
            keyboardType="number-pad"
            maxLength={4}
          />

          <View style={styles.checkboxContainer}>
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Keep me logged in</Text>
            <Switch
              value={keepLoggedIn}
              onValueChange={setKeepLoggedIn}
              trackColor={{ false: '#d1d5db', true: '#8b9dc3' }}
              thumbColor="#fff"
              ios_backgroundColor="#d1d5db"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.6 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log in'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.createAccountButton}>
            <Text style={[styles.createAccountText, { color: colors.textSecondary }]}>Create account</Text>
          </TouchableOpacity>

          {/* Skip to App Button */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>⚡ Skip to App</Text>
          </TouchableOpacity>

          {/* Reset Data Button */}
          <TouchableOpacity onPress={handleResetData} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>🗑️ Reset All Data</Text>
          </TouchableOpacity>
        </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
  },
  card: {
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  input: {
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#8b9dc3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: '#8b9dc3',
    fontSize: 16,
    fontWeight: '600',
  },
  createAccountButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  createAccountText: {
    fontSize: 15,
    fontWeight: '500',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
