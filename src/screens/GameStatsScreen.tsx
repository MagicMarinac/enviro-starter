import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';

import { Card } from '../components/UI/Card';
import { useLanguage } from '../hooks/useLanguage';
import apiClient from '../utils/api';
import { Achievement, UserTreasure, UserStats, GameStats } from '../types/schema';

const { width } = Dimensions.get('window');

const GameStatsScreen = () => {
  const { getText, language } = useLanguage();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [userTreasures, setUserTreasures] = useState<UserTreasure[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameStats();
  }, []);

  // Refresh data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadGameStats();
    }, [])
  );

  const loadGameStats = async () => {
    try {
      setLoading(true);
      console.log('GameStats: Loading fresh data...');
      const [statsData, treasuresData, achievementsData] = await Promise.all([
        apiClient.getUserStats('demo-user'),
        apiClient.getUserTreasures('demo-user'),
        apiClient.getAchievements()
      ]);
      
      console.log('GameStats: Fresh treasures data:', treasuresData);
      setUserStats(statsData);
      setUserTreasures(treasuresData);
      setAchievements(achievementsData);
      
      // Calculate enhanced game stats
      const totalScore = treasuresData.reduce((sum, treasure) => sum + treasure.score, 0);
      const level = Math.floor(totalScore / 100) + 1;
      const experience = totalScore % 100;
      const experienceToNext = 100 - experience;
      const completedQuizzes = treasuresData.filter(t => t.quizCompleted).length;
      const perfectQuizzes = treasuresData.filter(t => t.quizCompleted && (t.quizScore === 100)).length;
      
      setGameStats({
        treasuresFound: treasuresData.length,
        totalScore,
        level,
        experience,
        experienceToNext,
        completedQuizzes,
        perfectQuizzes,
        achievements: [], // This would come from user achievements API
      });
      
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (): number => {
    if (!gameStats) return 0;
    return (gameStats.experience / 100) * 100;
  };

  const getAchievementIcon = (iconName: string): string => {
    const iconMap: { [key: string]: string } = {
      'location-on': 'location-on',
      'star': 'star',
      'school': 'school',
      'quiz': 'help',
      'trophy': 'emoji-events'
    };
    return iconMap[iconName] || 'star';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <MaterialIcons name="analytics" size={60} color="#8B4513" />
          <Text style={styles.loadingText}>
            {language === 'hr' ? 'Učitavanje statistika...' : language === 'sl' ? 'Nalaganje statistik...' : 'Loading stats...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'hr' ? 'Vaše statistike' : language === 'sl' ? 'Vaše statistike' : 'Your Statistics'}
          </Text>
        </View>

        {/* Level and Progress */}
        {gameStats && (
          <Animatable.View animation="bounceInLeft" duration={800}>
            <Card style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelNumber}>{gameStats.level}</Text>
                </View>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>
                    {language === 'hr' ? 'Razina istraživača' : language === 'sl' ? 'Raven raziskovalca' : 'Explorer Level'}
                  </Text>
                  <Text style={styles.levelSubtitle}>
                    {gameStats.experienceToNext} XP {language === 'hr' ? 'do sljedeće razine' : language === 'sl' ? 'do naslednje ravni' : 'to next level'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animatable.View 
                    animation="slideInLeft" 
                    duration={1200}
                    style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {gameStats.experience}/100 XP
                </Text>
              </View>
            </Card>
          </Animatable.View>
        )}

        {/* Game Statistics */}
        <Animatable.View animation="bounceInRight" duration={800} delay={200}>
          <Card style={styles.statsCard}>
            <Text style={styles.cardTitle}>
              {language === 'hr' ? 'Statistike igre' : language === 'sl' ? 'Statistike igre' : 'Game Statistics'}
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialIcons name="star" size={30} color="#FFD700" />
                <Text style={styles.statNumber}>{gameStats?.totalScore || 0}</Text>
                <Text style={styles.statLabel}>
                  {language === 'hr' ? 'Bodovi' : language === 'sl' ? 'Točke' : 'Points'}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialIcons name="explore" size={30} color="#4CAF50" />
                <Text style={styles.statNumber}>{gameStats?.treasuresFound || 0}</Text>
                <Text style={styles.statLabel}>
                  {language === 'hr' ? 'Blaga' : language === 'sl' ? 'Zakladi' : 'Treasures'}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialIcons name="help" size={30} color="#2196F3" />
                <Text style={styles.statNumber}>{gameStats?.completedQuizzes || 0}</Text>
                <Text style={styles.statLabel}>
                  {language === 'hr' ? 'Kvizovi' : language === 'sl' ? 'Kvizi' : 'Quizzes'}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialIcons name="emoji-events" size={30} color="#FF9800" />
                <Text style={styles.statNumber}>{gameStats?.perfectQuizzes || 0}</Text>
                <Text style={styles.statLabel}>
                  {language === 'hr' ? 'Savršeno' : language === 'sl' ? 'Popolno' : 'Perfect'}
                </Text>
              </View>
            </View>
          </Card>
        </Animatable.View>

        {/* Achievements */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Card style={styles.achievementsCard}>
            <Text style={styles.cardTitle}>
              {language === 'hr' ? 'Dostignuća' : language === 'sl' ? 'Dosežki' : 'Achievements'}
            </Text>
            
            {achievements.slice(0, 4).map((achievement, index) => {
              const isUnlocked = false; // This would check if user has this achievement
              
              return (
                <View key={achievement.id} style={styles.achievementItem}>
                  <View style={[styles.achievementIcon, { opacity: isUnlocked ? 1 : 0.5 }]}>
                    <MaterialIcons 
                      name={getAchievementIcon(achievement.iconName)} 
                      size={24} 
                      color={isUnlocked ? "#8B4513" : "#ccc"} 
                    />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[styles.achievementName, { color: isUnlocked ? "#8B4513" : "#ccc" }]}>
                      {getText(achievement.name)}
                    </Text>
                    <Text style={[styles.achievementDescription, { color: isUnlocked ? "#666" : "#ccc" }]}>
                      {getText(achievement.description)}
                    </Text>
                    <Text style={styles.achievementPoints}>
                      ⭐ {achievement.points} {language === 'hr' ? 'bodova' : language === 'sl' ? 'točk' : 'points'}
                    </Text>
                  </View>
                  {isUnlocked && (
                    <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                  )}
                </View>
              );
            })}
          </Card>
        </Animatable.View>

        {/* Recent Activity */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Card style={styles.activityCard}>
            <Text style={styles.cardTitle}>
              {language === 'hr' ? 'Nedavna aktivnost' : language === 'sl' ? 'Nedavna aktivnost' : 'Recent Activity'}
            </Text>
            
            {userTreasures.slice(0, 3).map((treasure, index) => (
              <View key={treasure.id} style={styles.activityItem}>
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.activityText}>
                  {language === 'hr' ? 'Otkriveno blago' : language === 'sl' ? 'Odkrit zaklad' : 'Discovered treasure'} (+{treasure.score} {language === 'hr' ? 'bodova' : language === 'sl' ? 'točk' : 'pts'})
                </Text>
              </View>
            ))}
            
            {userTreasures.length === 0 && (
              <Text style={styles.noActivityText}>
                {language === 'hr' ? 'Još nema aktivnosti' : language === 'sl' ? 'Še ni aktivnosti' : 'No activity yet'}
              </Text>
            )}
          </Card>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  levelCard: {
    margin: 16,
    marginTop: 8,
    padding: 20,
    backgroundColor: '#F5F5DC',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  levelSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B4513',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  statsCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 64) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  achievementsCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    marginBottom: 2,
  },
  achievementPoints: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '600',
  },
  activityCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 30,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  noActivityText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default GameStatsScreen;