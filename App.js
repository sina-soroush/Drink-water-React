import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Main App Component
// This will be replaced with navigation in Step 2
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drink Water</Text>
      <Text style={styles.subtitle}>iOS App Setup Complete ✓</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS system background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34, // iOS Large Title size
    fontWeight: '700', // iOS bold weight
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17, // iOS body text size
    color: '#8E8E93', // iOS secondary label color
  },
});
