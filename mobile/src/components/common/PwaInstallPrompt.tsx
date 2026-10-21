/**
 * GBICH'APP — PWA Installation Prompt & Mobile Guide.
 * 
 * Invite l'utilisateur à installer l'application PWA sur son téléphone :
 * - Déclenchement automatique du prompt natif sur Android (Chrome, Edge, Samsung Internet)
 * - Guide illustré pas-à-pas pour iOS (Safari / iPhone & iPad)
 * - Détection automatique du mode standalone (ne s'affiche pas si déjà installée)
 * - Mode réduit avec pastille flottante discrète si l'utilisateur choisit "Plus tard".
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Animated,
  Modal,
} from 'react-native';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Animation d'apparition
  const slideAnim = useState(new Animated.Value(60))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    // 1. Détection du mode Standalone (PWA déjà installée)
    const checkStandalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      (window.navigator as any).standalone === true;

    setIsStandalone(checkStandalone);
    if (checkStandalone) {
      return; // Déjà installée, aucune invitation nécessaire
    }

    // 2. Détection appareil mobile et OS
    const ua = navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    const mobileDevice = /iphone|ipad|ipod|android|mobile/.test(ua) || window.innerWidth < 768;

    setIsIOS(iosDevice);
    setIsMobile(mobileDevice);

    // 3. Écoute de l'événement PWA standard (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Vérifier si l'utilisateur ne l'a pas déjà masqué récemment dans la session
      const dismissed = sessionStorage.getItem('gbich_pwa_dismissed');
      if (dismissed === 'true') {
        setIsMinimized(true);
      } else {
        // Petit délai pour laisser l'écran initial se charger avant d'afficher l'invitation
        setTimeout(() => {
          setIsVisible(true);
        }, 1200);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Cas iOS Safari : Pas de beforeinstallprompt natif, afficher le guide sur mobile Safari
    if (iosDevice && !checkStandalone) {
      const dismissed = sessionStorage.getItem('gbich_pwa_dismissed');
      if (dismissed === 'true') {
        setIsMinimized(true);
      } else {
        setTimeout(() => {
          setIsVisible(true);
        }, 1500);
      }
    }

    // 5. Événement de confirmation d'installation
    const handleAppInstalled = () => {
      setIsVisible(false);
      setIsMinimized(false);
      setIsStandalone(true);
      console.log('[GBICH! PWA] Application installée avec succès sur le téléphone !');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, fadeAnim, slideAnim]);

  // Si l'app est déjà en standalone (installée) ou non web, ne rien afficher
  if (Platform.OS !== 'web' || isStandalone) {
    return null;
  }

  // Déclenchement de l'installation native Android
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
        setIsMinimized(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsMinimized(true);
    try {
      sessionStorage.setItem('gbich_pwa_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  const handleReopen = () => {
    setIsMinimized(false);
    setIsVisible(true);
  };

  return (
    <>
      {/* 1. Modal / Bottom Sheet d'invitation à l'installation */}
      {isVisible && (
        <View style={styles.overlayBackdrop}>
          <Animated.View
            style={[
              styles.modalCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header / Badge satirique */}
            <View style={styles.badgeRow}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>📲 APPLICATION OFFICIELLE GBICH!</Text>
              </View>
              <TouchableOpacity
                onPress={handleDismiss}
                style={styles.closeRoundBtn}
                accessibilityLabel="Fermer"
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Titre & Icône */}
            <View style={styles.heroRow}>
              <Image
                source={require('../../../assets/favicon.png')}
                style={styles.appIcon as any}
                resizeMode="contain"
              />
              <View style={styles.heroTextCol}>
                <Text style={styles.heroTitle}>METS GBICH! SUR TON TÉLÉPHONE !</Text>
                <Text style={styles.heroSubtitle}>
                  Plus rapide qu'un taxi wôrô-wôrô ! Pas besoin d'ouvrir le navigateur ! 🚀
                </Text>
              </View>
            </View>

            {/* Avantages satiriques */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>⚡</Text>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>Accès direct & Plein écran</Text>
                  <Text style={styles.benefitDesc}>
                    Retrouve l'icône GBICH! sur ton écran d'accueil sans barre d'adresse.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>📴</Text>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>Mode Hors-Ligne</Text>
                  <Text style={styles.benefitDesc}>
                    Lis les caricatures et gags même sans forfait data actif.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🎭</Text>
                <View style={styles.benefitTextCol}>
                  <Text style={styles.benefitTitle}>100% Gratuit & Léger</Text>
                  <Text style={styles.benefitDesc}>
                    S'installe instantanément sans encombrer la mémoire de ton téléphone.
                  </Text>
                </View>
              </View>
            </View>

            {/* Guide selon la plateforme : Android vs iOS */}
            {isIOS ? (
              /* Instructions iOS Safari */
              <View style={styles.iosGuideBox}>
                <Text style={styles.iosGuideHeader}>👉 COMMENT INSTALLER SUR TON IPHONE :</Text>
                <View style={styles.iosStepRow}>
                  <View style={styles.stepNumCircle}><Text style={styles.stepNumText}>1</Text></View>
                  <Text style={styles.iosStepText}>
                    Touche le bouton <Text style={styles.boldUnderline}>Partager</Text> (icône carrée avec flèche <Text style={styles.shareSymbol}>⎋</Text> au bas de Safari).
                  </Text>
                </View>
                <View style={styles.iosStepRow}>
                  <View style={styles.stepNumCircle}><Text style={styles.stepNumText}>2</Text></View>
                  <Text style={styles.iosStepText}>
                    Fais défiler vers le bas et touche <Text style={styles.boldUnderline}>« Sur l'écran d'accueil » ➕</Text>.
                  </Text>
                </View>
                <View style={styles.iosStepRow}>
                  <View style={styles.stepNumCircle}><Text style={styles.stepNumText}>3</Text></View>
                  <Text style={styles.iosStepText}>
                    Touche <Text style={styles.boldUnderline}>« Ajouter »</Text> en haut à droite. C'est chicot ! 🎯
                  </Text>
                </View>
              </View>
            ) : deferredPrompt ? (
              /* Bouton natif Android */
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleInstallClick}
                style={styles.installButton}
              >
                <Text style={styles.installButtonText}>📲 INSTALLER SUR MON TÉLÉPHONE</Text>
              </TouchableOpacity>
            ) : (
              /* Android sans prompt automatique (ou Chrome Desktop) : instructions */
              <View style={styles.iosGuideBox}>
                <Text style={styles.iosGuideHeader}>👉 COMMENT INSTALLER :</Text>
                <Text style={styles.iosStepText}>
                  Touche les 3 points <Text style={styles.boldUnderline}>⋮</Text> en haut à droite du navigateur puis choisis <Text style={styles.boldUnderline}>« Installer l'application »</Text> ou <Text style={styles.boldUnderline}>« Ajouter à l'écran d'accueil »</Text>.
                </Text>
              </View>
            )}

            {/* Bouton secondaire Plus tard */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDismiss}
              style={styles.laterButton}
            >
              <Text style={styles.laterButtonText}>Continuer sur le navigateur (Plus tard)</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* 2. Pastille flottante réduite quand l'utilisateur ferme l'invitation */}
      {isMinimized && !isVisible && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleReopen}
          style={styles.floatingPill}
          accessibilityLabel="Installer l'application"
        >
          <Text style={styles.floatingPillIcon}>📲</Text>
          <Text style={styles.floatingPillText}>Installer l'app</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlayBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 20, 22, 0.65)',
    zIndex: 99999,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FAF7F2',
    borderWidth: 3,
    borderColor: '#171416',
    borderRadius: 20,
    padding: 20,
    gap: 14,
    shadowColor: '#171416',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagBadge: {
    backgroundColor: '#FFE600',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagBadgeText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 11,
    fontWeight: '800',
    color: '#171416',
    letterSpacing: 0.5,
  },
  closeRoundBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8E5E2',
    borderWidth: 2,
    borderColor: '#171416',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#171416',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#171416',
    backgroundColor: '#FFFFFF',
  },
  heroTextCol: {
    flex: 1,
    gap: 2,
  },
  heroTitle: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 19,
    lineHeight: 23,
    color: '#171416',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12,
    color: '#5E3F3C',
    lineHeight: 16,
  },
  benefitsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  benefitIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  benefitTextCol: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12.5,
    fontWeight: '800',
    color: '#171416',
  },
  benefitDesc: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11.5,
    color: '#625D5F',
    lineHeight: 15,
  },
  installButton: {
    backgroundColor: '#F5222D',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  installButtonText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  iosGuideBox: {
    backgroundColor: '#FFFBE6',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  iosGuideHeader: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '900',
    color: '#171416',
    letterSpacing: 0.5,
  },
  iosStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNumCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F5222D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  iosStepText: {
    flex: 1,
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12,
    color: '#171416',
    lineHeight: 16,
  },
  boldUnderline: {
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  shareSymbol: {
    fontSize: 15,
    fontWeight: '900',
    color: '#007AFF',
  },
  laterButton: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  laterButtonText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12,
    color: '#8C8588',
    textDecorationLine: 'underline',
  },
  floatingPill: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE600',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  floatingPillIcon: {
    fontSize: 15,
  },
  floatingPillText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '800',
    color: '#171416',
  },
});
