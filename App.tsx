import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import InteractiveMapScreen from './src/screens/InteractiveMapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ARCameraScreen from './src/screens/ARCameraScreen';
import QuizScreen from './src/screens/QuizScreen';
import POIDetailScreen from './src/screens/POIDetailScreen';
import GameStatsScreen from './src/screens/GameStatsScreen';

// Types
export type RootStackParamList = {
  MainTabs: undefined;
  ARCamera: undefined;
  Quiz: { treasureId: string };
  POIDetail: { poiId: string };
  GameStats: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Game: undefined;
  Map: undefined;
  Profile: undefined;
  Stats: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();


function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Game':
              iconName = 'games';
              break;
            case 'Map':
              iconName = 'map';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            case 'Stats':
              iconName = 'analytics';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B4513',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#8B4513',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Početna' }}
      />
      <Tab.Screen 
        name="Game" 
        component={GameScreen}
        options={{ title: 'Igra' }}
      />
      <Tab.Screen 
        name="Map" 
        component={InteractiveMapScreen}
        options={{ title: 'Karta' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
      <Tab.Screen 
        name="Stats" 
        component={GameStatsScreen}
        options={{ title: 'Statistike' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#8B4513',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ARCamera" 
              component={ARCameraScreen}
              options={{ 
                title: 'AR Kamera',
                presentation: 'modal',
                headerLeft: () => null,
              }}
            />
            <Stack.Screen 
              name="Quiz" 
              component={QuizScreen}
              options={{ 
                title: 'Povijesni kviz',
                headerBackTitle: 'Nazad',
              }}
            />
            <Stack.Screen 
              name="POIDetail" 
              component={POIDetailScreen}
              options={{ 
                title: 'Zanimljivost',
                headerBackTitle: 'Karta',
              }}
            />
            <Stack.Screen 
              name="GameStats" 
              component={GameStatsScreen}
              options={{ 
                title: 'Detaljne statistike',
                headerBackTitle: 'Nazad',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
    </SafeAreaProvider>
  );
}