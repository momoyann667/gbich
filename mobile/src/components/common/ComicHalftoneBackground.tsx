import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

interface ComicHalftoneBackgroundProps {
  children?: React.ReactNode;
}

/**
 * Arrière-plan Comic Brutalism fidèle aux directives BD GBICH! :
 * - Trame halftone discrète (grille de micro-points réguliers)
 * - Faisceaux solaires satiriques (comic burst)
 * - Onomatopées stylisées avec contour noir : "GBICH!", "WOUAH!", "TCHIE!" en Anton/Bebas Neue inclinée.
 */
export const ComicHalftoneBackground: React.FC<ComicHalftoneBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* 1. Trame Halftone en arrière-plan */}
      <View
        style={[
          styles.halftoneGrid,
          Platform.OS === 'web' && (styles.webGridPattern as any),
        ]}
      />

      {/* 2. Rayons solaires satiriques (Comic Burst) */}
      <View style={styles.burstContainer}>
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((angle, idx) => (
          <View
            key={`ray-${idx}`}
            style={[
              styles.sunRay,
              {
                transform: [{ rotate: `${angle}deg` }],
              },
            ]}
          />
        ))}
      </View>

      {/* 3. Onomatopées stylisées avec contour noir : GBICH!, WOUAH!, TCHIE! */}
      <View pointerEvents="none" style={styles.watermarkLayer}>
        <Text
          style={[
            styles.watermarkText,
            styles.watermarkGbich1,
            Platform.OS === 'web' && (webWatermarkStyles.webStroke as any),
          ]}
        >
          GBICH!
        </Text>
        <Text
          style={[
            styles.watermarkText,
            styles.watermarkWouah,
            Platform.OS === 'web' && (webWatermarkStyles.webStroke as any),
          ]}
        >
          WOUAH!
        </Text>
        <Text
          style={[
            styles.watermarkText,
            styles.watermarkTchie,
            Platform.OS === 'web' && (webWatermarkStyles.webStroke as any),
          ]}
        >
          TCHIE!
        </Text>
        <Text
          style={[
            styles.watermarkText,
            styles.watermarkGbich2,
            Platform.OS === 'web' && (webWatermarkStyles.webStroke as any),
          ]}
        >
          GBICH!
        </Text>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    position: 'relative',
    overflow: 'hidden',
  },
  halftoneGrid: {
    ...StyleSheet.absoluteFill,
    opacity: 0.35,
  },
  webGridPattern: {
    backgroundImage: `
      radial-gradient(#171416 0.85px, transparent 0.85px),
      radial-gradient(#171416 0.85px, #FAF7F2 0.85px)
    `,
    backgroundSize: '24px 24px',
    backgroundPosition: '0 0, 12px 12px',
    opacity: 0.22,
  },
  burstContainer: {
    position: 'absolute',
    top: '32%',
    left: '50%',
    width: 2,
    height: 2,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  sunRay: {
    position: 'absolute',
    width: 900,
    height: 38,
    backgroundColor: 'rgba(245, 34, 45, 0.025)',
    borderRadius: 9999,
  },
  watermarkLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  watermarkText: {
    position: 'absolute',
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontWeight: '900',
    color: 'rgba(23, 20, 22, 0.05)',
    letterSpacing: 2,
  },
  watermarkGbich1: {
    top: 50,
    left: 12,
    fontSize: 54,
    transform: [{ rotate: '-10deg' }],
  },
  watermarkWouah: {
    top: '35%',
    right: -10,
    fontSize: 46,
    transform: [{ rotate: '12deg' }],
  },
  watermarkTchie: {
    top: '52%',
    left: '3%',
    fontSize: 42,
    transform: [{ rotate: '-8deg' }],
  },
  watermarkGbich2: {
    bottom: 160,
    right: 8,
    fontSize: 60,
    transform: [{ rotate: '8deg' }],
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});

const webWatermarkStyles = {
  webStroke: {
    WebkitTextStroke: '1.2px rgba(23, 20, 22, 0.12)',
    color: 'transparent',
  },
};
