/**
 * GBICH'APP — Main Tab Navigator (5 Onglets Satiriques).
 *
 * Utilise un Custom TabBar 100% maîtrisé pour garantir :
 * - Aucune troncature des textes ("Accueil", "Kiosque", etc.) sur TOUS smartphones
 * - Respect dynamique des zones de sécurité (safe area insets / barre de gestes mobile)
 * - Accent rouge satirique #F5222D et icône de flamme sur Accueil actif
 */

import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

// Configuration des 5 onglets avec leurs icônes et intitulés
const TAB_CONFIG: Record<
  string,
  { label: string; activeIcon: keyof typeof Ionicons.glyphMap; inactiveIcon: keyof typeof Ionicons.glyphMap }
> = {
  Home: {
    label: 'Accueil',
    activeIcon: 'flame',
    inactiveIcon: 'flame-outline',
  },
  Kiosk: {
    label: 'Kiosque',
    activeIcon: 'book',
    inactiveIcon: 'book-outline',
  },
  Videos: {
    label: 'Vidéos',
    activeIcon: 'play-circle',
    inactiveIcon: 'play-circle-outline',
  },
  Games: {
    label: 'Jeux',
    activeIcon: 'game-controller',
    inactiveIcon: 'game-controller-outline',
  },
  Profile: {
    label: 'Compte',
    activeIcon: 'person-circle',
    inactiveIcon: 'person-circle-outline',
  },
};

/**
 * Composant Custom TabBar garantissant une visibilité parfaite
 * et une marge inférieure généreuse au-dessus de la barre de geste du téléphone.
 */
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  // Marge inférieure de sécurité : au moins 22px pour dégager totalement les textes
  const bottomInset = Math.max(insets.bottom, 22);

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: bottomInset }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name] || {
          label: route.name,
          activeIcon: 'ellipse',
          inactiveIcon: 'ellipse-outline',
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const color = isFocused ? GBICH_COLORS.primary : '#4A4543';

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.75}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Ionicons
              name={isFocused ? config.activeIcon : config.inactiveIcon}
              size={23}
              color={color}
            />
            <Text
              style={[
                styles.tabLabel,
                { color },
                isFocused && styles.tabLabelActive,
              ]}
              numberOfLines={1}
            >
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={FeedHomeScreen} />
      <Tab.Screen name="Kiosk" component={KiosqueScreen} />
      <Tab.Screen name="Videos" component={VideosScreen} />
      <Tab.Screen name="Games" component={GamesHubScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E8E5E2',
    paddingTop: 8,
    alignItems: 'flex-start',
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0px -3px 12px rgba(0,0,0,0.07)',
      } as any,
      default: {
        elevation: 10,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 2,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.2,
    marginTop: 3,
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: '800',
  },
});
