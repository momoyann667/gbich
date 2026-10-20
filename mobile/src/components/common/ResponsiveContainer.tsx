/**
 * GBICH'APP — Responsive Container Layout.
 *
 * Assure un affichage optimal et centré sur ordinateurs / tablettes,
 * et fluide plein-écran sur smartphones.
 */

import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.inner,
          isLargeScreen && styles.innerLarge,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#121212',
    overflow: 'hidden',
  },
  innerLarge: {
    maxWidth: 540,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#262626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
});
