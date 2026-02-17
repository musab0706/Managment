import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

export default function SignupScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [studentId, setStudentId] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    // Only allow @uoguelph.ca emails
    return /^[^\s@]+@uoguelph\.ca$/i.test(email);
  };

  const validateStudentId = (id: string) => {
    // UofG Student IDs are 7 digits (e.g., 1234567)
    return /^\d{7}$/.test(id);
  };

  const handleSignup = async () => {
    const newErrors: Record<string, string> = {};

    if (!studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!validateStudentId(studentId)) {
      newErrors.studentId = 'Student ID must be 7 digits';
    }
    
    if (!schoolEmail.trim()) {
      newErrors.schoolEmail = 'School email is required';
    } else if (!validateEmail(schoolEmail)) {
      newErrors.schoolEmail = 'Must be a valid @uoguelph.ca email';
    }
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!pin.trim()) {
      newErrors.pin = 'PIN is required';
    } else if (pin.length !== 4) {
      newErrors.pin = 'PIN must be 4 digits';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Pad 4-digit PIN to 6 characters for Supabase (adds "00" at end)
        const paddedPin = pin + '00';
        
        // Create user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: schoolEmail,
          password: paddedPin,
          options: {
            data: {
              student_id: studentId,
              first_name: firstName,
            },
          },
        });

        if (error) {
          Alert.alert('Signup Error', error.message);
          return;
        }

        // Show success message
        Alert.alert(
          'Verification Email Sent! 📧',
          `We sent a verification link to ${schoolEmail}. Please check your email and click the link to verify your account.`,
          [
            {
              text: 'OK',
              onPress: () => router.push('/(auth)'),
            },
          ]
        );
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to create account');
      }
    }
  };

  const renderInput = (label: string, value: string, onChangeText: (text: string) => void, options?: any) => (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: isDark ? '#2C2C2E' : '#f5f5f5',
          color: colors.text
        }]}
        placeholder={label}
        placeholderTextColor={isDark ? '#8E8E93' : '#999'}
        value={value}
        onChangeText={onChangeText}
        {...options}
      />
      {errors[options?.errorKey || label.toLowerCase().replace(' ', '')] && (
        <Text style={styles.errorText}>{errors[options?.errorKey || label.toLowerCase().replace(' ', '')]}</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>

            {renderInput('Student ID', studentId, setStudentId, { errorKey: 'studentId' })}
            {renderInput('School Email', schoolEmail, setSchoolEmail, { 
              keyboardType: 'email-address', 
              autoCapitalize: 'none',
              errorKey: 'schoolEmail'
            })}
            {renderInput('First Name', firstName, setFirstName, { errorKey: 'firstName' })}
            {renderInput('4-Digit PIN', pin, setPin, { 
              secureTextEntry: true,
              keyboardType: 'number-pad',
              maxLength: 4,
              errorKey: 'pin'
            })}

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)')} style={styles.loginLink}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Already have an account? <Text style={styles.loginBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: 6,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#8b9dc3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: '#8b9dc3',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginBold: {
    fontWeight: '700',
    color: '#667eea',
  },
});
