import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { useLanguage } from '../hooks/useLanguage';
import { RootStackParamList } from '../../App';
import { PointOfInterest } from '../types/schema';

type POIDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type POIDetailScreenRouteProp = RouteProp<RootStackParamList, 'POIDetail'>;

const { width } = Dimensions.get('window');

// Mock Points of Interest data - in real app this would come from API
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
      hr: 'Ovaj spomenik postavljen je 1866. godine u čast bana Josipa Jelačića von Bužima, heroja hrvatskog naroda i borca za autonomiju. Spomenik predstavlja bana na konju, simbolizirajući njegovu ulogu vojskovođe. Ban Jelačić (1801-1859) bio je hrvatski vojni zapovjednik, ban i političar koji je igrao ključnu ulogu u Hrvatskoj povijesti 19. stoljeća.',
      sl: 'Ta spomenik je bil postavljen leta 1866 v čast bana Josipa Jelačića von Bužima, junaka hrvaškega naroda in borca za avtonomijo. Spomenik predstavlja bana na konju in simbolizira njegovo vlogo vojskovodje. Ban Jelačić (1801-1859) je bil hrvaški vojaški poveljnik, ban in politik, ki je igral ključno vlogo v hrvaški zgodovini 19. stoletja.',
      en: 'This monument was erected in 1866 in honor of Ban Josip Jelačić von Bužim, hero of the Croatian people and fighter for autonomy. The monument shows the ban on horseback, symbolizing his role as a military leader. Ban Jelačić (1801-1859) was a Croatian military commander, ban, and politician who played a key role in 19th-century Croatian history.'
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
      hr: 'Muzej Zaprešića osnovao je 1962. godine grad Zaprešić. U njemu se čuvaju originalni dokumenti i predmeti iz vremena ban Jelačića, uključujući pisma, uniforme, oružje i osobne stvari. Posebno je vrijedna zbirka koja dokumentira Jelačićev političko-vojni rad tijekom mađarske revolucije 1848-1849. godine.',
      sl: 'Muzej Zaprešića je ustanovilo mesto Zaprešić leta 1962. V njem se hranijo originalni dokumenti in predmeti iz časov ban Jelačića, vključno s pismi, uniformami, orožjem in osebnimi stvarmi. Posebej dragocena je zbirka, ki dokumentira Jelačićevo politično-vojaško delo med madžarsko revolucijo 1848-1849.',
      en: 'The Zaprešić Museum was established by the city of Zaprešić in 1962. It houses original documents and items from Ban Jelačić\'s time, including letters, uniforms, weapons, and personal belongings. Particularly valuable is the collection documenting Jelačić\'s political-military work during the Hungarian revolution of 1848-1849.'
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
      hr: 'Park Novi Dvori nastao je na mjestu nekadašnjih dvorskih vrtova. Ovdje je Ban Jelačić često šetao i razmišljao o važnim državnim odlukama. Staze koje danas vidite iste su kao u 19. stoljeću. Ban je ovdje primao važne goste i vodio neformalne razgovore koji su oblikovali hrvatsku politiku. Park je također bio svjedok mnogih povijesnih trenutaka.',
      sl: 'Park Novi Dvori je nastal na mestu nekdanjih dvornih vrtov. Tukaj je ban Jelačić pogosto sprehodil in razmišljal o pomembnih državnih odločitvah. Poti, ki jih danes vidite, so iste kot v 19. stoletju. Ban je tukaj sprejemal pomembne goste in vodil neformalne pogovore, ki so oblikovali hrvaško politiko. Park je bil tudi priča mnogih zgodovinskih trenutkov.',
      en: 'Novi Dvori Park was created on the site of former court gardens. Here Ban Jelačić often walked and contemplated important state decisions. The paths you see today are the same as in the 19th century. The ban received important guests here and held informal conversations that shaped Croatian politics. The park was also witness to many historical moments.'
    }
  }
];

const POIDetailScreen = () => {
  const navigation = useNavigation<POIDetailScreenNavigationProp>();
  const route = useRoute<POIDetailScreenRouteProp>();
  const { getText, language } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [poi, setPoi] = useState<PointOfInterest | null>(null);

  useEffect(() => {
    const foundPoi = pointsOfInterest.find(p => p.id === route.params.poiId);
    setPoi(foundPoi || null);
    getCurrentLocation();
  }, [route.params.poiId]);

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

  const getDistance = (): string => {
    if (!currentLocation || !poi) return '';
    
    const distance = calculateDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      poi.location.latitude,
      poi.location.longitude
    );
    
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'monument': return 'account-balance';
      case 'museum': return 'museum';
      case 'park': return 'park';
      default: return 'place';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'monument': return '#8B4513';
      case 'museum': return '#2196F3';
      case 'park': return '#4CAF50';
      default: return '#666';
    }
  };

  const openMaps = () => {
    if (!poi) return;
    
    Alert.alert(
      language === 'hr' ? 'Otvori navigaciju' : language === 'sl' ? 'Odpri navigacijo' : 'Open Navigation',
      language === 'hr' 
        ? `Želite li otvoriti navigaciju do ${getText(poi.name)}?`
        : language === 'sl'
        ? `Ali želite odpreti navigacijo do ${getText(poi.name)}?`
        : `Would you like to open navigation to ${getText(poi.name)}?`,
      [
        {
          text: language === 'hr' ? 'Odustani' : language === 'sl' ? 'Prekliči' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'hr' ? 'Otvori' : language === 'sl' ? 'Odpri' : 'Open',
          onPress: () => {
            Alert.alert(
              language === 'hr' ? 'Navigacija' : language === 'sl' ? 'Navigacija' : 'Navigation',
              language === 'hr' 
                ? 'Navigacija bi se otvorila u realnoj aplikaciji.'
                : language === 'sl'
                ? 'Navigacija bi se odprla v pravi aplikaciji.'
                : 'Navigation would open in a real app.'
            );
          },
        },
      ]
    );
  };

  if (!poi) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {language === 'hr' ? 'Zanimljivost nije pronađena' : language === 'sl' ? 'Zanimivost ni najdena' : 'Point of interest not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
          <View style={styles.headerTop}>
            <Button
              title="←"
              onPress={() => navigation.goBack()}
              variant="ghost"
              size="sm"
              style={styles.backButton}
            />
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(poi.category) }]}>
              <MaterialIcons 
                name={getCategoryIcon(poi.category)} 
                size={20} 
                color="white" 
              />
            </View>
          </View>
          
          <Text style={styles.title}>{getText(poi.name)}</Text>
          <Text style={styles.subtitle}>{getText(poi.description)}</Text>
          
          {currentLocation && (
            <View style={styles.distanceContainer}>
              <MaterialIcons name="navigation" size={16} color="#666" />
              <Text style={styles.distanceText}>
                {getDistance()} {language === 'hr' ? 'udaljen' : language === 'sl' ? 'oddaljen' : 'away'}
              </Text>
            </View>
          )}
        </Animatable.View>

        {/* Main Content */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          {/* Historical Information */}
          <Card style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="history" size={24} color="#8B4513" />
              <Text style={styles.cardTitle}>
                {language === 'hr' ? 'Povijesne informacije' : language === 'sl' ? 'Zgodovinske informacije' : 'Historical Information'}
              </Text>
            </View>
            <Text style={styles.historicalText}>
              {getText(poi.historicalInfo)}
            </Text>
          </Card>

          {/* Location Information */}
          <Card style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="place" size={24} color="#2196F3" />
              <Text style={styles.cardTitle}>
                {language === 'hr' ? 'Lokacija' : language === 'sl' ? 'Lokacija' : 'Location'}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>
                {language === 'hr' ? 'Koordinate:' : language === 'sl' ? 'Koordinate:' : 'Coordinates:'}
              </Text>
              <Text style={styles.locationValue}>
                {poi.location.latitude.toFixed(5)}, {poi.location.longitude.toFixed(5)}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>
                {language === 'hr' ? 'Kategorija:' : language === 'sl' ? 'Kategorija:' : 'Category:'}
              </Text>
              <Text style={[styles.categoryText, { color: getCategoryColor(poi.category) }]}>
                {poi.category.charAt(0).toUpperCase() + poi.category.slice(1)}
              </Text>
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Button
              title={language === 'hr' ? 'Otvori navigaciju' : language === 'sl' ? 'Odpri navigacijo' : 'Open Navigation'}
              onPress={openMaps}
              style={styles.actionButton}
            />
            <Button
              title={language === 'hr' ? 'Natrag na kartu' : language === 'sl' ? 'Nazaj na zemljevid' : 'Back to Map'}
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
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
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  categoryBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '600',
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginLeft: 8,
  },
  historicalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionContainer: {
    padding: 20,
    paddingTop: 10,
  },
  actionButton: {
    marginBottom: 12,
  },
});

export default POIDetailScreen;