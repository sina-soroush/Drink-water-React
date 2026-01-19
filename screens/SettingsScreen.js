import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../contexts/ThemeContext';
import { loadDailyGoal, saveDailyGoal } from '../utils/storage';

// Settings Screen - Glassmorphism Design
export default function SettingsScreen({ navigation }) {
  const { isDark, colors, toggleTheme, themeMode } = useTheme();
  const [selectedGoal, setSelectedGoal] = useState(8);
  const goalOptions = [6, 8, 10, 12];
  
  // Load current goal on mount
  useEffect(() => {
    loadCurrentGoal();
  }, []);
  
  const loadCurrentGoal = async () => {
    const goal = await loadDailyGoal();
    setSelectedGoal(goal);
  };
  
  // Handle goal change
  const handleGoalChange = async (newGoal) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGoal(newGoal);
    await saveDailyGoal(newGoal);
    
    // Show confirmation
    Alert.alert(
      'Goal Updated',
      `Your daily goal is now ${newGoal} glasses (${newGoal * 250}ml)`,
      [{ text: 'OK' }]
    );
  };
  
  const getThemeIcon = () => {
    if (themeMode === 'light') return 'sunny';
    if (themeMode === 'dark') return 'moon';
    return 'phone-portrait';
  };
  
  const getThemeLabel = () => {
    if (themeMode === 'light') return 'Light Mode';
    if (themeMode === 'dark') return 'Dark Mode';
    return 'Auto (System)';
  };
  
  return (
    <LinearGradient
      colors={isDark 
        ? ['#0A0E27', '#1A1F3A', '#2B3A67', '#3B5998'] 
        : ['#4FACFE', '#00F2FE', '#43E8E1', '#00D9FF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          
          {/* Theme Toggle Section - Glass Card */}
          <BlurView intensity={isDark ? 60 : 80} tint={isDark ? 'dark' : 'light'} style={styles.glassCard}>
            <View style={[styles.glassCardBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#003D5B' }]}>
                Appearance
              </Text>
              <Text style={[styles.sectionSubtitle, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,61,91,0.6)' }]}>
                Customize the app's theme
              </Text>
              
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  toggleTheme();
                }}
                activeOpacity={0.7}
              >
                <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={styles.themeGlassButton}>
                  <View style={styles.themeButtonLeft}>
                    <LinearGradient
                      colors={isDark ? ['#0A84FF', '#0066CC'] : ['#007AFF', '#0051D5']}
                      style={styles.themeIconGlass}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name={getThemeIcon()} size={24} color="#FFF" />
                    </LinearGradient>
                    <View>
                      <Text style={[styles.themeButtonTitle, { color: isDark ? '#FFF' : '#003D5B' }]}>
                        {getThemeLabel()}
                      </Text>
                      <Text style={[styles.themeButtonSubtitle, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,61,91,0.6)' }]}>
                        Tap to cycle
                      </Text>
                    </View>
                  </View>
                  <Ionicons 
                    name="chevron-forward"
                    size={20}
                    color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,61,91,0.5)'}
                  />
                </BlurView>
              </TouchableOpacity>
            </View>
          </BlurView>
        
          {/* Daily Goal Section - Glass Card */}
          <BlurView intensity={isDark ? 60 : 80} tint={isDark ? 'dark' : 'light'} style={styles.glassCard}>
            <View style={[styles.glassCardBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#003D5B' }]}>
                Daily Goal
              </Text>
              <Text style={[styles.sectionSubtitle, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,61,91,0.6)' }]}>
                Choose your target water intake per day
              </Text>
            
              <View style={styles.goalOptions}>
                {goalOptions.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => handleGoalChange(goal)}
                    activeOpacity={0.7}
                    style={styles.goalOptionWrapper}
                  >
                    {selectedGoal === goal ? (
                      <LinearGradient
                        colors={isDark 
                          ? ['rgba(10,132,255,0.6)', 'rgba(0,102,204,0.8)'] 
                          : ['rgba(0,122,255,0.6)', 'rgba(0,81,213,0.8)']}
                        style={styles.goalOptionSelected}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={styles.goalOptionContent}>
                          <Text style={styles.goalOptionNumberSelected}>{goal}</Text>
                          <Text style={styles.goalOptionLabelSelected}>glasses</Text>
                          <Text style={styles.goalOptionMlSelected}>{goal * 250}ml</Text>
                          <View style={styles.checkmark}>
                            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                          </View>
                        </View>
                      </LinearGradient>
                    ) : (
                      <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.goalOptionGlass}>
                        <View style={styles.goalOptionContent}>
                          <Text style={[styles.goalOptionNumber, { color: isDark ? '#FFF' : '#003D5B' }]}>{goal}</Text>
                          <Text style={[styles.goalOptionLabel, { color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,61,91,0.8)' }]}>glasses</Text>
                          <Text style={[styles.goalOptionMl, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,61,91,0.5)' }]}>{goal * 250}ml</Text>
                        </View>
                      </BlurView>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BlurView>
        
          {/* Info Cards - Glass Style */}
          <View style={styles.infoSection}>
            
            {/* Why 8 Glasses Card */}
            <BlurView intensity={isDark ? 60 : 80} tint={isDark ? 'dark' : 'light'} style={styles.infoGlassCard}>
              <View style={[styles.glassCardBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]}>
                <View style={[styles.infoIconGlass, { backgroundColor: isDark ? 'rgba(0,122,255,0.2)' : 'rgba(0,122,255,0.15)' }]}>
                  <Ionicons name="water" size={28} color={isDark ? '#0A84FF' : '#007AFF'} />
                </View>
                <Text style={[styles.infoTitle, { color: isDark ? '#FFF' : '#003D5B' }]}>
                  Why 8 Glasses?
                </Text>
                <Text style={[styles.infoText, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,61,91,0.7)' }]}>
                  The "8x8 rule" suggests drinking eight 8-ounce glasses of water per day, 
                  which equals about 2 liters or half a gallon.
                </Text>
              </View>
            </BlurView>
            
            {/* Daily Reset Card */}
            <BlurView intensity={isDark ? 60 : 80} tint={isDark ? 'dark' : 'light'} style={styles.infoGlassCard}>
              <View style={[styles.glassCardBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]}>
                <View style={[styles.infoIconGlass, { backgroundColor: isDark ? 'rgba(255,159,10,0.2)' : 'rgba(255,149,0,0.15)' }]}>
                  <Ionicons name="time" size={28} color={isDark ? '#FF9F0A' : '#FF9500'} />
                </View>
                <Text style={[styles.infoTitle, { color: isDark ? '#FFF' : '#003D5B' }]}>
                  Daily Reset
                </Text>
                <Text style={[styles.infoText, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,61,91,0.7)' }]}>
                  Your water intake automatically resets at midnight. 
                  Yesterday's data is saved to your history.
                </Text>
              </View>
            </BlurView>
            
            {/* Track Progress Card */}
            <BlurView intensity={isDark ? 60 : 80} tint={isDark ? 'dark' : 'light'} style={styles.infoGlassCard}>
              <View style={[styles.glassCardBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]}>
                <View style={[styles.infoIconGlass, { backgroundColor: isDark ? 'rgba(52,199,89,0.2)' : 'rgba(52,199,89,0.15)' }]}>
                  <Ionicons name="bar-chart" size={28} color={isDark ? '#30D158' : '#34C759'} />
                </View>
                <Text style={[styles.infoTitle, { color: isDark ? '#FFF' : '#003D5B' }]}>
                  Track Your Progress
                </Text>
                <Text style={[styles.infoText, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,61,91,0.7)' }]}>
                  View your last 7 days of water intake in the History tab.
                </Text>
              </View>
            </BlurView>
            
          </View>
        
          {/* App Info */}
          <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={styles.appInfoGlass}>
            <Text style={[styles.appInfoText, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,61,91,0.5)' }]}>
              💧 Hydration App v2.0.0
            </Text>
            <Text style={[styles.appInfoText, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,61,91,0.5)' }]}>
              Built with React Native & Expo
            </Text>
            <Text style={[styles.appInfoText, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,61,91,0.5)' }]}>
              iOS 26 Optimized • Glassmorphism Design
            </Text>
          </BlurView>
          
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 12,
  },
  
  // Glass Card
  glassCard: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  glassCardBorder: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 24,
  },
  
  // Section Headers
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 20,
    lineHeight: 20,
  },
  
  // Theme Button
  themeGlassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  themeButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  themeIconGlass: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  themeButtonSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  
  // Goal Options
  goalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalOptionWrapper: {
    flex: 1,
    minWidth: '45%',
  },
  goalOptionGlass: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  goalOptionSelected: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  goalOptionContent: {
    padding: 24,
    alignItems: 'center',
  },
  goalOptionNumber: {
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 6,
  },
  goalOptionNumberSelected: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  goalOptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalOptionLabelSelected: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  goalOptionMl: {
    fontSize: 13,
    fontWeight: '500',
  },
  goalOptionMlSelected: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  
  // Info Section
  infoSection: {
    gap: 16,
    marginBottom: 20,
  },
  infoGlassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  infoIconGlass: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  
  // App Info
  appInfoGlass: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  appInfoText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
});
