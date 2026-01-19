import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  WATER_INTAKE: '@waterIntake',
  DAILY_GOAL: '@dailyGoal',
  LAST_DATE: '@lastDate',
  HISTORY: '@history',
};

// Get today's date as string (YYYY-MM-DD)
export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Format date for display (e.g., "Jan 19, 2026")
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Save water intake
export const saveWaterIntake = async (intake) => {
  try {
    await AsyncStorage.setItem(KEYS.WATER_INTAKE, intake.toString());
    await AsyncStorage.setItem(KEYS.LAST_DATE, getTodayString());
  } catch (error) {
    console.error('Error saving water intake:', error);
  }
};

// Load water intake
export const loadWaterIntake = async () => {
  try {
    const intake = await AsyncStorage.getItem(KEYS.WATER_INTAKE);
    return intake ? parseInt(intake, 10) : 0;
  } catch (error) {
    console.error('Error loading water intake:', error);
    return 0;
  }
};

// Save daily goal
export const saveDailyGoal = async (goal) => {
  try {
    await AsyncStorage.setItem(KEYS.DAILY_GOAL, goal.toString());
  } catch (error) {
    console.error('Error saving daily goal:', error);
  }
};

// Load daily goal
export const loadDailyGoal = async () => {
  try {
    const goal = await AsyncStorage.getItem(KEYS.DAILY_GOAL);
    return goal ? parseInt(goal, 10) : 8;
  } catch (error) {
    console.error('Error loading daily goal:', error);
    return 8;
  }
};

// Get last saved date
export const getLastDate = async () => {
  try {
    const date = await AsyncStorage.getItem(KEYS.LAST_DATE);
    return date || getTodayString();
  } catch (error) {
    console.error('Error loading last date:', error);
    return getTodayString();
  }
};

// Save to history
export const saveToHistory = async (date, glasses) => {
  try {
    const historyJson = await AsyncStorage.getItem(KEYS.HISTORY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    // Add new entry
    history.unshift({ date, glasses });
    
    // Keep only last 7 days
    const limitedHistory = history.slice(0, 7);
    
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

// Load history
export const loadHistory = async () => {
  try {
    const historyJson = await AsyncStorage.getItem(KEYS.HISTORY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

// Check if date has changed and reset if needed
export const checkAndResetIfNewDay = async (currentIntake) => {
  try {
    const lastDate = await getLastDate();
    const today = getTodayString();
    
    if (lastDate !== today) {
      // New day detected - save yesterday's data to history
      if (currentIntake > 0) {
        await saveToHistory(lastDate, currentIntake);
      }
      
      // Reset intake for new day
      await saveWaterIntake(0);
      return true; // Indicates reset occurred
    }
    
    return false; // No reset needed
  } catch (error) {
    console.error('Error checking date:', error);
    return false;
  }
};
