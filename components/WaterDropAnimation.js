import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Water Drop Animation - Enhanced Glassmorphism Style
const WaterDropAnimation = React.forwardRef((props, ref) => {
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  
  // Expose playAnimation method to parent
  React.useImperativeHandle(ref, () => ({
    playAnimation: () => {
      // Reset values
      translateY.setValue(-150);
      opacity.setValue(0);
      scale.setValue(0.3);
      rotate.setValue(0);
      rippleScale.setValue(0);
      rippleOpacity.setValue(0);
      
      // Animate drop with bounce and splash effect
      Animated.parallel([
        // Drop animation
        Animated.timing(translateY, {
          toValue: 0,
          duration: 900,
          easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
          useNativeDriver: true,
        }),
        // Opacity fade in/out
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.delay(450),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Scale with bounce
        Animated.sequence([
          Animated.spring(scale, {
            toValue: 1.2,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
        // Rotation effect
        Animated.timing(rotate, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // Ripple effect on impact
        Animated.sequence([
          Animated.delay(700),
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 2,
              duration: 400,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(rippleOpacity, {
                toValue: 0.6,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(rippleOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      ]).start();
    },
    reset: () => {
      translateY.setValue(-150);
      opacity.setValue(0);
      scale.setValue(0.3);
      rotate.setValue(0);
      rippleScale.setValue(0);
      rippleOpacity.setValue(0);
    }
  }));
  
  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Ripple effect */}
      <Animated.View
        style={[
          styles.ripple,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          }
        ]}
      >
        <BlurView intensity={40} tint="light" style={styles.rippleBlur}>
          <LinearGradient
            colors={['rgba(0,122,255,0.3)', 'rgba(0,199,190,0.3)']}
            style={styles.rippleGradient}
          />
        </BlurView>
      </Animated.View>
      
      {/* Water droplet */}
      <Animated.View
        style={[
          styles.droplet,
          {
            transform: [
              { translateY }, 
              { scale },
              { rotate: rotateInterpolate }
            ],
            opacity,
          }
        ]}
      >
        <BlurView intensity={60} tint="light" style={styles.dropletBlur}>
          <LinearGradient
            colors={['rgba(0,122,255,0.8)', 'rgba(0,199,190,0.9)', 'rgba(52,199,89,0.8)']}
            style={styles.dropletGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Glass highlight */}
            <View style={styles.highlight} />
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  droplet: {
    width: 100,
    height: 100,
  },
  dropletBlur: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  dropletGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 12,
  },
  highlight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  rippleBlur: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    overflow: 'hidden',
  },
  rippleGradient: {
    width: '100%',
    height: '100%',
  },
});

export default WaterDropAnimation;
