import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { useLanguage } from '../hooks/useLanguage';
import apiClient from '../utils/api';
import { RootStackParamList } from '../../App';
import { Treasure, UserTreasure } from '../types/schema';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const GameScreen = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const { getText, language } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [userTreasures, setUserTreasures] = useState<UserTreasure[]>([]);
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);

  useEffect(() => {
    requestLocationPermission();
    loadTreasures();
    loadUserTreasures();
  }, []);

  const loadTreasures = async () => {
    try {
      const data = await apiClient.getTreasures();
      setTreasures(data);
    } catch (error) {
      console.error('Error loading treasures:', error);
    }
  };

  const loadUserTreasures = async () => {
    try {
      const data = await apiClient.getUserTreasures('demo-user');
      setUserTreasures(data);
    } catch (error) {
      console.error('Error loading user treasures:', error);
    }
  };

  const discoverTreasure = async (treasureId: string, location: { latitude: number; longitude: number }) => {
    try {
      setIsDiscovering(true);
      await apiClient.discoverTreasure('demo-user', treasureId, location);
      await loadUserTreasures();
    } catch (error) {
      console.error('Error discovering treasure:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        setLocationPermission(false);
        Alert.alert(
          language === 'hr' ? 'Potrebna dozvola' : language === 'sl' ? 'Potrebno dovoljenje' : 'Permission Required',
          language === 'hr' 
            ? 'Aplikacija treba pristup lokaciji za otkrivanje blaga.'
            : language === 'sl'
            ? 'Aplikacija potrebuje dostop do lokacije za odkrivanje zakladov.'
            : 'The app needs location access to discover treasures.'
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const isNearTreasure = (treasure: Treasure): boolean => {
    if (!currentLocation) return false;
    
    const distance = calculateDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      treasure.location.latitude,
      treasure.location.longitude
    );
    
    return distance <= treasure.discoveryRadius;
  };

  const isTreasureDiscovered = (treasureId: string): boolean => {
    return userTreasures.some(ut => ut.treasureId === treasureId);
  };

  const canDiscoverTreasure = (treasure: Treasure): boolean => {
    if (isTreasureDiscovered(treasure.id)) return false;
    
    if (treasure.unlockOrder > 1) {
      const previousTreasureOrder = treasure.unlockOrder - 1;
      const previousTreasure = treasures.find(t => t.unlockOrder === previousTreasureOrder);
      if (previousTreasure && !isTreasureDiscovered(previousTreasure.id)) {
        return false;
      }
    }
    
    return true;
  };

  const handleDiscoverTreasure = async (treasure: Treasure) => {
    if (!currentLocation) {
      Alert.alert(
        language === 'hr' ? 'Lokacija nedostupna' : language === 'sl' ? 'Lokacija ni na voljo' : 'Location Unavailable',
        language === 'hr' 
          ? 'Ne možemo dohvatiti vašu lokaciju.'
          : language === 'sl'
          ? 'Ne moremo pridobiti vaše lokacije.'
          : 'Cannot get your location.'
      );
      return;
    }

    if (!canDiscoverTreasure(treasure)) {
      Alert.alert(
        language === 'hr' ? 'Blago zaključano' : language === 'sl' ? 'Zaklad zaklenjen' : 'Treasure Locked',
        language === 'hr' 
          ? 'Prvo morate otkriti prethodna blaga.'
          : language === 'sl'
          ? 'Najprej morate odkriti prejšnje zaklade.'
          : 'You must discover previous treasures first.'
      );
      return;
    }

    if (!isNearTreasure(treasure)) {
      const distance = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        treasure.location.latitude,
        treasure.location.longitude
      );
      Alert.alert(
        language === 'hr' ? 'Predaleko' : language === 'sl' ? 'Predaleč' : 'Too Far',
        language === 'hr' 
          ? `Morate biti bliže blagu da ga otkrijete. Udaljenost: ${Math.round(distance)}m`
          : language === 'sl'
          ? `Biti morate bližje zakladu, da ga odkrijete. Razdalja: ${Math.round(distance)}m`
          : `You must be closer to the treasure to discover it. Distance: ${Math.round(distance)}m`
      );
      return;
    }

    try {
      await discoverTreasure(treasure.id, {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      Alert.alert(
        language === 'hr' ? 'Čestitamo!' : language === 'sl' ? 'Čestitamo!' : 'Congratulations!',
        language === 'hr' 
          ? `Otkrili ste ${getText(treasure.name)}! Osvojili ste ${treasure.points} bodova.`
          : language === 'sl'
          ? `Odkrili ste ${getText(treasure.name)}! Osvojili ste ${treasure.points} točk.`
          : `You discovered ${getText(treasure.name)}! You earned ${treasure.points} points.`,
        [
          {
            text: language === 'hr' ? 'Super!' : language === 'sl' ? 'Super!' : 'Great!',
            onPress: () => {
              Alert.alert(
                language === 'hr' ? 'Kviz dostupan' : language === 'sl' ? 'Kviz na voljo' : 'Quiz Available',
                language === 'hr' 
                  ? 'Želite li riješiti kviz o ovom blagu za dodatne bodove?'
                  : language === 'sl'
                  ? 'Ali želite rešiti kviz o tem zakladu za dodatne točke?'
                  : 'Would you like to take a quiz about this treasure for extra points?',
                [
                  {
                    text: language === 'hr' ? 'Ne, hvala' : language === 'sl' ? 'Ne, hvala' : 'No, thanks',
                    style: 'cancel'
                  },
                  {
                    text: language === 'hr' ? 'Da!' : language === 'sl' ? 'Da!' : 'Yes!',
                    onPress: () => {
                      navigation.navigate('Quiz', { treasureId: treasure.id });
                    }
                  }
                ]
              );
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error discovering treasure:', error);
      Alert.alert(
        language === 'hr' ? 'Greška' : language === 'sl' ? 'Napaka' : 'Error',
        language === 'hr' 
          ? 'Greška pri otkrivanju blaga'
          : language === 'sl'
          ? 'Napaka pri odkrivanju zaklada'
          : 'Error discovering treasure'
      );
    }
  };

  const getTreasureStatus = (treasure: Treasure) => {
    if (isTreasureDiscovered(treasure.id)) {
      return {
        status: 'discovered',
        color: '#4CAF50',
        icon: 'check-circle',
        text: language === 'hr' ? 'Otkriveno' : language === 'sl' ? 'Odkrito' : 'Discovered'
      };
    }
    
    if (!canDiscoverTreasure(treasure)) {
      return {
        status: 'locked',
        color: '#9E9E9E',
        icon: 'lock',
        text: language === 'hr' ? 'Zaključano' : language === 'sl' ? 'Zaklenjeno' : 'Locked'
      };
    }
    
    if (currentLocation && isNearTreasure(treasure)) {
      return {
        status: 'discoverable',
        color: '#FF9800',
        icon: 'location-on',
        text: language === 'hr' ? 'Otkrijte!' : language === 'sl' ? 'Odkrijte!' : 'Discover!'
      };
    }
    
    return {
      status: 'distant',
      color: '#2196F3',
      icon: 'explore',
      text: language === 'hr' ? 'Idite bliže' : language === 'sl' ? 'Pojdite bližje' : 'Get closer'
    };
  };

  const getDistanceText = (treasure: Treasure): string => {
    if (!currentLocation) return '';
    
    const distance = calculateDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      treasure.location.latitude,
      treasure.location.longitude
    );
    
    if (distance < 1000) {
      return `${Math.round(distance)}m ${language === 'hr' ? 'udaljen' : language === 'sl' ? 'oddaljen' : 'away'}`;
    } else {
      return `${(distance / 1000).toFixed(1)}km ${language === 'hr' ? 'udaljen' : language === 'sl' ? 'oddaljen' : 'away'}`;
    }
  };

  if (!locationPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <MaterialIcons name="location-off" size={80} color="#8B4513" />
          <Text style={styles.permissionTitle}>
            {language === 'hr' ? 'Potrebna dozvola lokacije' : language === 'sl' ? 'Potrebno dovoljenje za lokacijo' : 'Location Permission Required'}
          </Text>
          <Text style={styles.permissionText}>
            {language === 'hr' 
              ? 'Da biste igrali lovac na blago, potrebno je omogućiti pristup lokaciji.'
              : language === 'sl'
              ? 'Za igranje lova na zaklade morate omogočiti dostop do lokacije.'
              : 'To play the treasure hunt, you need to enable location access.'}
          </Text>
          <Button
            title={language === 'hr' ? 'Omogući lokaciju' : language === 'sl' ? 'Omogoči lokacijo' : 'Enable Location'}
            onPress={requestLocationPermission}
            style={styles.permissionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'hr' ? 'Lov na blago' : language === 'sl' ? 'Lov na zaklade' : 'Treasure Hunt'}
          </Text>
          {currentLocation && (
            <Text style={styles.locationText}>
              📍 {language === 'hr' ? 'Lokacija dobivena' : language === 'sl' ? 'Lokacija pridobljena' : 'Location acquired'}
            </Text>
          )}
        </View>

        <View style={styles.treasuresContainer}>
          {treasures.sort((a, b) => a.unlockOrder - b.unlockOrder).map((treasure) => {
            const status = getTreasureStatus(treasure);
            const discovered = isTreasureDiscovered(treasure.id);
            
            return (
              <Card key={treasure.id} style={styles.treasureCard}>
                <View style={styles.treasureHeader}>
                  <View style={styles.treasureInfo}>
                    <Text style={styles.treasureName}>{getText(treasure.name)}</Text>
                    <Text style={styles.treasureDescription}>
                      {getText(treasure.description)}
                    </Text>
                    {currentLocation && (
                      <Text style={styles.distanceText}>
                        {getDistanceText(treasure)}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <MaterialIcons name={status.icon} size={20} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.text}
                    </Text>
                  </View>
                </View>

                <View style={styles.treasureDetails}>
                  <View style={styles.treasureRow}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                    <Text style={styles.pointsText}>
                      {treasure.points} {language === 'hr' ? 'bodova' : language === 'sl' ? 'točk' : 'points'}
                    </Text>
                  </View>
                  <View style={styles.treasureRow}>
                    <MaterialIcons name="info" size={16} color="#8B4513" />
                    <Text style={styles.orderText}>
                      {language === 'hr' ? 'Redoslijed' : language === 'sl' ? 'Vrstni red' : 'Order'}: {treasure.unlockOrder}
                    </Text>
                  </View>
                </View>

                {status.status === 'discoverable' && !discovered && (
                  <Button
                    title={language === 'hr' ? 'Otkrij blago!' : language === 'sl' ? 'Odkrij zaklad!' : 'Discover treasure!'}
                    onPress={() => handleDiscoverTreasure(treasure)}
                    loading={isDiscovering}
                    style={styles.discoverButton}
                  />
                )}

                {discovered && (
                  <Button
                    title={language === 'hr' ? 'AR Kamera' : language === 'sl' ? 'AR Kamera' : 'AR Camera'}
                    onPress={() => navigation.navigate('ARCamera')}
                    variant="secondary"
                    style={styles.arButton}
                  />
                )}
              </Card>
            );
          })}
        </View>

        <View style={styles.refreshContainer}>
          <Button
            title={language === 'hr' ? 'Osvježi lokaciju' : language === 'sl' ? 'Osveži lokacijo' : 'Refresh location'}
            onPress={getCurrentLocation}
            variant="outline"
            size="sm"
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    minWidth: 200,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  treasuresContainer: {
    paddingHorizontal: 20,
  },
  treasureCard: {
    marginBottom: 16,
    padding: 16,
  },
  treasureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  treasureInfo: {
    flex: 1,
    marginRight: 12,
  },
  treasureName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  treasureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  distanceText: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 4,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  treasureDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  treasureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '600',
  },
  orderText: {
    fontSize: 14,
    color: '#8B4513',
    marginLeft: 4,
  },
  discoverButton: {
    marginTop: 8,
  },
  arButton: {
    marginTop: 8,
  },
  refreshContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default GameScreen;