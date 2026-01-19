import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [themeMode, setThemeMode] = useState('auto'); // 'light', 'dark', 'auto'
  
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  useEffect(() => {
    if (themeMode === 'auto') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, themeMode]);
  
  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('@themeMode');
      if (saved) {
        setThemeMode(saved);
        if (saved !== 'auto') {
          setIsDark(saved === 'dark');
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };
  
  const toggleTheme = async () => {
    const newMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'auto' : 'light';
    setThemeMode(newMode);
    
    if (newMode === 'light') {
      setIsDark(false);
    } else if (newMode === 'dark') {
      setIsDark(true);
    } else {
      setIsDark(systemColorScheme === 'dark');
    }
    
    await AsyncStorage.setItem('@themeMode', newMode);
  };
  
  // Enhanced Glassmorphism color scheme
  const colors = isDark ? {
    // Dark mode colors - Deep space theme
    background: '#0A0E27',
    backgroundGradient: ['#0A0E27', '#1A1F3A', '#2B3A67', '#3B5998'],
    card: 'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(255,255,255,0.1)',
    glass: 'rgba(255,255,255,0.08)',
    glassHighlight: 'rgba(255,255,255,0.15)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.6)',
    textTertiary: 'rgba(255,255,255,0.4)',
    border: 'rgba(255,255,255,0.15)',
    primary: '#0A84FF',
    primaryGradient: ['#0A84FF', '#0066CC'],
    secondary: '#00C7BE',
    success: '#30D158',
    successGradient: ['#30D158', '#34C759'],
    warning: '#FF9F0A',
    error: '#FF6961',
    progressTrack: 'rgba(255,255,255,0.15)',
    shadow: 'rgba(0,0,0,0.5)',
  } : {
    // Light mode colors - Ocean theme
    background: '#4FACFE',
    backgroundGradient: ['#4FACFE', '#00F2FE', '#43E8E1', '#00D9FF'],
    card: 'rgba(255,255,255,0.25)',
    cardBorder: 'rgba(255,255,255,0.3)',
    glass: 'rgba(255,255,255,0.2)',
    glassHighlight: 'rgba(255,255,255,0.4)',
    text: '#003D5B',
    textSecondary: 'rgba(0,61,91,0.7)',
    textTertiary: 'rgba(0,61,91,0.5)',
    border: 'rgba(255,255,255,0.3)',
    primary: '#007AFF',
    primaryGradient: ['#007AFF', '#0051D5'],
    secondary: '#00C7BE',
    success: '#34C759',
    successGradient: ['#34C759', '#30D158'],
    warning: '#FF9500',
    error: '#FF3B30',
    progressTrack: 'rgba(255,255,255,0.2)',
    shadow: 'rgba(0,0,0,0.3)',
  };
  
  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
