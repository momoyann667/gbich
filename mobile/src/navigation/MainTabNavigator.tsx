/**
 * GBICH'APP — Main Tab Navigator (5 Onglets Satiriques).
 * 1. Accueil (actif avec accent rouge & flamme satirique)
 * 2. Kiosque (accès aux numéros, strips et archives du journal)
 * 3. Vidéos (capsules humoristiques, micro-trottoirs et sketchs)
 * 4. Jeux (quiz satiriques, jeu des 7 erreurs, mots croisés afro-politiques)
 * 5. Mon compte (espace profil vanneur, gestion des Gbich Coins et favoris)
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedHomeScreen } from '../screens/FeedHomeScreen';
import { KiosqueScreen } from '../screens/KiosqueScreen';
import { VideosScreen } from '../screens/VideosScreen';
import { GamesHubScreen } from '../screens/GamesHubScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { GBICH_COLORS } from '../theme/tokens';

export type MainTabParamList = {
  Home: undefined;
  Kiosk: undefined;
  Videos: undefined;
  Games: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8E5E2',
          borderTopWidth: 1.5,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          ...Platform.select({
            web: {
              boxShadow: '0px -2px 10px rgba(0,0,0,0.06)',
            } as any,
            default: {
              elevation: 8,
            },
          }),
        },
        tabBarActiveTintColor: GBICH_COLORS.primary, // #F5222D
        tabBarInactiveTintColor: '#4A4543',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={FeedHomeScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'flame' : 'flame-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Kiosk"
        component={KiosqueScreen}
        options={{
          tabBarLabel: "Kiosque",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Videos"
        component={VideosScreen}
        options={{
          tabBarLabel: "Vidéos",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'play-circle' : 'play-circle-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Games"
        component={GamesHubScreen}
        options={{
          tabBarLabel: "Jeux",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'game-controller' : 'game-controller-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Compte",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
