/**
 * GBICH'APP — Écran Kiosque (Archives, Numéros & Strips BD).
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { GBICH_COLORS } from '../theme/tokens';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';

export const KiosqueScreen: React.FC = () => {
  return (
    <ComicHalftoneBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* En-tête Kiosque */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>ARCHIVES & ÉDITIONS SPÉCIALES</Text>
            </View>
          </View>
          <Text style={styles.title}>LE KIOSQUE GBICH!</Text>
          <Text style={styles.subtitle}>
            Retrouvez tous les numéros collector, strips légendaires et hors-séries depuis 1999.
          </Text>
        </View>

        {/* Carte Numéro Récent */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>DERNIÈRE PARUTION</Text>
            <Text style={styles.cardPrice}>100 COINS</Text>
          </View>
          <Text style={styles.cardTitle}>N° 342 • LE RETOUR DE CAUPHY GOMBO</Text>
          <Text style={styles.cardDesc}>
            Spécial scandale foncier & affaire de visas : 16 pages de caricatures décapantes et de rires garantis.
          </Text>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
            <Text style={styles.actionBtnText}>FEUILLETER LE NUMÉRO 📖</Text>
          </TouchableOpacity>
        </View>

        {/* Section Archives */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.redDot} />
          <Text style={styles.sectionTitle}>COLLECTIONS POPULAIRES</Text>
        </View>

        <View style={styles.collectionGrid}>
          <View style={styles.miniCard}>
            <Text style={styles.miniCardEmoji}>⚖️</Text>
            <Text style={styles.miniCardTitle}>Cauphy Gombo</Text>
            <Text style={styles.miniCardSub}>42 Strips</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniCardEmoji}>🥊</Text>
            <Text style={styles.miniCardTitle}>Jo Bleck</Text>
            <Text style={styles.miniCardSub}>35 Strips</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniCardEmoji}>👮🏾‍♂️</Text>
            <Text style={styles.miniCardTitle}>Sergent Gazeur</Text>
            <Text style={styles.miniCardSub}>28 Strips</Text>
          </View>
        </View>
      </ScrollView>
    </ComicHalftoneBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 70,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pillBadge: {
    backgroundColor: '#171416',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  pillBadgeText: {
    color: '#FAF7F2',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#555250',
    lineHeight: 18,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171416',
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #171416' } as any,
      default: {
        shadowColor: '#171416',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTag: {
    fontSize: 11,
    color: '#F5222D',
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  cardPrice: {
    fontSize: 11,
    color: '#171416',
    fontWeight: '800',
    backgroundColor: '#FFF1F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#F5222D',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  cardDesc: {
    fontSize: 12,
    color: '#555250',
    lineHeight: 17,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    marginBottom: 14,
  },
  actionBtn: {
    backgroundColor: '#F5222D',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#171416',
    paddingVertical: 10,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px #171416', cursor: 'pointer' } as any,
      default: { elevation: 2 },
    }),
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    letterSpacing: 0.5,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5222D',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    textTransform: 'uppercase',
  },
  collectionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#171416',
    padding: 12,
    alignItems: 'center',
  },
  miniCardEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  miniCardTitle: {
    fontSize: 12,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    textAlign: 'center',
  },
  miniCardSub: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
  },
});
