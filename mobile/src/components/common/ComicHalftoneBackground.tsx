import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

interface ComicHalftoneBackgroundProps {
  children?: React.ReactNode;
}

/**
 * Arrière-plan Comic Brutalism fidèle à GBICH! :
 * - Trame halftone discrète (grille de micro-croix régulières)
 * - Faisceaux dynamiques en soleil satirique (comic burst)
 * - Onomatopées en filigrane (GBICH!, TCHROUO!, POW!, Y'A DRAP!)
 */
export const ComicHalftoneBackground: React.FC<ComicHalftoneBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* 1. Motif de trame Halftone en arrière-plan */}
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

      {/* 3. Filigranes Onomatopées Comic d'Abidjan */}
      <View pointerEvents="none" style={styles.watermarkLayer}>
        <Text style={[styles.watermarkText, styles.watermarkGbich1]}>GBICH!</Text>
        <Text style={[styles.watermarkText, styles.watermarkTchrouo]}>TCHROUO!</Text>
        <Text style={[styles.watermarkText, styles.watermarkGbich2]}>GBICH!</Text>
        <Text style={[styles.watermarkText, styles.watermarkPow]}>POW!</Text>
      </View>

      {/* Contenu principal de l'écran */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2', // Fond papier journal chaud
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
    color: '#171416',
    letterSpacing: 2,
  },
  watermarkGbich1: {
    top: 60,
    left: 16,
    fontSize: 52,
    opacity: 0.04,
    transform: [{ rotate: '-8deg' }],
  },
  watermarkTchrouo: {
    top: '36%',
    right: -10,
    fontSize: 42,
    opacity: 0.035,
    transform: [{ rotate: '12deg' }],
  },
  watermarkGbich2: {
    bottom: 160,
    left: -12,
    fontSize: 64,
    opacity: 0.05,
    transform: [{ rotate: '-4deg' }],
  },
  watermarkPow: {
    top: '52%',
    left: '4%',
    fontSize: 38,
    opacity: 0.03,
    transform: [{ rotate: '15deg' }],
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});
