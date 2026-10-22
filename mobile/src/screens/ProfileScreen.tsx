/**
 * GBICH'APP — Écran Mon Compte (Profil vanneur, Gestion des Gbich Coins & Favoris).
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';

interface ProfileScreenProps {
  navigation?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, isAuthenticated, isGuest, logout } = useAuthStore();

  const handleGoToLogin = () => {
    navigation?.navigate('Login');
  };

  return (
    <ComicHalftoneBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* En-tête Profil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.username ? user.username.substring(0, 2).toUpperCase() : '👤'}
            </Text>
          </View>
          <Text style={styles.username}>
            {isAuthenticated ? user?.username : 'Lecteur Invité'}
          </Text>
          <Text style={styles.userRole}>
            {isAuthenticated ? '★ Gbicheur Certifié' : 'Mode Découverte Sans Compte'}
          </Text>
        </View>

        {/* Si non connecté ou invité : Bannière d'invitation à se connecter */}
        {(!isAuthenticated || isGuest) && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestBannerTitle}>REJOINS LE CLAN DES VANNEURS !</Text>
            <Text style={styles.guestBannerDesc}>
              Connecte-toi ou crée un compte gratuit pour sauvegarder tes favoris, voter et débloquer tes Gbich Coins.
            </Text>
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={handleGoToLogin}
            >
              <Text style={styles.loginBtnText}>SE CONNECTER / S'INSCRIRE ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Solde de Coins */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>SOLDE D'ENJAILLEMENT</Text>
            <TouchableOpacity style={styles.rechargeBtn} activeOpacity={0.85}>
              <Text style={styles.rechargeBtnText}>✚ Recharger</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.coinAmount}>1 250 COINS</Text>
          <Text style={styles.coinNote}>
            Utilisables pour débloquer les numéros collector et défis jeux.
          </Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
            <Text style={styles.menuIcon}>❤️</Text>
            <Text style={styles.menuTitle}>Mes Strips & BD Favoris</Text>
            <Text style={styles.menuArrow}>➔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuTitle}>Notifications Satiriques</Text>
            <Text style={styles.menuArrow}>➔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
            <Text style={styles.menuIcon}>🌍</Text>
            <Text style={styles.menuTitle}>Langue & Humour Nouchi</Text>
            <Text style={styles.menuArrow}>➔</Text>
          </TouchableOpacity>
        </View>

        {isAuthenticated && (
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.85}
            onPress={() => logout()}
          >
            <Text style={styles.logoutBtnText}>SE DÉCONNECTER</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ComicHalftoneBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F5222D',
    borderWidth: 2.5,
    borderColor: '#171416',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #171416' } as any,
    }),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
  },
  username: {
    fontSize: 22,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  userRole: {
    fontSize: 12,
    color: '#777',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    marginTop: 2,
  },
  guestBanner: {
    width: '100%',
    backgroundColor: '#FFF1F0',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F5222D',
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #F5222D' } as any,
    }),
  },
  guestBannerTitle: {
    fontSize: 15,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#F5222D',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  guestBannerDesc: {
    fontSize: 12,
    color: '#555250',
    lineHeight: 17,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    marginBottom: 12,
  },
  loginBtn: {
    backgroundColor: '#F5222D',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#171416',
    paddingVertical: 10,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer', boxShadow: '2px 2px 0px #171416' } as any,
    }),
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171416',
    padding: 16,
    marginBottom: 20,
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
    marginBottom: 6,
  },
  cardTag: {
    fontSize: 10,
    color: '#777',
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  rechargeBtn: {
    backgroundColor: '#F5222D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  rechargeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  coinAmount: {
    fontSize: 26,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    marginBottom: 4,
  },
  coinNote: {
    fontSize: 11,
    color: '#777',
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
  },
  menuSection: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171416',
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#171416',
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
  },
  menuArrow: {
    fontSize: 12,
    color: '#888',
  },
  logoutBtn: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F5222D',
    paddingVertical: 12,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  logoutBtnText: {
    color: '#F5222D',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    letterSpacing: 0.5,
  },
});
