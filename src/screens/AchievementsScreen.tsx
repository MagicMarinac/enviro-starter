import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from '../components/UI/Card';
import { useLanguage } from '../hooks/useLanguage';
import apiClient from '../utils/api';
import { Achievement, UserAchievement } from '../types/schema';

const AchievementsScreen = () => {
  const { getText, language } = useLanguage();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [achievementsData, userAchievementsData, statsData] = await Promise.all([
        apiClient.getAchievements(),
        apiClient.getUserAchievements('demo-user'),
        apiClient.getUserStats('demo-user')
      ]);
      setAchievements(achievementsData);
      setUserAchievements(userAchievementsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading achievements data:', error);
    }
  };

  const isAchievementUnlocked = (achievementId: string): boolean => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  };

  const getAchievementProgress = (achievement: Achievement): number => {
    if (!stats) return 0;

    switch (achievement.criteria.type) {
      case 'treasures_found':
        const target = achievement.criteria.target || 1;
        return Math.min((stats.treasuresFound / target) * 100, 100);
      
      case 'total_score':
        const scoreTarget = achievement.criteria.target || 500;
        return Math.min((stats.totalScore / scoreTarget) * 100, 100);
      
      case 'quiz_perfect':
        // This would need to be tracked separately in a real app
        return isAchievementUnlocked(achievement.id) ? 100 : 0;
      
      case 'first_discovery':
        return stats.treasuresFound > 0 ? 100 : 0;
      
      default:
        return 0;
    }
  };

  const getProgressText = (achievement: Achievement): string => {
    const progress = getAchievementProgress(achievement);
    const isUnlocked = isAchievementUnlocked(achievement.id);
    
    if (isUnlocked) {
      return language === 'hr' ? '✅ Ostvareno' : language === 'sl' ? '✅ Doseženo' : '✅ Unlocked';
    }
    
    switch (achievement.criteria.type) {
      case 'treasures_found':
        const target = achievement.criteria.target || 1;
        return `${stats?.treasuresFound || 0}/${target} ${language === 'hr' ? 'blaga' : language === 'sl' ? 'zakladov' : 'treasures'}`;
      
      case 'total_score':
        const scoreTarget = achievement.criteria.target || 500;
        return `${stats?.totalScore || 0}/${scoreTarget} ${language === 'hr' ? 'bodova' : language === 'sl' ? 'točk' : 'points'}`;
      
      case 'quiz_perfect':
        return language === 'hr' ? 'Riješite kviz savršeno' : language === 'sl' ? 'Rešite kviz popolno' : 'Complete quiz perfectly';
      
      default:
        return `${Math.round(progress)}%`;
    }
  };

  const getAchievementDescription = (achievement: Achievement): string => {
    const progress = getAchievementProgress(achievement);
    const isUnlocked = isAchievementUnlocked(achievement.id);

    if (isUnlocked) {
      return language === 'hr' ? 'Ostvareno!' : language === 'sl' ? 'Doseženo!' : 'Completed!';
    }

    switch (achievement.criteria.type) {
      case 'treasures_found':
        const target = achievement.criteria.target || 1;
        const current = stats?.treasuresFound || 0;
        return `${current}/${target}`;
      
      case 'total_score':
        const scoreTarget = achievement.criteria.target || 500;
        const currentScore = stats?.totalScore || 0;
        return `${currentScore}/${scoreTarget}`;
      
      case 'quiz_perfect':
        return language === 'hr' 
          ? 'Riješite kviz savršeno' 
          : language === 'sl' 
          ? 'Rešite kviz popolno'
          : 'Complete quiz perfectly';
      
      case 'first_discovery':
        return language === 'hr' 
          ? 'Otkrijte prvo blago' 
          : language === 'sl' 
          ? 'Odkrijte prvi zaklad'
          : 'Discover first treasure';
      
      default:
        return `${Math.round(progress)}%`;
    }
  };

  const getIconName = (iconName: string): string => {
    // Map our icon names to Material Icons
    const iconMap: { [key: string]: string } = {
      'location-on': 'location-on',
      'star': 'star',
      'school': 'school',
      'quiz': 'help',
    };
    return iconMap[iconName] || 'emoji-events';
  };

  const unlockedAchievements = achievements.filter(a => isAchievementUnlocked(a.id));
  const lockedAchievements = achievements.filter(a => !isAchievementUnlocked(a.id));

  const totalPoints = unlockedAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
  const maxPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);

  const renderAchievementCard = ({ item: achievement }: { item: Achievement }) => {
    const isUnlocked = isAchievementUnlocked(achievement.id);
    const progress = getAchievementProgress(achievement);
    const progressDescription = getAchievementDescription(achievement);

    return (
      <Card style={[styles.achievementCard, isUnlocked && styles.unlockedCard]}>
        <View style={styles.achievementHeader}>
          <View style={[styles.achievementIcon, isUnlocked && styles.unlockedIcon]}>
            <MaterialIcons 
              name={getIconName(achievement.iconName)} 
              size={24} 
              color={isUnlocked ? '#8B4513' : '#A0A0A0'} 
            />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementName, !isUnlocked && styles.lockedText]}>
              {getText(achievement.name)}
            </Text>
            <Text style={[styles.achievementDescription, !isUnlocked && styles.lockedText]}>
              {getText(achievement.description)}
            </Text>
          </View>
          <View style={styles.achievementPoints}>
            <MaterialIcons name="star" size={16} color={isUnlocked ? '#FFD700' : '#A0A0A0'} />
            <Text style={[styles.pointsText, !isUnlocked && styles.lockedText]}>
              {achievement.points}
            </Text>
          </View>
        </View>

        {!isUnlocked && progress < 100 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progressDescription}</Text>
          </View>
        )}

        {isUnlocked && (
          <View style={styles.unlockedBadge}>
            <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.unlockedText}>
              {language === 'hr' ? 'Ostvareno' : language === 'sl' ? 'Doseženo' : 'Unlocked'}
            </Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'hr' ? 'Postignuća' : language === 'sl' ? 'Dosežki' : 'Achievements'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'hr' 
              ? 'Vaša putovanja i uspjesi' 
              : language === 'sl' 
              ? 'Vaša potovanja in uspehi'
              : 'Your journeys and successes'}
          </Text>
        </View>

        {/* Progress Overview */}
        <Card style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <MaterialIcons name="emoji-events" size={32} color="#8B4513" />
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewTitle}>
                {language === 'hr' ? 'Ukupni napredak' : language === 'sl' ? 'Skupni napredek' : 'Overall progress'}
              </Text>
              <Text style={styles.overviewStats}>
                {unlockedAchievements.length}/{achievements.length} {' '}
                {language === 'hr' ? 'ostvareno' : language === 'sl' ? 'doseženo' : 'unlocked'}
              </Text>
            </View>
          </View>
          
          <View style={styles.pointsContainer}>
            <View style={styles.pointsRow}>
              <MaterialIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.pointsText}>
                {totalPoints}/{maxPoints} {' '}
                {language === 'hr' ? 'bodova' : language === 'sl' ? 'točk' : 'points'}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${(totalPoints / maxPoints) * 100}%` }]} />
            </View>
          </View>
        </Card>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'hr' ? 'Ostvarena postignuća' : language === 'sl' ? 'Doseženi dosežki' : 'Unlocked achievements'}
            </Text>
            <FlatList
              data={unlockedAchievements}
              renderItem={renderAchievementCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'hr' ? 'Dostupna postignuća' : language === 'sl' ? 'Dosegljivi dosežki' : 'Available achievements'}
            </Text>
            <FlatList
              data={lockedAchievements}
              renderItem={renderAchievementCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialIcons name="lightbulb" size={24} color="#FF9800" />
            <Text style={styles.tipsTitle}>
              {language === 'hr' ? 'Savjeti' : language === 'sl' ? 'Nasveti' : 'Tips'}
            </Text>
          </View>
          <Text style={styles.tipsText}>
            {language === 'hr' 
              ? 'Otkrijte sva blaga i riješite kvizove da ostvarite sva postignuća!'
              : language === 'sl'
              ? 'Odkrijte vse zaklade in rešite kvize, da dosežete vse dosežke!'
              : 'Discover all treasures and complete quizzes to unlock all achievements!'}
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0522D',
    textAlign: 'center',
  },
  overviewCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#F5E6D3',
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewInfo: {
    flex: 1,
    marginLeft: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  overviewStats: {
    fontSize: 14,
    color: '#A0522D',
    marginTop: 4,
  },
  pointsContainer: {
    marginTop: 8,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },
  achievementCard: {
    marginBottom: 12,
  },
  unlockedCard: {
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unlockedIcon: {
    backgroundColor: '#E8F5E8',
  },
  achievementInfo: {
    flex: 1,
    marginRight: 12,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#A0522D',
    lineHeight: 20,
  },
  lockedText: {
    color: '#A0A0A0',
  },
  achievementPoints: {
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 12,
    paddingLeft: 60,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FF9800',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'right',
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 60,
  },
  unlockedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: '#FFF8E1',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#F57C00',
    lineHeight: 20,
  },
});

export default AchievementsScreen;