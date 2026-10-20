import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  Easing,
  ScrollView,
} from 'react-native';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';
import { ThreeDSphere } from '../components/common/ThreeDSphere';
import { GBICH_COLORS } from '../theme/tokens';
import { injectWebFonts } from '../utils/loadFonts';

interface OnboardingScreenProps {
  navigation?: any;
  onFinish?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
  onFinish,
}) => {
  useEffect(() => {
    injectWebFonts();
  }, []);

  // Étape courante (1 par défaut)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const hopAnim = useRef(new Animated.Value(0)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de sautillement du cartouche "Y'a pas drap !"
    const hopLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(hopAnim, {
          toValue: -7,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(hopAnim, {
          toValue: 0,
          duration: 380,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.delay(1600),
      ])
    );
    hopLoop.start();

    return () => {
      hopLoop.stop();
    };
  }, [fadeAnim, slideAnim, hopAnim]);

  // Actions de navigation
  const handleNext = () => {
    Animated.sequence([
      Animated.timing(btnScaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(btnScaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleFinish();
      }
    });
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else if (navigation?.navigate) {
      navigation.navigate('MainTabs');
    }
  };

  return (
    <ComicHalftoneBackground>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* ========================================================= */}
          {/* 1. BARRE SUPÉRIEURE : LOGO GBICH! & BOUTON PASSER         */}
          {/* ========================================================= */}
          <View style={styles.topHeader}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSkip}
              style={[styles.skipButton, Platform.OS === 'web' && ({ cursor: 'pointer' } as any)]}
            >
              <Text style={styles.skipText}>PASSER</Text>
              <Text style={styles.skipArrow}>➔</Text>
            </TouchableOpacity>
          </View>

          {/* ========================================================= */}
          {/* 2. BARRE DE PROGRESSION SEGMENTÉE (3 ÉTAPES)              */}
          {/* ========================================================= */}
          <View style={styles.segmentedProgressRow}>
            <View
              style={[
                styles.progressSegment,
                currentStep >= 1 ? styles.segmentActive : styles.segmentInactive,
              ]}
            />
            <View
              style={[
                styles.progressSegment,
                currentStep >= 2 ? styles.segmentActive : styles.segmentInactive,
              ]}
            />
            <View
              style={[
                styles.progressSegment,
                currentStep >= 3 ? styles.segmentActive : styles.segmentInactive,
              ]}
            />
          </View>

          {/* ========================================================= */}
          {/* 3. CASE DE BANDE DESSINÉE PRINCIPALE (ÉTAPE 01)          */}
          {/* ========================================================= */}
          <View style={styles.comicStepWrapper}>
            {/* Tag Étape au-dessus de la case */}
            <View style={styles.stepTagBadge}>
              <Text style={styles.stepTagText}>ÉTAPE 01 • CARICATURES & STRIPS</Text>
            </View>

            {/* Cadre de la case BD avec illustration */}
            <View style={styles.comicPanelCard}>
              {/* Sphère 3D rouge en accent chevauchant le coin supérieur droit */}
              <ThreeDSphere
                size={34}
                colorVariant="red"
                floatDistance={5}
                floatDuration={2200}
                style={styles.panelSphere}
              />

              {/* Conteneur de l'image de l'atelier */}
              <View style={styles.illustrationWrapper}>
                <Image
                  source={require('../../assets/image_onboarding_1.png')}
                  style={styles.illustrationImage}
                  resizeMode="cover"
                />

                {/* Cartouche dynamique "Y'A PAS DRAP ! ⚡" avec animation de sautillement */}
                <Animated.View
                  style={[
                    styles.drapCartouche,
                    {
                      transform: [{ translateY: hopAnim }],
                    },
                  ]}
                >
                  <Text style={styles.drapText}>Y'A PAS DRAP ! ⚡</Text>
                </Animated.View>

                {/* Sticker Onomatopée "KPAN !" en bas à droite */}
                <View style={styles.kpanSticker}>
                  <Text style={styles.kpanText}>KPAN !</Text>
                </View>
              </View>

              {/* Contenu textuel sous l'illustration (Règle 70/30) */}
              <View style={styles.cardTextContent}>
                {/* Titraille percutante Anton */}
                <Text style={styles.headlineTitle}>
                  <Text style={styles.headlineBlack}>RIRE DE TOUT, </Text>
                  <Text style={styles.headlineRed}>CHAQUE MATIN !</Text>
                </Text>

                {/* Texte concis, piquant et soigné en Inter */}
                <Text style={styles.bodyDescription}>
                  Retrouvez les célèbres caricaturistes de GBICH!, les strips
                  exclusifs, l'humour d'Abidjan et le regard satirique sans filtre
                  sur l'actu africaine.
                </Text>
              </View>
            </View>
          </View>

          {/* ========================================================= */}
          {/* 4. APERÇU DES ÉTAPES SUIVANTES                            */}
          {/* ========================================================= */}
          <View style={styles.previewSection}>
            <View style={styles.previewHeaderRow}>
              <Text style={styles.previewBookIcon}>📖</Text>
              <Text style={styles.previewHeaderText}>
                À DÉCOUVRIR ENSUITE DANS L'APPLICATION
              </Text>
            </View>

            <View style={styles.miniCardsRow}>
              {/* Mini-carte Étape 2 : Vidéos & Punchlines */}
              <View style={styles.miniCard}>
                <View style={styles.miniNumberCircle}>
                  <Text style={styles.miniNumberText}>2</Text>
                </View>
                <View style={styles.miniCardTexts}>
                  <Text style={styles.miniTitle} numberOfLines={1}>
                    Vidéos & Punchlines
                  </Text>
                  <Text style={styles.miniSub} numberOfLines={1}>
                    Gags & micro-trottoir
                  </Text>
                </View>
              </View>

              {/* Mini-carte Étape 3 : Jeux & Quiz 7 erreurs */}
              <View style={styles.miniCard}>
                <View style={styles.miniNumberCircle}>
                  <Text style={styles.miniNumberText}>3</Text>
                </View>
                <View style={styles.miniCardTexts}>
                  <Text style={styles.miniTitle} numberOfLines={1}>
                    Jeux & Quiz 7 erreurs
                  </Text>
                  <Text style={styles.miniSub} numberOfLines={1}>
                    Défis caustiques 2...
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ========================================================= */}
          {/* 5. BOUTONS D'ACCESSIBILITÉ SANS FRICTION                  */}
          {/* ========================================================= */}
          <View style={styles.actionButtonsSection}>
            {/* Bouton principal : SUIVANT 1/3 */}
            <Animated.View style={{ transform: [{ scale: btnScaleAnim }] }}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleNext}
                style={[
                  styles.primaryNextBtn,
                  Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                ]}
              >
                <Text style={styles.nextBtnText}>SUIVANT</Text>
                <View style={styles.stepCounterBadge}>
                  <Text style={styles.stepCounterText}>1/3</Text>
                </View>
                <Text style={styles.nextBtnArrow}>➔</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Bouton secondaire : Créer un compte ou entrer en invité */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleFinish}
              style={[
                styles.guestBtn,
                Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
              ]}
            >
              <Text style={styles.guestIcon}>👤</Text>
              <Text style={styles.guestBtnText}>
                Créer un compte ou entrer en invité
              </Text>
            </TouchableOpacity>

            {/* Mention de réassurance sans barrière */}
            <Text style={styles.reassuranceText}>
              Accès gratuit et instantané • Aucune carte bancaire requise
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </ComicHalftoneBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 18 : 42,
    paddingBottom: 24,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 420,
    gap: 12,
  },

  // 1. Barre supérieure
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },
  headerLogo: {
    width: 65,
    height: 34,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B1D',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
  },
  skipText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  skipArrow: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // 2. Barres de progression segmentées
  segmentedProgressRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
    marginVertical: 4,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 9999,
  },
  segmentActive: {
    backgroundColor: '#F5222D',
  },
  segmentInactive: {
    backgroundColor: '#DCD9D7',
  },

  // 3. Case BD Étape 1
  comicStepWrapper: {
    width: '100%',
    position: 'relative',
    marginTop: 4,
  },
  stepTagBadge: {
    backgroundColor: '#1E1B1D',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: -6,
    zIndex: 10,
    marginLeft: 12,
  },
  stepTagText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  comicPanelCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 18,
    overflow: 'visible',
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    position: 'relative',
  },
  panelSphere: {
    position: 'absolute',
    top: -12,
    right: -8,
    zIndex: 15,
  },
  illustrationWrapper: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FAF7F2',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  drapCartouche: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 12,
  },
  drapText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    color: '#B70014',
    letterSpacing: 0.6,
  },
  kpanSticker: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#B70014',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    transform: [{ rotate: '-6deg' }],
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 12,
  },
  kpanText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.8,
    fontWeight: '900',
  },
  cardTextContent: {
    padding: 14,
    gap: 8,
  },
  headlineTitle: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  headlineBlack: {
    color: '#171416',
  },
  headlineRed: {
    color: '#B70014',
  },
  bodyDescription: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12.5,
    lineHeight: 18,
    color: '#4A4648',
    fontWeight: '500',
  },

  // 4. Aperçu des étapes suivantes
  previewSection: {
    width: '100%',
    gap: 6,
    marginTop: 2,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 2,
  },
  previewBookIcon: {
    fontSize: 13,
  },
  previewHeaderText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 10,
    fontWeight: '700',
    color: '#B70014',
    letterSpacing: 0.5,
  },
  miniCardsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  miniCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE8E5',
    borderWidth: 1.5,
    borderColor: '#D4D0CC',
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  miniNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DCD9D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniNumberText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#171416',
  },
  miniCardTexts: {
    flex: 1,
  },
  miniTitle: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 10.5,
    fontWeight: '700',
    color: '#171416',
  },
  miniSub: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 9,
    color: '#625D5F',
    fontWeight: '500',
  },

  // 5. Boutons d'Action
  actionButtonsSection: {
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  primaryNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B70014',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 20,
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 10,
  },
  nextBtnText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  stepCounterBadge: {
    backgroundColor: '#8B0010',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  stepCounterText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  nextBtnArrow: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EDEA',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 16,
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    gap: 8,
  },
  guestIcon: {
    fontSize: 14,
  },
  guestBtnText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '700',
    color: '#171416',
  },
  reassuranceText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 9.5,
    color: '#888482',
    textAlign: 'center',
    fontWeight: '500',
  },
});
