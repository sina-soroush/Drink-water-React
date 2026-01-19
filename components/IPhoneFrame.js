import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function IPhoneFrame({ children }) {
  // Only show frame on web
  if (Platform.OS !== 'web') {
    return children;
  }

  // iPhone 15 Pro dimensions (scaled to fit screen)
  const iPhoneAspectRatio = 19.5 / 9; // iPhone 15 Pro ratio
  const maxWidth = Math.min(430, screenWidth * 0.95);
  const maxHeight = screenHeight * 0.95;
  
  let frameWidth = maxWidth;
  let frameHeight = frameWidth * iPhoneAspectRatio;
  
  // If height is too tall, scale based on height
  if (frameHeight > maxHeight) {
    frameHeight = maxHeight;
    frameWidth = frameHeight / iPhoneAspectRatio;
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#0A0E27', '#1A1F3A', '#2A3F5F']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* iPhone Frame */}
      <View style={[styles.iPhoneFrame, { width: frameWidth, height: frameHeight }]}>
        {/* Device Border with Metallic Effect */}
        <View style={styles.deviceBorder}>
          {/* Screen Area */}
          <View style={styles.screenContainer}>
            {/* App Content */}
            <View style={styles.appContent}>
              {children}
            </View>
          </View>
        </View>

        {/* Side Buttons */}
        <View style={[styles.sideButton, styles.powerButton]} />
        <View style={[styles.sideButton, styles.volumeUp]} />
        <View style={[styles.sideButton, styles.volumeDown]} />
        <View style={[styles.sideButton, styles.muteSwitch]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
  },
  iPhoneFrame: {
    position: 'relative',
    borderRadius: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 30,
  },
  deviceBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    borderWidth: 12,
    borderColor: '#1A1D2E',
    backgroundColor: '#000',
    overflow: 'hidden',
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 43,
    overflow: 'hidden',
  },

  appContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Side Buttons
  sideButton: {
    position: 'absolute',
    backgroundColor: '#1A1D2E',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  powerButton: {
    right: -8,
    top: '35%',
    width: 8,
    height: 100,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  volumeUp: {
    left: -8,
    top: '25%',
    width: 8,
    height: 60,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  volumeDown: {
    left: -8,
    top: '38%',
    width: 8,
    height: 60,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  muteSwitch: {
    left: -8,
    top: '15%',
    width: 8,
    height: 35,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

});
