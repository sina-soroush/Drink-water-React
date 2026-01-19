import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// History Screen - Shows past 7 days of water intake
// Will be built in Step 7
export default function HistoryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History Screen</Text>
      <Text style={styles.subtitle}>Last 7 days will appear here</Text>
      
      {/* Navigation test button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
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
