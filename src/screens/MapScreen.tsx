import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useLanguage } from '../hooks/useLanguage';
import apiClient from '../utils/api';
import { Treasure } from '../types/schema';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const { getText, language } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [userTreasures, setUserTreasures] = useState<any[]>([]);

  useEffect(() => {
    requestLocationPermission();
    loadData();
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

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        setLocationPermission(false);
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

  const isTreasureDiscovered = (treasureId: string): boolean => {
    return userTreasures.some(ut => ut.treasureId === treasureId);
  };

  const getDistance = (treasure: Treasure): number => {
    if (!currentLocation) return 0;
    return calculateDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      treasure.location.latitude,
      treasure.location.longitude
    );
  };

  const getTreasureStatus = (treasure: Treasure) => {
    if (isTreasureDiscovered(treasure.id)) {
      return {
        color: '#4CAF50',
        icon: 'check-circle',
        text: language === 'hr' ? 'Otkriveno' : language === 'sl' ? 'Odkrito' : 'Discovered'
      };
    }
    
    const distance = getDistance(treasure);
    if (distance <= treasure.discoveryRadius) {
      return {
        color: '#FF9800',
        icon: 'location-on',
        text: language === 'hr' ? 'U dometu' : language === 'sl' ? 'V dosegu' : 'In range'
      };
    }
    
    return {
      color: '#2196F3',
      icon: 'explore',
      text: language === 'hr' ? 'Daleko' : language === 'sl' ? 'Daleč' : 'Far'
    };
  };

  const getDistanceText = (treasure: Treasure): string => {
    if (!currentLocation) return '';
    
    const distance = getDistance(treasure);
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const getDirectionIndicator = (treasure: Treasure): string => {
    if (!currentLocation) return '📍';
    
    const lat1 = currentLocation.coords.latitude;
    const lon1 = currentLocation.coords.longitude;
    const lat2 = treasure.location.latitude;
    const lon2 = treasure.location.longitude;
    
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) - 
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    
    if (bearing >= 337.5 || bearing < 22.5) return '⬆️';
    if (bearing >= 22.5 && bearing < 67.5) return '↗️';
    if (bearing >= 67.5 && bearing < 112.5) return '➡️';
    if (bearing >= 112.5 && bearing < 157.5) return '↘️';
    if (bearing >= 157.5 && bearing < 202.5) return '⬇️';
    if (bearing >= 202.5 && bearing < 247.5) return '↙️';
    if (bearing >= 247.5 && bearing < 292.5) return '⬅️';
    return '↖️';
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
              ? 'Da biste vidjeli kartu s blagom, potrebno je omogućiti pristup lokaciji.'
              : language === 'sl'
              ? 'Za ogled zemljevida z zakladi morate omogočiti dostop do lokacije.'
              : 'To see the treasure map, you need to enable location access.'}
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
            {language === 'hr' ? 'Mapa blaga' : language === 'sl' ? 'Zemljevid zakladov' : 'Treasure Map'}
          </Text>
          {currentLocation && (
            <Text style={styles.locationText}>
              📍 {language === 'hr' ? 'Vaša lokacija' : language === 'sl' ? 'Vaša lokacija' : 'Your location'}: 
              {currentLocation.coords.latitude.toFixed(4)}, {currentLocation.coords.longitude.toFixed(4)}
            </Text>
          )}
        </View>

        <Card style={styles.legendCard}>
          <Text style={styles.legendTitle}>
            {language === 'hr' ? 'Legenda' : language === 'sl' ? 'Legenda' : 'Legend'}
          </Text>
          <View style={styles.legendRow}>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.legendText}>
              {language === 'hr' ? 'Otkriveno' : language === 'sl' ? 'Odkrito' : 'Discovered'}
            </Text>
          </View>
          <View style={styles.legendRow}>
            <MaterialIcons name="location-on" size={20} color="#FF9800" />
            <Text style={styles.legendText}>
              {language === 'hr' ? 'U dometu' : language === 'sl' ? 'V dosegu' : 'In range'}
            </Text>
          </View>
          <View style={styles.legendRow}>
            <MaterialIcons name="explore" size={20} color="#2196F3" />
            <Text style={styles.legendText}>
              {language === 'hr' ? 'Nedostupno' : language === 'sl' ? 'Nedostopno' : 'Out of range'}
            </Text>
          </View>
        </Card>

        <View style={styles.mapContainer}>
          {treasures.sort((a, b) => a.unlockOrder - b.unlockOrder).map((treasure) => {
            const status = getTreasureStatus(treasure);
            
            return (
              <Card key={treasure.id} style={[styles.treasureMapCard, { borderColor: status.color }]}>
                <View style={styles.treasureMapHeader}>
                  <View style={styles.treasureMapInfo}>
                    <Text style={styles.treasureMapName}>{getText(treasure.name)}</Text>
                    <Text style={styles.treasureMapDescription}>
                      {getText(treasure.description)}
                    </Text>
                  </View>
                  
                  <View style={styles.statusContainer}>
                    <MaterialIcons name={status.icon} size={24} color={status.color} />
                    <Text style={[styles.statusMapText, { color: status.color }]}>
                      {status.text}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.treasureMapDetails}>
                  <View style={styles.mapDetailRow}>
                    <Text style={styles.mapDetailLabel}>
                      {language === 'hr' ? 'Lokacija:' : language === 'sl' ? 'Lokacija:' : 'Location:'}
                    </Text>
                    <Text style={styles.mapDetailValue}>
                      {treasure.location.latitude.toFixed(4)}, {treasure.location.longitude.toFixed(4)}
                    </Text>
                  </View>
                  
                  {currentLocation && (
                    <>
                      <View style={styles.mapDetailRow}>
                        <Text style={styles.mapDetailLabel}>
                          {language === 'hr' ? 'Udaljenost:' : language === 'sl' ? 'Razdalja:' : 'Distance:'}
                        </Text>
                        <Text style={styles.mapDetailValue}>
                          {getDistanceText(treasure)}
                        </Text>
                      </View>
                      
                      <View style={styles.mapDetailRow}>
                        <Text style={styles.mapDetailLabel}>
                          {language === 'hr' ? 'Smjer:' : language === 'sl' ? 'Smer:' : 'Direction:'}
                        </Text>
                        <Text style={styles.directionIndicator}>
                          {getDirectionIndicator(treasure)}
                        </Text>
                      </View>
                    </>
                  )}
                  
                  <View style={styles.mapDetailRow}>
                    <Text style={styles.mapDetailLabel}>
                      {language === 'hr' ? 'Bodovi:' : language === 'sl' ? 'Točke:' : 'Points:'}
                    </Text>
                    <Text style={styles.pointsMapValue}>
                      ⭐ {treasure.points}
                    </Text>
                  </View>
                </View>
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
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  legendCard: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  mapContainer: {
    paddingHorizontal: 20,
  },
  treasureMapCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 2,
  },
  treasureMapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  treasureMapInfo: {
    flex: 1,
    marginRight: 12,
  },
  treasureMapName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  treasureMapDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusMapText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  treasureMapDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  mapDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mapDetailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  mapDetailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  directionIndicator: {
    fontSize: 18,
  },
  pointsMapValue: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  refreshContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default MapScreen;