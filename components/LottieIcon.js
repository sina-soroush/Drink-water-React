import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

/**
 * LottieIcon Component
 * A reusable component for displaying animated Lottie icons
 * 
 * @param {string} source - Path to Lottie JSON file or require()
 * @param {number} size - Size of the icon (width and height)
 * @param {boolean} autoPlay - Whether to play animation automatically
 * @param {boolean} loop - Whether to loop the animation
 * @param {number} speed - Animation playback speed (default: 1)
 * @param {string} color - Color to apply (if supported by Lottie)
 * @param {object} style - Additional styles
 */
export default function LottieIcon({ 
  source, 
  size = 32, 
  autoPlay = true, 
  loop = true, 
  speed = 1,
  style 
}) {
  const animationRef = useRef(null);

  useEffect(() => {
    if (autoPlay && animationRef.current) {
      animationRef.current.play();
    }
  }, [autoPlay]);

  // Support both local files and URLs from LottieFiles
  const animationSource = typeof source === 'string' && source.startsWith('http') 
    ? { uri: source }
    : source;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <LottieView
        ref={animationRef}
        source={animationSource}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={[styles.animation, { width: size, height: size }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
