/**
 * GBICH'APP — Écran Jeux (Quiz satiriques, Jeu des 7 erreurs, Mots croisés).
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';
import { GbichHeader } from '../components/common/GbichHeader';

export const GamesHubScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  return (
    <ComicHalftoneBackground>
      <View style={styles.screenWrapper}>
        <GbichHeader pageTitle="JEUX" navigation={navigation} />
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* En-tête Jeux */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>DÉFIS QUOTIDIENS & COINS</Text>
            </View>
          </View>
          <Text style={styles.title}>L'ESPACE JEUX GBICH!</Text>
          <Text style={styles.subtitle}>
            Testez votre culture satirique ivoirienne, gagnez des Gbich Coins et défiez vos potes !
          </Text>
        </View>

        {/* Défi Phare */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>DÉFI QUOTIDIEN</Text>
            <Text style={styles.rewardText}>✪ GAGNE +50 COINS</Text>
          </View>
          <Image
            source={require('../../assets/defi_jeux.png')}
            style={styles.gameThumb}
            resizeMode="cover"
          />
          <Text style={styles.cardTitle}>LE QUIZ SATIRIQUE DES 7 ERREURS D'ABIDJAN</Text>
          <Text style={styles.cardDesc}>
            Trouvez les différences entre les promesses électorales et la réalité du goudron avant la fin du chrono !
          </Text>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.85}>
            <Text style={styles.playBtnText}>🎮 JOUER MAINTENANT 🎮</Text>
          </TouchableOpacity>
        </View>

        {/* Autres modes de jeux */}
        <View style={styles.sectionTitleRow}>
          <View style={styles.redDot} />
          <Text style={styles.sectionTitle}>AUTRES DÉFIS SATIRIQUES</Text>
        </View>

        <View style={styles.modesGrid}>
          <TouchableOpacity style={styles.modeCard} activeOpacity={0.85}>
            <Text style={styles.modeIcon}>🧩</Text>
            <Text style={styles.modeTitle}>Mots Croisés</Text>
            <Text style={styles.modeDesc}>Afro-Politique & Nouchi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeCard} activeOpacity={0.85}>
            <Text style={styles.modeIcon}>⚡</Text>
            <Text style={styles.modeTitle}>Quiz d'Actu</Text>
            <Text style={styles.modeDesc}>Le test sans pitié</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    </ComicHalftoneBackground>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    paddingTop: 16,
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
    padding: 14,
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
    marginBottom: 10,
  },
  cardTag: {
    fontSize: 11,
    color: '#F5222D',
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  rewardText: {
    fontSize: 11,
    color: '#F5222D',
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  gameThumb: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
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
  playBtn: {
    backgroundColor: '#171416',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#171416',
    paddingVertical: 12,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer', boxShadow: '2px 2px 0px #F5222D' } as any,
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
  modesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#171416',
    padding: 14,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  modeIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  modeTitle: {
    fontSize: 14,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    textAlign: 'center',
  },
  modeDesc: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    textAlign: 'center',
  },
});
