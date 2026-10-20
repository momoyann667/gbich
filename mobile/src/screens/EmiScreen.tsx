/**
 * GBICH'APP — EMI Screen (Socle Technique).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EmiScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Éducation aux Médias (EMI)</Text>
      <Text style={styles.desc}>
        Socle technique configuré — Modules interactifs "Vrai ou Faux" et Vidéo 9:16 prêts pour la phase d'implémentation métier.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 20,
  },
});
