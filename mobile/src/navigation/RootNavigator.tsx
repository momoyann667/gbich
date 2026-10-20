/**
 * GBICH'APP — Root Navigation Container.
 */

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { SplashScreen } from '../screens/SplashScreen';
import { GBICH_COLORS } from '../theme/tokens';

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GbichNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FAF7F2',
    card: '#FFFFFF',
    text: GBICH_COLORS.secondary,
    border: '#171416',
    primary: GBICH_COLORS.primary,
  },
};

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={GbichNavTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
