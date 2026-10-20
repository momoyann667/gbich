/**
 * GBICH'APP — Feed Home Screen (Socle Technique).
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { apiClient } from '../api/client';

export const FeedHomeScreen: React.FC = () => {
  const [apiHealth, setApiHealth] = useState<string>('Vérification en cours...');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get('/health')
      .then((res) => {
        if (isMounted) {
          setApiHealth(`En ligne (${res.data.status}) — v${res.data.version}`);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setApiHealth(`API non jointe (${err.message || 'Hors ligne'})`);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>SOCLE TECHNIQUE INITIALISÉ</Text>
      </View>
      <Text style={styles.title}>GBICH'APP</Text>
      <Text style={styles.subtitle}>
        Journal satirique & ludo-éducatif ivoirien
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Statut de l'Environnement</Text>
        <Text style={styles.cardItem}>• Plateforme : {Platform.OS} (PWA Web)</Text>
        <Text style={styles.cardItem}>• Moteur : React Native Web + Expo</Text>
        <Text style={styles.cardItem}>
          • Backend API : {loading ? 'Connexion...' : apiHealth}
        </Text>
        <Text style={styles.cardItem}>• Mode d'affichage : Standalone PWA</Text>
        <Text style={styles.cardItem}>• Service Worker : Configuré & Actif</Text>
      </View>
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
  badge: {
    backgroundColor: '#2A2000',
    borderColor: '#FFCC00',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeText: {
    color: '#FFCC00',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
    paddingBottom: 8,
  },
  cardItem: {
    color: '#CCCCCC',
    fontSize: 13,
    lineHeight: 22,
  },
});
