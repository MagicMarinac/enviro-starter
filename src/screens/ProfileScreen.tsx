import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useLanguage } from '../hooks/useLanguage';
import apiClient from '../utils/api';

const ProfileScreen = () => {
  const { getText, language, changeLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [userTreasures, setUserTreasures] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      console.log('Profile: Loading fresh data...');
      const [userData, statsData, treasuresData, achievementsData] = await Promise.all([
        apiClient.getUser('demo-user'),
        apiClient.getUserStats('demo-user'),
        apiClient.getUserTreasures('demo-user'),
        apiClient.getUserAchievements('demo-user')
      ]);
      console.log('Profile: Fresh stats data:', statsData);
      console.log('Profile: Fresh treasures data:', treasuresData);
      
      // Calculate totalScore from treasures like GameStats does
      const calculatedScore = treasuresData.reduce((sum, treasure) => sum + treasure.score, 0);
      console.log('Profile: Calculated score from treasures:', calculatedScore);
      
      // Use calculated score instead of potentially stale stats
      const updatedStats = {
        ...statsData,
        totalScore: calculatedScore,
        treasuresFound: treasuresData.length
      };
      
      setUser(userData);
      setStats(updatedStats);
      setUserTreasures(treasuresData);
      setUserAchievements(achievementsData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const languages = [
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
    { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.flag} ${lang.name}` : code;
  };

  const getCompletionPercentage = (): number => {
    // Assuming 5 total treasures
    const totalTreasures = 5;
    return Math.round((stats?.treasuresFound || 0) / totalTreasures * 100);
  };

  const getPlayerLevel = (): number => {
    const score = stats?.totalScore || 0;
    return Math.floor(score / 100) + 1;
  };

  const getNextLevelProgress = (): number => {
    const score = stats?.totalScore || 0;
    const currentLevelScore = (getPlayerLevel() - 1) * 100;
    const nextLevelScore = getPlayerLevel() * 100;
    return ((score - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={60} color="#8B4513" />
          </View>
          <Text style={styles.username}>{user?.username || 'Istraživač'}</Text>
          <Text style={styles.joinDate}>
            {language === 'hr' ? 'Član od' : language === 'sl' ? 'Član od' : 'Member since'} {' '}
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024'}
          </Text>
        </View>

        {/* Stats Overview */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>
            {language === 'hr' ? 'Statistike' : language === 'sl' ? 'Statistike' : 'Statistics'}
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.statNumber}>{stats?.treasuresFound || 0}</Text>
              <Text style={styles.statLabel}>
                {language === 'hr' ? 'Blaga' : language === 'sl' ? 'Zakladi' : 'Treasures'}
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="emoji-events" size={24} color="#8B4513" />
              <Text style={styles.statNumber}>{stats?.totalScore || 0}</Text>
              <Text style={styles.statLabel}>
                {language === 'hr' ? 'Bodovi' : language === 'sl' ? 'Točke' : 'Points'}
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="military-tech" size={24} color="#9C27B0" />
              <Text style={styles.statNumber}>{stats?.achievementsUnlocked || 0}</Text>
              <Text style={styles.statLabel}>
                {language === 'hr' ? 'Postignuća' : language === 'sl' ? 'Dosežki' : 'Achievements'}
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>{getPlayerLevel()}</Text>
              <Text style={styles.statLabel}>
                {language === 'hr' ? 'Razina' : language === 'sl' ? 'Stopnja' : 'Level'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Progress */}
        <Card style={styles.progressCard}>
          <Text style={styles.sectionTitle}>
            {language === 'hr' ? 'Napredak' : language === 'sl' ? 'Napredek' : 'Progress'}
          </Text>
          
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>
              {language === 'hr' ? 'Završenost igre' : language === 'sl' ? 'Dokončanost igre' : 'Game completion'}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${getCompletionPercentage()}%` }]} />
            </View>
            <Text style={styles.progressText}>{getCompletionPercentage()}%</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>
              {language === 'hr' ? 'Sljedeća razina' : language === 'sl' ? 'Naslednja stopnja' : 'Next level'}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${getNextLevelProgress()}%`, backgroundColor: '#4CAF50' }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(getNextLevelProgress())}%</Text>
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Text style={styles.sectionTitle}>
            {language === 'hr' ? 'Nedavna aktivnost' : language === 'sl' ? 'Nedavna aktivnost' : 'Recent activity'}
          </Text>
          
          {userTreasures.length > 0 ? (
            userTreasures.slice(0, 3).map((treasure, index) => (
              <View key={treasure.id} style={styles.activityItem}>
                <MaterialIcons name="location-on" size={20} color="#4CAF50" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    {language === 'hr' ? 'Otkriveno blago' : language === 'sl' ? 'Odkrit zaklad' : 'Discovered treasure'}
                  </Text>
                  <Text style={styles.activityDate}>
                    {new Date(treasure.discoveredAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.activityScore}>+{treasure.score}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noActivityContainer}>
              <MaterialIcons name="explore" size={32} color="#A0522D" />
              <Text style={styles.noActivityText}>
                {language === 'hr' 
                  ? 'Počnite s lovom na blago!' 
                  : language === 'sl' 
                  ? 'Začnite z lovom na zaklade!'
                  : 'Start treasure hunting!'}
              </Text>
            </View>
          )}
        </Card>

        {/* Language Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>
            {language === 'hr' ? 'Jezik' : language === 'sl' ? 'Jezik' : 'Language'}
          </Text>
          
          <View style={styles.languageList}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  language === lang.code && styles.languageItemSelected
                ]}
                onPress={() => changeLanguage(lang.code as any)}
              >
                <Text style={styles.languageText}>
                  {lang.flag} {lang.name}
                </Text>
                {language === lang.code && (
                  <MaterialIcons name="check" size={20} color="#8B4513" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* App Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            {language === 'hr' ? 'O aplikaciji' : language === 'sl' ? 'O aplikaciji' : 'About app'}
          </Text>
          
          <Text style={styles.appName}>Jelačićeva Potkova</Text>
          <Text style={styles.appVersion}>
            {language === 'hr' ? 'Verzija' : language === 'sl' ? 'Različica' : 'Version'} 1.0.0
          </Text>
          <Text style={styles.appDescription}>
            {language === 'hr' 
              ? 'Otkrijte povijest Ban Jelačića kroz interaktivnu igru istraživanja.'
              : language === 'sl'
              ? 'Odkrijte zgodovino ban Jelačića skozi interaktivno raziskovalno igro.'
              : 'Discover Ban Jelačić\'s history through interactive exploration game.'}
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
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5E6D3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#A0522D',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0522D',
    marginTop: 4,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'right',
  },
  activityCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityText: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 12,
    color: '#A0522D',
    marginTop: 2,
  },
  activityScore: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  noActivityContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noActivityText: {
    fontSize: 14,
    color: '#A0522D',
    marginTop: 8,
  },
  settingsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  languageList: {
    marginTop: -8,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  languageItemSelected: {
    backgroundColor: '#F5E6D3',
  },
  languageText: {
    fontSize: 16,
    color: '#8B4513',
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#A0522D',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#A0522D',
    lineHeight: 20,
  },
});

export default ProfileScreen;