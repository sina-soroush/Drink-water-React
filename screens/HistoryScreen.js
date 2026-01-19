import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../contexts/ThemeContext';
import { loadHistory, formatDate } from '../utils/storage';

// History Screen - Shows past 7 days with Glassmorphism
export default function HistoryScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load history on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistoryData();
    });
    
    return unsubscribe;
  }, [navigation]);
  
  // Load history from storage
  const loadHistoryData = async () => {
    const data = await loadHistory();
    setHistory(data);
  };
  
  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistoryData();
    setRefreshing(false);
  };
  
  // Render each history item with Glass Effect
  const renderItem = ({ item, index }) => {
    const isGoalMet = item.glasses >= 8;
    const progress = (item.glasses / 8) * 100;
    
    return (
      <BlurView 
        intensity={isDark ? 60 : 80} 
        tint={isDark ? 'dark' : 'light'} 
        style={styles.historyGlassCard}
      >
        <View style={[styles.glassCardBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]}>
          
          <View style={styles.itemHeader}>
            <View style={styles.itemLeft}>
              <View style={[
                styles.iconGlass,
                { 
                  backgroundColor: isGoalMet 
                    ? (isDark ? 'rgba(52,199,89,0.2)' : 'rgba(52,199,89,0.15)') 
                    : (isDark ? 'rgba(0,122,255,0.2)' : 'rgba(0,122,255,0.15)')
                }
              ]}>
                <Ionicons 
                  name={isGoalMet ? "checkmark-circle" : "water"} 
                  size={28} 
                  color={isGoalMet ? (isDark ? '#30D158' : '#34C759') : (isDark ? '#0A84FF' : '#007AFF')}
                />
              </View>
              <View>
                <Text style={[styles.itemDate, { color: isDark ? '#FFF' : '#003D5B' }]}>
                  {formatDate(item.date)}
                </Text>
                <Text style={[styles.itemMl, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,61,91,0.6)' }]}>
                  {item.glasses * 250}ml
                </Text>
              </View>
            </View>
            
            <View style={styles.itemRight}>
              <Text style={[styles.itemGlasses, { color: isDark ? '#FFF' : '#003D5B' }]}>
                {item.glasses}
              </Text>
              <Text style={[styles.itemGoal, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,61,91,0.5)' }]}>
                / 8 glasses
              </Text>
            </View>
          </View>
          
          {/* Progress bar with gradient */}
          <View style={styles.progressContainer}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(52,199,89,0.3)', 'rgba(52,199,89,0.5)']
                : ['rgba(0,122,255,0.3)', 'rgba(0,122,255,0.5)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBar,
                { 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: isGoalMet 
                    ? (isDark ? 'rgba(52,199,89,0.4)' : 'rgba(52,199,89,0.3)')
                    : (isDark ? 'rgba(0,122,255,0.4)' : 'rgba(0,122,255,0.3)')
                }
              ]}
            />
          </View>
          
        </View>
      </BlurView>
    );
  };
  
  // Empty state with Glass Effect
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <BlurView intensity={isDark ? 60 : 80} tint={isDark ? 'dark' : 'light'} style={styles.emptyGlassCard}>
        <View style={[styles.glassCardBorder, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)' }]}>
          <Ionicons 
            name="bar-chart-outline" 
            size={64} 
            color={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,61,91,0.4)'} 
          />
          <Text style={[styles.emptyTitle, { color: isDark ? '#FFF' : '#003D5B' }]}>
            No History Yet
          </Text>
          <Text style={[styles.emptyText, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,61,91,0.6)' }]}>
            Your past 7 days of water intake will appear here
          </Text>
        </View>
      </BlurView>
    </View>
  );
  
  return (
    <LinearGradient
      colors={isDark 
        ? ['#0A0E27', '#1A1F3A', '#2B3A67', '#3B5998'] 
        : ['#4FACFE', '#00F2FE', '#43E8E1', '#00D9FF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        contentContainerStyle={[
          styles.listContent,
          history.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#0A84FF' : '#007AFF'}
          />
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Glass Card
  historyGlassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glassCardBorder: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
  },
  
  // History Item
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconGlass: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemDate: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  itemMl: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemGlasses: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  itemGoal: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Progress Bar
  progressContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(142,142,147,0.2)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyGlassCard: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
