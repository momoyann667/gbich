/**
 * GBICH'APP — Écran Vidéos (Capsules humoristiques, Micro-trottoirs & Sketchs).
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';

export const VideosScreen: React.FC = () => {
  return (
    <ComicHalftoneBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* En-tête Vidéos */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>CAPSULES & MICRO-TROTTOIRS</Text>
            </View>
          </View>
          <Text style={styles.title}>VIDÉOS GBICH!</Text>
          <Text style={styles.subtitle}>
            Le rire ivoirien en format court : punchlines de rue, satires politiques et gags exclusifs.
          </Text>
        </View>

        {/* Vidéo à la Une */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>EN TENDANCE 🔥</Text>
            <Text style={styles.duration}>0:45</Text>
          </View>
          <Image
            source={require('../../assets/video_plateau.png')}
            style={styles.videoThumb}
            resizeMode="cover"
          />
          <Text style={styles.cardTitle}>
            MICRO-TROTTOIR PLATEAU : TU PRÉFÈRES L'AMOUR SINCÈRE OU LE GARBA CHAUD ?
          </Text>
          <Text style={styles.cardDesc}>
            Les réponses hilarantes des étudiants et des cadres d'Abidjan sous le soleil de midi.
          </Text>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.85}>
            <Text style={styles.playBtnText}>LANCER LA CAPSULE ▶</Text>
          </TouchableOpacity>
        </View>

        {/* Section Séries Vidéos */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.redDot} />
          <Text style={styles.sectionTitle}>PLAYLISTS VANNES</Text>
        </View>

        <View style={styles.playlistRow}>
          <View style={styles.playlistCard}>
            <Text style={styles.playlistIcon}>🎤</Text>
            <Text style={styles.playlistTitle}>Micro-Trottoirs</Text>
            <Text style={styles.playlistCount}>18 Épisodes</Text>
          </View>
          <View style={styles.playlistCard}>
            <Text style={styles.playlistIcon}>🎭</Text>
            <Text style={styles.playlistTitle}>Gags & Sketchs</Text>
            <Text style={styles.playlistCount}>24 Épisodes</Text>
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
    backgroundColor: '#F5222D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  pillBadgeText: {
    color: '#FFFFFF',
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
    backgroundColor: '#171416',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171416',
    padding: 14,
    marginBottom: 24,
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #F5222D' } as any,
      default: {
        shadowColor: '#F5222D',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 0,
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTag: {
    fontSize: 11,
    color: '#FFCC00',
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  duration: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  videoThumb: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#FFFFFF',
    marginBottom: 6,
    textTransform: 'uppercase',
    lineHeight: 22,
  },
  cardDesc: {
    fontSize: 12,
    color: '#CCCCCC',
    lineHeight: 17,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    marginBottom: 14,
  },
  playBtn: {
    backgroundColor: '#F5222D',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    paddingVertical: 10,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  playBtnText: {
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
  playlistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  playlistCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#171416',
    padding: 14,
    alignItems: 'center',
  },
  playlistIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  playlistTitle: {
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    textAlign: 'center',
  },
  playlistCount: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
  },
});
