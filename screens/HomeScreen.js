import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Home Screen - Main water tracking screen
// This will be built out in Step 3 with full UI
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Water tracking UI coming in Step 3</Text>
      
      {/* Navigation test buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>Go to History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS system background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34, // iOS Large Title
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17, // iOS Body
    color: '#8E8E93', // iOS secondary label
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF', // iOS blue
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
