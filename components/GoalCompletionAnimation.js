import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Text, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

// Goal Completion Animation - Glassmorphism Style
export default function GoalCompletionAnimation({ visible, onHide }) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Animate in with rotation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Auto-hide after 2.5 seconds
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onHide}
    >
      <BlurView intensity={80} tint="dark" style={styles.container}>
        <Animated.View 
          style={[
            styles.celebrationContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }
          ]}
        >
          <BlurView intensity={100} tint="light" style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(52,199,89,0.3)', 'rgba(48,209,88,0.4)']}
              style={styles.gradientOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardBorder}>
                <Animated.View style={{ transform: [{ rotate }] }}>
                  <Text style={styles.emoji}>🎉</Text>
                </Animated.View>
                <Text style={styles.title}>Goal Completed!</Text>
                <Text style={styles.subtitle}>Great job staying hydrated!</Text>
                <View style={styles.checkmarkContainer}>
                  <LinearGradient
                    colors={['#34C759', '#30D158']}
                    style={styles.checkmarkGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.checkmark}>✓</Text>
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  celebrationContainer: {
    width: '85%',
    maxWidth: 340,
  },
  glassCard: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 15,
  },
  gradientOverlay: {
    borderRadius: 32,
  },
  cardBorder: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 32,
    padding: 36,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    textAlign: 'center',
  },
  checkmarkContainer: {
    marginTop: 8,
  },
  checkmarkGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  checkmark: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
  },
});
