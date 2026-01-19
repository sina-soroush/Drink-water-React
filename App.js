import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';

// Create Stack Navigator
const Stack = createNativeStackNavigator();

// Main App Component with Navigation
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          // iOS-native navigation styling
          headerStyle: {
            backgroundColor: '#F2F2F7', // iOS background
          },
          headerTintColor: '#007AFF', // iOS blue for back button
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17, // iOS navigation title size
          },
          headerLargeTitleStyle: {
            fontWeight: '700',
            fontSize: 34, // iOS large title
          },
          headerLargeTitle: true, // Enable iOS large titles
          headerTransparent: false,
          headerBlurEffect: 'systemChromeMaterial', // iOS blur effect
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'Drink Water',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ 
            title: 'History',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            title: 'Settings',
            headerLargeTitle: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
