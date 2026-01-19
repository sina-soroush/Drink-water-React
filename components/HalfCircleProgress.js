import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * HalfCircleProgress Component - Enhanced Glassmorphism Style
 * 
 * A modern speedometer-style half-circle progress indicator
 * with gradient stroke and glow effect (no circle indicator)
 * Color transitions: Blue (0%) → Cyan (50%) → Green (100%)
 * 
 * @param {number} progress - Progress percentage (0-100)
 * @param {number} size - Diameter of the half circle (default: 280)
 * @param {number} strokeWidth - Width of the progress stroke (default: 24)
 */
export default function HalfCircleProgress({ progress = 0, size = 280, strokeWidth = 24 }) {
  const animatedProgress = useSharedValue(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half circle circumference
  
  useEffect(() => {
    animatedProgress.value = withSpring(progress, {
      damping: 15,
      stiffness: 90,
      mass: 1,
    });
  }, [progress]);
  
  const animatedProps = useAnimatedProps(() => {
    const progressValue = Math.min(Math.max(animatedProgress.value, 0), 100);
    const strokeDashoffset = circumference - (circumference * progressValue) / 100;
    
    return {
      strokeDashoffset,
    };
  });
  
  // Create the half-circle path (semi-circle from left to right)
  const center = size / 2;
  const startAngle = Math.PI; // Start at left (180 degrees)
  const endAngle = 0; // End at right (0 degrees)
  
  const startX = center + radius * Math.cos(startAngle);
  const startY = center + radius * Math.sin(startAngle);
  const endX = center + radius * Math.cos(endAngle);
  const endY = center + radius * Math.sin(endAngle);
  
  const pathData = `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 0 1 ${endX} ${endY}
  `;
  
  return (
    <View style={[styles.container, { width: size, height: size / 2 + strokeWidth + 20 }]}>
      <Svg width={size} height={size / 2 + strokeWidth + 20} viewBox={`0 0 ${size} ${size / 2 + strokeWidth + 20}`}>
        <Defs>
          {/* Modern gradient: Blue to Cyan to Green */}
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#007AFF" stopOpacity="1" />
            <Stop offset="40%" stopColor="#00C7BE" stopOpacity="1" />
            <Stop offset="75%" stopColor="#30D158" stopOpacity="1" />
            <Stop offset="100%" stopColor="#34C759" stopOpacity="1" />
          </LinearGradient>
          
          {/* Glow gradient for dot */}
          <LinearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#00C7BE" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Background track with glassmorphism effect */}
        <Path
          d={pathData}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Outer glow effect */}
        <AnimatedPath
          d={pathData}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          fill="none"
          opacity={0.3}
        />
        
        {/* Main animated progress path */}
        <AnimatedPath
          d={pathData}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          fill="none"
        />
        
        {/* Animated indicator dot with glow */}
        <AnimatedCircle
          animatedProps={animatedDotProps}
          r={strokeWidth / 2 + 4}
          fill="url(#dotGradient)"
          opacity={0.6}
        />
        <AnimatedCircle
          animatedProps={animatedDotProps}
          r={strokeWidth / 2}
          fill="#FFFFFF"
          stroke="url(#progressGradient)"
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
