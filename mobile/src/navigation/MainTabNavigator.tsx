/**
 * GBICH'APP — Main Tab Navigator.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { FeedHomeScreen } from '../screens/FeedHomeScreen';
import { EmiScreen } from '../screens/EmiScreen';
import { GamesHubScreen } from '../screens/GamesHubScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type MainTabParamList = {
  Feed: undefined;
  EMI: undefined;
  Games: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
          borderBottomColor: '#262626',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '800',
          letterSpacing: 1,
        },
        tabBarStyle: {
          backgroundColor: '#181818',
          borderTopColor: '#262626',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FFCC00',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedHomeScreen}
        options={{
          title: "GBICH!",
          tabBarLabel: "Journal",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📰</Text>,
        }}
      />
      <Tab.Screen
        name="EMI"
        component={EmiScreen}
        options={{
          title: "Vrai ou Faux ?",
          tabBarLabel: "Fact-Check",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Games"
        component={GamesHubScreen}
        options={{
          title: "L'Espace Jeux",
          tabBarLabel: "Jeux",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🎮</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Mon Compte",
          tabBarLabel: "Profil",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
