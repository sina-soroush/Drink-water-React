import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './contexts/ThemeContext';
import IPhoneFrame from './components/IPhoneFrame';

// Import screens
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';

// Create Stack Navigator
const Stack = createNativeStackNavigator();

// Navigation Component with Glassmorphism
function AppNavigation() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          // iOS 26 optimized navigation with glass effect
          headerTransparent: Platform.OS === 'ios',
          headerBlurEffect: 'systemUltraThinMaterial',
          headerLargeTitle: true,
          headerLargeStyle: {
            backgroundColor: 'transparent',
          },
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: '#007AFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
          },
          headerLargeTitleStyle: {
            fontWeight: '700',
            fontSize: 34,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: '💧 Hydration',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ 
            title: '📊 History',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ 
            title: '⚙️ Settings',
            headerLargeTitle: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App Component wrapped with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <IPhoneFrame>
        <AppNavigation />
      </IPhoneFrame>
    </ThemeProvider>
  );
}
