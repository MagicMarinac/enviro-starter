import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { useLanguage } from '../hooks/useLanguage';
import apiClient from '../utils/api';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { getText, language } = useLanguage();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadUserData();
    loadUserStats();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await apiClient.getUser('demo-user');
      setUser(data);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const data = await apiClient.getUserStats('demo-user');
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const welcomeText = {
    hr: 'Dobrodošli u potragu za Jelačićevom potkovom!',
    sl: 'Dobrodošli v iskanje Jelačićeve podkve!',
    en: 'Welcome to the hunt for Jelačić\'s Horseshoe!',
  };

  const subtitleText = {
    hr: 'Istražite povijesne lokacije u Novom Dvoru i Zaprešiću',
    sl: 'Raziščite zgodovinske lokacije v Novem Dvoru in Zaprešiću',
    en: 'Explore historical locations in Novi Dvor and Zaprešić',
  };

  const startHuntText = {
    hr: 'Počni lov na blago',
    sl: 'Začni lov na zaklade',
    en: 'Start treasure hunt',
  };

  const progressText = {
    hr: 'Vaš napredak',
    sl: 'Vaš napredak',
    en: 'Your progress',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            <MaterialIcons name="location-on" size={80} color="#8B4513" />
          </View>
          <Text style={styles.title}>{getText(welcomeText)}</Text>
          <Text style={styles.subtitle}>{getText(subtitleText)}</Text>
        </View>

        {/* Stats Cards */}
        {stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>{getText(progressText)}</Text>
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <MaterialIcons name="star" size={24} color="#FFD700" />
                <Text style={styles.statNumber}>{stats.treasuresFound}</Text>
                <Text style={styles.statLabel}>
                  {language === 'hr' ? 'Blaga' : language === 'sl' ? 'Zakladi' : 'Treasures'}
                </Text>
              </Card>
              
              <Card style={styles.statCard}>
                <MaterialIcons name="emoji-events" size={24} color="#8B4513" />
                <Text style={styles.statNumber}>{stats.totalScore}</Text>
                <Text style={styles.statLabel}>
                  {language === 'hr' ? 'Bodovi' : language === 'sl' ? 'Točke' : 'Points'}
                </Text>
              </Card>
              
              <Card style={styles.statCard}>
                <MaterialIcons name="military-tech" size={24} color="#9C27B0" />
                <Text style={styles.statNumber}>{stats.achievementsUnlocked}</Text>
                <Text style={styles.statLabel}>
                  {language === 'hr' ? 'Postignuća' : language === 'sl' ? 'Dosežki' : 'Achievements'}
                </Text>
              </Card>
            </View>
          </View>
        )}

        {/* Game Features */}
        <View style={styles.featuresContainer}>
          <Card style={styles.featureCard}>
            <MaterialIcons name="camera-alt" size={32} color="#8B4513" />
            <Text style={styles.featureTitle}>AR Selfie</Text>
            <Text style={styles.featureDescription}>
              {language === 'hr' 
                ? 'Slikajte se s Jelačićevim brkovima' 
                : language === 'sl' 
                ? 'Fotografirajte se z Jelačićevimi brki'
                : 'Take selfies with Jelačić\'s mustache'}
            </Text>
            <Button
              title={language === 'hr' ? 'Otvori kameru' : language === 'sl' ? 'Odpri kamero' : 'Open Camera'}
              onPress={() => navigation.navigate('ARCamera')}
              variant="outline"
              size="sm"
              style={{ marginTop: 10 }}
            />
          </Card>

          <Card style={styles.featureCard}>
            <MaterialIcons name="help" size={32} color="#8B4513" />
            <Text style={styles.featureTitle}>
              {language === 'hr' ? 'Kvizovi' : language === 'sl' ? 'Kvizi' : 'Quizzes'}
            </Text>
            <Text style={styles.featureDescription}>
              {language === 'hr' 
                ? 'Naučite o banu Jelačiću' 
                : language === 'sl' 
                ? 'Naučite se o banu Jelačiću'
                : 'Learn about Ban Jelačić'}
            </Text>
          </Card>
        </View>

        {/* Start Button */}
        <View style={styles.startContainer}>
          <Button
            title={getText(startHuntText)}
            onPress={() => navigation.navigate('Game')}
            size="lg"
            style={styles.startButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5E6D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0522D',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    paddingVertical: 20,
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
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  featureCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
    lineHeight: 20,
  },
  startContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  startButton: {
    minHeight: 56,
  },
});

export default HomeScreen;