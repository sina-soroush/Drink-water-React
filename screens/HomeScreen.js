import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../contexts/ThemeContext';
import HalfCircleProgress from '../components/HalfCircleProgress';
import {
  loadWaterIntake,
  saveWaterIntake,
  loadDailyGoal,
  saveDailyGoal,
  checkAndResetIfNewDay,
} from '../utils/storage';

// Home Screen - Main water tracking screen with Glassmorphism
export default function HomeScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  // State management - tracks water intake
  const [waterIntake, setWaterIntake] = useState(0); // Current glasses drunk
  const [dailyGoal, setDailyGoal] = useState(8); // Target glasses per day
  const [isLoading, setIsLoading] = useState(true);
  const [undoStack, setUndoStack] = useState([]); // Track history for undo
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const undoOpacity = useRef(new Animated.Value(0)).current;
  const undoTranslateY = useRef(new Animated.Value(20)).current;
  const counterScale = useRef(new Animated.Value(1)).current;
  
  // Calculate progress percentage
  const progress = (waterIntake / dailyGoal) * 100;
  
  // Load data on app start
  useEffect(() => {
    loadData();
  }, []);
  
  // Save data whenever intake changes
  useEffect(() => {
    if (!isLoading) {
      saveWaterIntake(waterIntake);
    }
  }, [waterIntake, isLoading]);
  
  // Show/hide undo button with animation
  useEffect(() => {
    if (undoStack.length > 0) {
      Animated.parallel([
        Animated.timing(undoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(undoTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(undoOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(undoTranslateY, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [undoStack.length]);
  
  // Load saved data from storage
  const loadData = async () => {
    try {
      const savedIntake = await loadWaterIntake();
      const savedGoal = await loadDailyGoal();
      
      // Check if it's a new day and reset if needed
      const wasReset = await checkAndResetIfNewDay(savedIntake);
      
      if (wasReset) {
        // New day - start fresh
        setWaterIntake(0);
        setDailyGoal(savedGoal);
      } else {
        // Same day - restore saved data
        setWaterIntake(savedIntake);
        setDailyGoal(savedGoal);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };
  
  // Update goal (will be called from Settings screen)
  const updateGoal = async (newGoal) => {
    setDailyGoal(newGoal);
    await saveDailyGoal(newGoal);
  };
  
  // Listen for goal updates from Settings screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // Reload goal when returning to this screen
      const savedGoal = await loadDailyGoal();
      setDailyGoal(savedGoal);
    });
    
    return unsubscribe;
  }, [navigation]);
  
  // Handle adding water with custom amount
  // Increases intake by specified glasses, triggers haptic feedback and animations
  const handleAddWater = async (amount = 1) => {
    // Check if goal already reached
    if (waterIntake >= dailyGoal) {
      // Goal reached - show alert and success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        '🎉 Goal Reached!',
        `You've already completed your daily goal of ${dailyGoal} glasses!`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    // Cap at daily goal
    const newIntake = Math.min(waterIntake + amount, dailyGoal);
    const actualAdded = newIntake - waterIntake;
    
    if (actualAdded <= 0) return;
    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Counter pulse animation
    Animated.sequence([
      Animated.timing(counterScale, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(counterScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Save current state to undo stack
    const previousIntake = waterIntake;
    setUndoStack(prev => [...prev.slice(-4), previousIntake]); // Keep last 5 actions
    
    // Update intake
    setWaterIntake(newIntake);
    
    // Animate progress
    Animated.spring(progressAnim, {
      toValue: (newIntake / dailyGoal) * 100,
      useNativeDriver: false,
      friction: 7,
      tension: 40,
    }).start();
    
    // Light haptic feedback on button tap
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Check if goal just completed
    if (newIntake === dailyGoal && waterIntake < dailyGoal) {
      // Goal completed - success haptic and celebration
      setTimeout(async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          '🎉 Congratulations!',
          `You've reached your daily goal of ${dailyGoal} glasses (${dailyGoal * 250}ml)!\n\nGreat job staying hydrated!`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }, 300);
    }
  };
  
  // Handle removing water
  const handleRemoveWater = async (amount = 1) => {
    if (waterIntake <= 0) return;
    
    // Save current state to undo stack
    const previousIntake = waterIntake;
    setUndoStack(prev => [...prev.slice(-4), previousIntake]);
    
    // Remove glasses (can't go below 0)
    const newIntake = Math.max(waterIntake - amount, 0);
    setWaterIntake(newIntake);
    
    // Animate progress back
    Animated.spring(progressAnim, {
      toValue: (newIntake / dailyGoal) * 100,
      useNativeDriver: false,
      friction: 7,
    }).start();
    
    // Medium haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  // Handle undo
  const handleUndo = async () => {
    if (undoStack.length === 0) return;
    
    // Get last action
    const previousIntake = undoStack[undoStack.length - 1];
    
    // Remove from stack
    setUndoStack(prev => prev.slice(0, -1));
    
    // Restore previous state
    setWaterIntake(previousIntake);
    
    // Animate progress back
    Animated.spring(progressAnim, {
      toValue: (previousIntake / dailyGoal) * 100,
      useNativeDriver: false,
      friction: 7,
    }).start();
    
    // Medium haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Glass Card */}
        <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={styles.glassCard}>
          <View style={[styles.glassCardBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]}>
            
            {/* Half Circle Progress Bar */}
            <View style={styles.progressContainer}>
              <HalfCircleProgress 
                progress={progress}
                size={280}
                strokeWidth={24}
              />
            </View>
            
            {/* Counter Display - Glass style */}
            <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={styles.counterGlass}>
              <Animated.View 
                style={[
                  styles.counterContainer,
                  { transform: [{ scale: counterScale }] }
                ]}
              >
                <Text style={[styles.counterMain, { color: isDark ? '#FFF' : '#003D5B' }]}>{waterIntake.toFixed(waterIntake % 1 === 0 ? 0 : 1)}</Text>
                <Text style={[styles.counterDivider, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,61,91,0.5)' }]}>/</Text>
                <Text style={[styles.counterGoal, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,61,91,0.6)' }]}>{dailyGoal}</Text>
              </Animated.View>
              <View style={styles.counterLabels}>
                <Text style={[styles.glassesLabel, { color: isDark ? '#FFF' : '#003D5B' }]}>glasses</Text>
                <Text style={[styles.mlLabel, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,61,91,0.7)' }]}>
                  {Math.round(waterIntake * 250)}ml / {dailyGoal * 250}ml
                </Text>
              </View>
            </BlurView>
            
          </View>
        </BlurView>
        
        {/* Action Buttons with Glass Effect */}
        <View style={styles.actionButtons}>
          
          {/* Primary Add Button - Glass Style */}
          <Animated.View style={[styles.primaryButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => handleAddWater(1)}
              disabled={waterIntake >= dailyGoal}
            >
              <BlurView 
                intensity={waterIntake >= dailyGoal ? 80 : 100} 
                tint="light" 
                style={[
                  styles.primaryGlassButton,
                  { borderColor: waterIntake >= dailyGoal ? 'rgba(52,199,89,0.4)' : 'rgba(0,122,255,0.4)' }
                ]}
              >
                <LinearGradient
                  colors={waterIntake >= dailyGoal 
                    ? ['rgba(52,199,89,0.3)', 'rgba(48,209,88,0.4)'] 
                    : ['rgba(0,122,255,0.3)', 'rgba(10,132,255,0.4)']}
                  style={styles.primaryButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons 
                    name={waterIntake >= dailyGoal ? "checkmark-circle" : "water"} 
                    size={36} 
                    color="#FFF" 
                  />
                  <View style={styles.primaryButtonTexts}>
                    <Text style={styles.primaryButtonText}>
                      {waterIntake >= dailyGoal ? 'Goal Reached!' : 'Add 1 Glass'}
                    </Text>
                    <Text style={styles.primaryButtonSubtext}>250ml</Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Secondary Action Buttons - Glass Grid */}
          <View style={styles.secondaryButtons}>
            
            {/* Remove Button */}
            <TouchableOpacity 
              style={styles.secondaryButtonWrapper}
              onPress={() => handleRemoveWater(1)}
              disabled={waterIntake === 0}
              activeOpacity={0.7}
            >
              <BlurView 
                intensity={waterIntake === 0 ? 40 : 80} 
                tint={isDark ? 'dark' : 'light'} 
                style={[
                  styles.secondaryGlassButton,
                  { borderColor: isDark ? 'rgba(255,69,58,0.3)' : 'rgba(255,59,48,0.3)' }
                ]}
              >
                <Ionicons 
                  name="remove-circle" 
                  size={28} 
                  color={waterIntake === 0 ? (isDark ? '#555' : '#C7C7CC') : '#FF3B30'} 
                />
                <Text style={[
                  styles.secondaryButtonText,
                  { color: waterIntake === 0 ? (isDark ? '#555' : '#C7C7CC') : (isDark ? '#FF6961' : '#FF3B30') }
                ]}>Remove</Text>
              </BlurView>
            </TouchableOpacity>
            
            {/* Add Half Glass */}
            <TouchableOpacity 
              style={styles.secondaryButtonWrapper}
              onPress={() => handleAddWater(0.5)}
              disabled={waterIntake >= dailyGoal}
              activeOpacity={0.7}
            >
              <BlurView 
                intensity={waterIntake >= dailyGoal ? 40 : 80} 
                tint={isDark ? 'dark' : 'light'} 
                style={[
                  styles.secondaryGlassButton,
                  { borderColor: isDark ? 'rgba(10,132,255,0.3)' : 'rgba(0,122,255,0.3)' }
                ]}
              >
                <Ionicons 
                  name="water-outline" 
                  size={28} 
                  color={waterIntake >= dailyGoal ? (isDark ? '#555' : '#C7C7CC') : (isDark ? '#0A84FF' : '#007AFF')} 
                />
                <Text style={[
                  styles.secondaryButtonText,
                  { color: waterIntake >= dailyGoal ? (isDark ? '#555' : '#C7C7CC') : (isDark ? '#FFF' : '#007AFF') }
                ]}>½ Glass</Text>
                <Text style={[
                  styles.secondaryButtonSubtext,
                  { color: waterIntake >= dailyGoal ? (isDark ? '#444' : '#C7C7CC') : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,122,255,0.6)') }
                ]}>125ml</Text>
              </BlurView>
            </TouchableOpacity>
            
            {/* Add 2 Glasses */}
            <TouchableOpacity 
              style={styles.secondaryButtonWrapper}
              onPress={() => handleAddWater(2)}
              disabled={waterIntake >= dailyGoal}
              activeOpacity={0.7}
            >
              <BlurView 
                intensity={waterIntake >= dailyGoal ? 40 : 80} 
                tint={isDark ? 'dark' : 'light'} 
                style={[
                  styles.secondaryGlassButton,
                  { borderColor: isDark ? 'rgba(52,199,89,0.3)' : 'rgba(52,199,89,0.3)' }
                ]}
              >
                <Ionicons 
                  name="add-circle" 
                  size={28} 
                  color={waterIntake >= dailyGoal ? (isDark ? '#555' : '#C7C7CC') : (isDark ? '#30D158' : '#34C759')} 
                />
                <Text style={[
                  styles.secondaryButtonText,
                  { color: waterIntake >= dailyGoal ? (isDark ? '#555' : '#C7C7CC') : (isDark ? '#FFF' : '#34C759') }
                ]}>+2 Glasses</Text>
                <Text style={[
                  styles.secondaryButtonSubtext,
                  { color: waterIntake >= dailyGoal ? (isDark ? '#444' : '#C7C7CC') : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(52,199,89,0.6)') }
                ]}>500ml</Text>
              </BlurView>
            </TouchableOpacity>
            
          </View>
        </View>
        
        {/* Undo Button - Glass Style */}
        {undoStack.length > 0 && (
          <Animated.View 
            style={[
              styles.undoButtonContainer,
              {
                opacity: undoOpacity,
                transform: [{ translateY: undoTranslateY }]
              }
            ]}
          >
            <TouchableOpacity 
              onPress={handleUndo}
              activeOpacity={0.7}
            >
              <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.undoGlassButton}>
                <Ionicons name="arrow-undo" size={18} color={isDark ? '#0A84FF' : '#007AFF'} />
                <Text style={[styles.undoButtonText, { color: isDark ? '#0A84FF' : '#007AFF' }]}>Undo Last Action</Text>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        {/* Bottom Navigation - Glass Tabs */}
        <View style={styles.navButtons}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.7}
          >
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.navGlassButton}>
              <Ionicons name="bar-chart" size={24} color={isDark ? '#0A84FF' : '#007AFF'} />
              <Text style={[styles.navButtonText, { color: isDark ? '#FFF' : '#007AFF' }]}>History</Text>
            </BlurView>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.navGlassButton}>
              <Ionicons name="settings" size={24} color={isDark ? '#0A84FF' : '#007AFF'} />
              <Text style={[styles.navButtonText, { color: isDark ? '#FFF' : '#007AFF' }]}>Settings</Text>
            </BlurView>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  
  // Glass Card Container
  glassCard: {
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glassCardBorder: {
    borderWidth: 1,
    borderRadius: 32,
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  
  // Progress Ring Styles
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  
  // Counter Glass Panel
  counterGlass: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 12,
  },
  counterMain: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
  },
  counterDivider: {
    fontSize: 40,
    fontWeight: '300',
    marginHorizontal: 6,
  },
  counterGoal: {
    fontSize: 40,
    fontWeight: '400',
  },
  counterLabels: {
    alignItems: 'center',
  },
  
  // Labels
  glassesLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  mlLabel: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Action Buttons
  actionButtons: {
    width: '100%',
    gap: 16,
  },
  
  // Primary Add Button - Glass Style
  primaryButtonContainer: {
    width: '100%',
  },
  primaryGlassButton: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonGradient: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  primaryButtonTexts: {
    alignItems: 'flex-start',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  primaryButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Secondary Buttons Grid
  secondaryButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  secondaryButtonWrapper: {
    flex: 1,
  },
  secondaryGlassButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 110,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  secondaryButtonSubtext: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Undo Button - Glass Style
  undoButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  undoGlassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.3)',
    gap: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  undoButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Bottom Navigation - Glass Tabs
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },
  navGlassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    minWidth: 140,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
