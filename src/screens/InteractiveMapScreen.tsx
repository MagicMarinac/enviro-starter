import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';

import { useLanguage } from '../hooks/useLanguage';
import apiClient from '../utils/api';
import { RootStackParamList } from '../../App';
import { Treasure, UserTreasure, PointOfInterest } from '../types/schema';

type InteractiveMapScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

// Points of Interest data
const pointsOfInterest: PointOfInterest[] = [
  {
    id: 'poi-1',
    name: {
      hr: 'Spomenik ban Jelačića',
      sl: 'Spomenik ban Jelačića',
      en: 'Ban Jelačić Monument'
    },
    description: {
      hr: 'Glavni spomenik posvećen banu Josipa Jelačića',
      sl: 'Glavni spomenik, posvečen banu Josipa Jelačića',
      en: 'Main monument dedicated to Ban Josip Jelačić'
    },
    location: {
      latitude: 45.8555,
      longitude: 15.8050
    },
    category: 'monument',
    historicalInfo: {
      hr: 'Ovaj spomenik postavljen je 1866. godine u čast bana Josipa Jelačića von Bužima, heroja hrvatskog naroda i borca za autonomiju.',
      sl: 'Ta spomenik je bil postavljen leta 1866 v čast bana Josipa Jelačića von Bužima, junaka hrvaškega naroda in borca za avtonomijo.',
      en: 'This monument was erected in 1866 in honor of Ban Josip Jelačić von Bužim, hero of the Croatian people and fighter for autonomy.'
    }
  },
  {
    id: 'poi-2',
    name: {
      hr: 'Muzej Zaprešića',
      sl: 'Muzej Zaprešića',
      en: 'Zaprešić Museum'
    },
    description: {
      hr: 'Lokalni muzej s povijesnim artefaktima',
      sl: 'Lokalni muzej z zgodovinskimi artefakti',
      en: 'Local museum with historical artifacts'
    },
    location: {
      latitude: 45.8580,
      longitude: 15.8045
    },
    category: 'museum',
    historicalInfo: {
      hr: 'U muzeju se čuvaju originalni dokumenti i predmeti iz vremena ban Jelačića, uključujući pisma i osobne stvari.',
      sl: 'V muzeju se hranijo originalni dokumenti in predmeti iz časov ban Jelačića, vključno s pismi in osebnimi stvarmi.',
      en: 'The museum houses original documents and items from Ban Jelačić\'s time, including letters and personal belongings.'
    }
  },
  {
    id: 'poi-3',
    name: {
      hr: 'Park Novi Dvori',
      sl: 'Park Novi Dvori',
      en: 'Novi Dvori Park'
    },
    description: {
      hr: 'Prekrasan park s povijesnim stazama',
      sl: 'Čudovit park z zgodovinskimi potmi',
      en: 'Beautiful park with historical trails'
    },
    location: {
      latitude: 45.8590,
      longitude: 15.8070
    },
    category: 'park',
    historicalInfo: {
      hr: 'Ovdje je Ban Jelačić često šetao i razmišljao o važnim državnim odlukama. Staze su iste kao u 19. stoljeću.',
      sl: 'Tukaj je ban Jelačić pogosto sprehodil in razmišljal o pomembnih državnih odločitvah. Poti so iste kot v 19. stoletju.',
      en: 'Here Ban Jelačić often walked and contemplated important state decisions. The trails are the same as in the 19th century.'
    }
  }
];

const InteractiveMapScreen = () => {
  const navigation = useNavigation<InteractiveMapScreenNavigationProp>();
  const { getText, language } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [userTreasures, setUserTreasures] = useState<UserTreasure[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);

  useEffect(() => {
    loadData();
    getCurrentLocation();
  }, []);

  const loadData = async () => {
    try {
      const [treasuresData, userTreasuresData] = await Promise.all([
        apiClient.getTreasures(),
        apiClient.getUserTreasures('demo-user')
      ]);
      setTreasures(treasuresData);
      setUserTreasures(userTreasuresData);
    } catch (error) {
      console.error('Error loading map data:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrentLocation(location);
      }
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

  const isTreasureDiscovered = (treasureId: string): boolean => {
    return userTreasures.some(ut => ut.treasureId === treasureId);
  };

  const canCollectTreasure = (treasure: Treasure): boolean => {
    if (isTreasureDiscovered(treasure.id)) return false;
    
    // For testing: always allow collection regardless of distance or unlock order
    return true;
    
    // Original logic (commented out for testing):
    // Check if previous treasures are discovered (unlock order)
    // if (treasure.unlockOrder > 1) {
    //   const previousTreasureOrder = treasure.unlockOrder - 1;
    //   const previousTreasure = treasures.find(t => t.unlockOrder === previousTreasureOrder);
    //   if (previousTreasure && !isTreasureDiscovered(previousTreasure.id)) {
    //     return false;
    //   }
    // }
    // Check if player is close enough
    // if (!currentLocation) return false;
    // const distance = calculateDistance(
    //   currentLocation.coords.latitude,
    //   currentLocation.coords.longitude,
    //   treasure.location.latitude,
    //   treasure.location.longitude
    // );
    // return distance <= treasure.discoveryRadius;
  };

  const handleTreasureCollect = async (treasure: Treasure) => {
    // For testing: Skip all validation checks
    // Original validation (commented out for testing):
    // if (!canCollectTreasure(treasure)) {
    //   const distance = currentLocation ? calculateDistance(...) : 0;
    //   if (distance > treasure.discoveryRadius) { return; }
    //   if (treasure.unlockOrder > 1) { return; }
    // }

    try {
      setIsCollecting(true);
      
      // Haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Discover the treasure
      const location = currentLocation ? {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      } : {
        // Use treasure location as fallback for testing
        latitude: treasure.location.latitude,
        longitude: treasure.location.longitude,
      };
      
      await apiClient.discoverTreasure('demo-user', treasure.id, location);

      // Update local state
      await loadData();

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
              // Trigger quiz
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
      console.error('Error collecting treasure:', error);
      Alert.alert(
        language === 'hr' ? 'Greška' : language === 'sl' ? 'Napaka' : 'Error',
        language === 'hr' 
          ? 'Greška pri otkrivanju blaga'
          : language === 'sl'
          ? 'Napaka pri odkrivanju zaklada'
          : 'Error discovering treasure'
      );
    } finally {
      setIsCollecting(false);
    }
  };

  const handlePOIPress = (poi: PointOfInterest) => {
    setSelectedPOI(poi);
    navigation.navigate('POIDetail', { poiId: poi.id });
  };

  const getTreasureMarkerColor = (treasure: Treasure): string => {
    if (isTreasureDiscovered(treasure.id)) {
      return '#4CAF50'; // Green for discovered
    }
    if (canCollectTreasure(treasure)) {
      return '#FF9800'; // Orange for collectible
    }
    return '#9E9E9E'; // Gray for locked
  };

  const getPOIMarkerColor = (category: string): string => {
    switch (category) {
      case 'monument': return '#8B4513';
      case 'museum': return '#2196F3';
      case 'park': return '#4CAF50';
      default: return '#666';
    }
  };

  // Set map region to Novi Dvori, Zaprešić
  const initialRegion = {
    latitude: 45.8561,
    longitude: 15.8067,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        region={currentLocation ? {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
      >
        {/* Treasure Markers */}
        {treasures.map((treasure) => (
          <Marker
            key={treasure.id}
            coordinate={treasure.location}
            pinColor={getTreasureMarkerColor(treasure)}
            onPress={() => handleTreasureCollect(treasure)}
          >
            <View style={[styles.treasureMarker, { backgroundColor: getTreasureMarkerColor(treasure) }]}>
              <MaterialIcons 
                name={isTreasureDiscovered(treasure.id) ? 'check' : 'star'} 
                size={20} 
                color="white" 
              />
              <Text style={styles.treasureOrderText}>{treasure.unlockOrder}</Text>
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{getText(treasure.name)}</Text>
                <Text style={styles.calloutDescription}>{getText(treasure.description)}</Text>
                <Text style={styles.calloutPoints}>⭐ {treasure.points} points</Text>
                {!isTreasureDiscovered(treasure.id) && (
                  <TouchableOpacity 
                    style={styles.claimButton}
                    onPress={() => handleTreasureCollect(treasure)}
                  >
                    <Text style={styles.claimButtonText}>
                      {language === 'hr' ? '🏆 Zatraži blago' : language === 'sl' ? '🏆 Zahtevaj zaklad' : '🏆 Collect Treasure'}
                    </Text>
                  </TouchableOpacity>
                )}
                {isTreasureDiscovered(treasure.id) && (
                  <Text style={styles.calloutCompleted}>
                    ✅ {language === 'hr' ? 'Otkriveno' : language === 'sl' ? 'Odkrito' : 'Discovered'}
                  </Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Points of Interest Markers */}
        {pointsOfInterest.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={poi.location}
            pinColor={getPOIMarkerColor(poi.category)}
            onPress={() => handlePOIPress(poi)}
          >
            <View style={[styles.poiMarker, { backgroundColor: getPOIMarkerColor(poi.category) }]}>
              <MaterialIcons 
                name={poi.category === 'monument' ? 'account-balance' : poi.category === 'museum' ? 'museum' : 'park'} 
                size={16} 
                color="white" 
              />
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{getText(poi.name)}</Text>
                <Text style={styles.calloutDescription}>{getText(poi.description)}</Text>
                <Text style={styles.calloutAction}>
                  {language === 'hr' ? 'Dodirnite za više informacija' : language === 'sl' ? 'Dotaknite se za več informacij' : 'Tap for more info'}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* User Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
          >
            <View style={styles.userMarker}>
              <MaterialIcons name="my-location" size={20} color="#2196F3" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Legend Overlay */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>
          {language === 'hr' ? 'Legenda' : language === 'sl' ? 'Legenda' : 'Legend'}
        </Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>
            {language === 'hr' ? 'Otkriveno blago' : language === 'sl' ? 'Odkrit zaklad' : 'Discovered treasure'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>
            {language === 'hr' ? 'Dostupno blago' : language === 'sl' ? 'Dostopen zaklad' : 'Available treasure'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: '#9E9E9E' }]} />
          <Text style={styles.legendText}>
            {language === 'hr' ? 'Zaključano blago' : language === 'sl' ? 'Zaklenjen zaklad' : 'Locked treasure'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendMarker, { backgroundColor: '#8B4513' }]} />
          <Text style={styles.legendText}>
            {language === 'hr' ? 'Zanimljivost' : language === 'sl' ? 'Zanimivost' : 'Point of interest'}
          </Text>
        </View>
      </View>

      {/* Refresh Location Button */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={getCurrentLocation}
      >
        <MaterialIcons name="my-location" size={24} color="#2196F3" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  treasureMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  treasureOrderText: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 16,
    height: 16,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 16,
  },
  poiMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  calloutContainer: {
    padding: 10,
    minWidth: 150,
    maxWidth: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  calloutPoints: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutAction: {
    fontSize: 10,
    color: '#2196F3',
    fontWeight: '600',
    textAlign: 'center',
  },
  claimButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  claimButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calloutDisabled: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  calloutCompleted: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  legendContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#333',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default InteractiveMapScreen;