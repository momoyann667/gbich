/**
 * GBICH'APP — Header Satirique Commun (GbichHeader).
 *
 * Affiche sur chaque écran sélectionné :
 * - À gauche : Logo officiel GBICH! + Nom de la page en typographie rouge (#F5222D)
 * - À droite :
 *   - Si non connecté / invité : Bouton rouge néo-brutaliste « Se connecter » (redirige vers Login)
 *   - Si connecté : Nom du profil / avatar de l'utilisateur, solde de Coins et cloche de notification
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { GBICH_COLORS } from '../../theme/tokens';

interface GbichHeaderProps {
  pageTitle: string; // Ex: "ACCUEIL", "KIOSQUE", "VIDÉOS", "JEUX"
  navigation?: any;
  showCoins?: boolean;
  onCoinsPress?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
}

export const GbichHeader: React.FC<GbichHeaderProps> = ({
  pageTitle,
  navigation,
  showCoins = true,
  onCoinsPress,
  showSearch = false,
  onSearchPress,
}) => {
  const { user, isAuthenticated, isGuest } = useAuthStore();

  const handleGoToLogin = () => {
    navigation?.navigate('Login');
  };

  const handleGoToProfile = () => {
    navigation?.navigate('Profile');
  };

  const handleNotificationPress = () => {
    if (Platform.OS === 'web') {
      window.alert('🔔 3 nouvelles vannes et strips croustillants au Djassa !');
    } else {
      Alert.alert('Notifications', '3 nouvelles vannes et strips croustillants au Djassa !');
    }
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerInner}>
        {/* Partie Gauche : Logo officiel GBICH! + Nom de la page en rouge */}
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Home')}
          >
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.separator} />
          <Text style={styles.pageTitleText}>{pageTitle}</Text>
        </View>

        {/* Partie Droite : Invité (Se connecter) OU Connecté (Nom profil + Coins + Notif) */}
        <View style={styles.headerRight}>
          {!isAuthenticated || isGuest ? (
            // Mode Invité : Bouton "Se connecter" proéminent
            <TouchableOpacity
              style={styles.connectBtn}
              activeOpacity={0.85}
              onPress={handleGoToLogin}
            >
              <Ionicons
                name="person-circle-outline"
                size={17}
                color="#FFFFFF"
                style={styles.connectBtnIcon}
              />
              <Text style={styles.connectBtnText}>Se connecter</Text>
            </TouchableOpacity>
          ) : (
            // Mode Connecté : Solde de coins + Recherche optionnelle + Cloche + Nom & Avatar
            <View style={styles.authCluster}>
              {showCoins && (
                <TouchableOpacity
                  style={styles.coinPill}
                  activeOpacity={0.8}
                  onPress={onCoinsPress || (() => navigation?.navigate('Home'))}
                >
                  <Text style={styles.coinPillIcon}>🪙</Text>
                  <Text style={styles.coinPillAmount}>450</Text>
                </TouchableOpacity>
              )}

              {showSearch && onSearchPress && (
                <TouchableOpacity
                  style={styles.iconBtn}
                  activeOpacity={0.75}
                  onPress={onSearchPress}
                >
                  <Ionicons name="search" size={18} color="#171416" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.iconBtn}
                activeOpacity={0.75}
                onPress={handleNotificationPress}
              >
                <Ionicons name="notifications-outline" size={18} color="#171416" />
                <View style={styles.notifDot} />
              </TouchableOpacity>

              {/* Badge Profil avec le NOM de l'utilisateur de la base de données */}
              <TouchableOpacity
                style={styles.profileBadgeBtn}
                activeOpacity={0.85}
                onPress={handleGoToProfile}
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : '👤'}
                  </Text>
                </View>
                <Text style={styles.profileUsername} numberOfLines={1}>
                  {user?.username || 'Mon Profil'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E8E5E2',
    alignItems: 'center',
    zIndex: 20,
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  headerInner: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 44 : 10,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 82,
    height: 30,
  },
  separator: {
    width: 1.5,
    height: 18,
    backgroundColor: '#E0DCD6',
  },
  pageTitleText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: GBICH_COLORS.primary, // #F5222D
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GBICH_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#171416',
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px #171416', cursor: 'pointer' } as any,
      default: { elevation: 2 },
    }),
  },
  connectBtnIcon: {
    marginRight: 4,
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.3,
  },
  authCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E8E5E2',
  },
  coinPillIcon: {
    fontSize: 11,
    marginRight: 3,
  },
  coinPillAmount: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#171416',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F7F4EE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GBICH_COLORS.primary,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  profileBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    paddingVertical: 2,
    paddingHorizontal: 4,
    paddingRight: 8,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#171416',
    maxWidth: 120,
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GBICH_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
  },
  profileUsername: {
    fontSize: 11,
    fontWeight: '800',
    color: '#171416',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
});
