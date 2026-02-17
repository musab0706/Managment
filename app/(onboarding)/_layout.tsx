import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="personalize" />
      <Stack.Screen name="intro" />
      <Stack.Screen name="theme" />
      <Stack.Screen name="notification-intensity" />
      <Stack.Screen name="major" />
      <Stack.Screen name="sound-settings" />
      <Stack.Screen name="vibration-settings" />
      <Stack.Screen name="courses" />
    </Stack>
  );
}
