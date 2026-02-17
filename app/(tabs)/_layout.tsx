import { Text, View, Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';

// Animated Tab Icon Component with bounce effect
function AnimatedTabIcon({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Bounce animation when selected
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.15,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.spring(translateYAnim, {
            toValue: -2,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          })
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.08,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.spring(translateYAnim, {
            toValue: -1,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
          })
        ])
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [focused]);

  return (
    <Animated.View 
      style={{ 
        transform: [
          { scale: scaleAnim },
          { translateY: translateYAnim }
        ],
        width: 28, 
        height: 28, 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      {children}
    </Animated.View>
  );
}

export default function TabLayout() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: 'transparent',
          borderRadius: 24,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.6 : 0.2,
          shadowRadius: 30,
          elevation: 12,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={isDark ? 90 : 70}
            tint={isDark ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 24,
              overflow: 'hidden',
              backgroundColor: isDark ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.85)',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
            }}
          />
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDark ? '#8E8E93' : '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <View style={{
                width: 26,
                height: 26,
                borderWidth: 2,
                borderColor: color,
                borderRadius: 6,
                overflow: 'hidden',
              }}>
                {/* Top red bar like iOS Calendar */}
                <View style={{
                  height: 6,
                  backgroundColor: focused ? '#FF3B30' : color,
                  borderBottomWidth: 0.5,
                  borderBottomColor: color,
                }} />
                {/* Date number */}
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 2,
                }}>
                  <Text style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: color,
                  }}>31</Text>
                </View>
              </View>
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          title: 'Classes',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <View style={{
                width: 22,
                height: 26,
                borderWidth: 2,
                borderColor: color,
                borderRadius: 3,
                backgroundColor: focused ? color : 'transparent',
                position: 'relative',
              }}>
                {/* Book spine */}
                <View style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: focused ? 'rgba(255,255,255,0.3)' : 'transparent',
                  borderRightWidth: focused ? 0 : 1,
                  borderRightColor: color,
                }} />
                {/* Book pages lines */}
                {!focused && (
                  <View style={{ paddingLeft: 8, paddingTop: 6, gap: 3 }}>
                    <View style={{ height: 1.5, width: 10, backgroundColor: color }} />
                    <View style={{ height: 1.5, width: 10, backgroundColor: color }} />
                    <View style={{ height: 1.5, width: 10, backgroundColor: color }} />
                  </View>
                )}
              </View>
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <View style={{
                width: 26,
                height: 26,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Checkmark circle - iOS Reminders style */}
                <View style={{
                  width: 24,
                  height: 24,
                  borderWidth: 2,
                  borderColor: color,
                  backgroundColor: focused ? color : 'transparent',
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {focused && (
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '900',
                      color: '#fff',
                      marginTop: -2,
                    }}>✓</Text>
                  )}
                </View>
              </View>
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: 'Performance',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <View style={{
                width: 26,
                height: 26,
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                gap: 3,
                paddingBottom: 2,
              }}>
                {/* Rising bar chart - iOS style */}
                <View style={{
                  width: 5,
                  height: 12,
                  backgroundColor: focused ? color : 'transparent',
                  borderWidth: focused ? 0 : 2,
                  borderColor: color,
                  borderRadius: 2,
                }} />
                <View style={{
                  width: 5,
                  height: 18,
                  backgroundColor: focused ? color : 'transparent',
                  borderWidth: focused ? 0 : 2,
                  borderColor: color,
                  borderRadius: 2,
                }} />
                <View style={{
                  width: 5,
                  height: 24,
                  backgroundColor: focused ? color : 'transparent',
                  borderWidth: focused ? 0 : 2,
                  borderColor: color,
                  borderRadius: 2,
                }} />
              </View>
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused}>
              <View style={{
                width: 26,
                height: 26,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Person icon - iOS style */}
                <View style={{
                  width: 10,
                  height: 10,
                  borderWidth: 2,
                  borderColor: color,
                  backgroundColor: focused ? color : 'transparent',
                  borderRadius: 5,
                  marginBottom: 2,
                }} />
                <View style={{
                  width: 22,
                  height: 12,
                  borderWidth: 2,
                  borderColor: color,
                  backgroundColor: focused ? color : 'transparent',
                  borderRadius: 11,
                  borderTopLeftRadius: 11,
                  borderTopRightRadius: 11,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottomWidth: 0,
                }} />
              </View>
            </AnimatedTabIcon>
          ),
        }}
      />
    </Tabs>
  );
}
