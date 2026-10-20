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
  const slideAnim = useRef(new Animated.Value(15)).current;
  const hopAnim = useRef(new Animated.Value(0)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
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
        bounces={false}
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
          {/* SECTION SUPÉRIEURE : HEADER, PROGRESSION & CASE BD        */}
          {/* ========================================================= */}
          <View style={styles.topSection}>
            {/* 1. Barre supérieure : Logo GBICH! & Bouton Passer */}
            <View style={styles.topHeader}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSkip}
                style={[
                  styles.skipButton,
                  Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                ]}
              >
                <Text style={styles.skipText}>PASSER</Text>
                <Text style={styles.skipArrow}>➔</Text>
              </TouchableOpacity>
            </View>

            {/* 2. Barre de progression segmentée (3 segments) */}
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

            {/* 3. Case BD Étape 01 avec grande illustration bien visible */}
            <View style={styles.comicStepWrapper}>
              {/* Tag au-dessus de la case */}
              <View style={styles.stepTagBadge}>
                <Text style={styles.stepTagText}>ÉTAPE 01 • CARICATURES & STRIPS</Text>
              </View>

              {/* Conteneur principal de la case BD */}
              <View style={styles.comicPanelCard}>
                {/* Sphère 3D rouge en accent */}
                <ThreeDSphere
                  size={36}
                  colorVariant="red"
                  floatDistance={5}
                  floatDuration={2200}
                  style={styles.panelSphere}
                />

                {/* Grande illustration d'atelier nette et bien visible */}
                <View style={styles.illustrationWrapper}>
                  <Image
                    source={require('../../assets/image_onboarding_1.png')}
                    style={styles.illustrationImage}
                    resizeMode="cover"
                  />

                  {/* Cartouche animé "Y'A PAS DRAP ! ⚡" qui sautille */}
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

                {/* Titre et description juste sous l'illustration */}
                <View style={styles.cardTextContent}>
                  <Text style={styles.headlineTitle}>
                    <Text style={styles.headlineBlack}>RIRE DE TOUT, </Text>
                    <Text style={styles.headlineRed}>CHAQUE MATIN !</Text>
                  </Text>

                  <Text style={styles.bodyDescription}>
                    Retrouvez les célèbres caricaturistes de GBICH!, les strips
                    exclusifs, l'humour d'Abidjan et le regard satirique sans filtre
                    sur l'actu africaine.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ========================================================= */}
          {/* SECTION INFÉRIEURE : APERÇU, BOUTONS & RÉASSURANCE         */}
          {/* ========================================================= */}
          <View style={styles.bottomSection}>
            {/* 4. Aperçu des étapes suivantes */}
            <View style={styles.previewSection}>
              <View style={styles.previewHeaderRow}>
                <Text style={styles.previewBookIcon}>📖</Text>
                <Text style={styles.previewHeaderText}>
                  À DÉCOUVRIR ENSUITE DANS L'APPLICATION
                </Text>
              </View>

              <View style={styles.miniCardsRow}>
                {/* Mini-carte Étape 2 */}
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

                {/* Mini-carte Étape 3 */}
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

            {/* 5. Boutons d'Action & Note */}
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

              {/* Note d'accessibilité sans friction */}
              <Text style={styles.reassuranceText}>
                Accès gratuit et instantané • Aucune carte bancaire requise
              </Text>
            </View>
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
    paddingTop: Platform.OS === 'web' ? 14 : 36,
    paddingBottom: Platform.OS === 'web' ? 24 : 32,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 440,
    gap: 14,
  },

  // Section Supérieure
  topSection: {
    width: '100%',
    gap: 10,
  },

  // 1. Barre supérieure
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 2,
  },
  headerLogo: {
    width: 68,
    height: 36,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1B1D',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#171416',
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
  },
  progressSegment: {
    flex: 1,
    height: 4.5,
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
    marginTop: 2,
  },
  stepTagBadge: {
    backgroundColor: '#1E1B1D',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: -6,
    zIndex: 10,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#3D393B',
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
    top: -14,
    right: -10,
    zIndex: 15,
  },
  illustrationWrapper: {
    width: '100%',
    // Allongement substantiel de la photo pour occuper l'espace et révéler toute la scène de l'atelier
    height: Platform.OS === 'web' ? 360 : 320,
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
    top: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 12,
  },
  drapText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 14,
    color: '#B70014',
    letterSpacing: 0.6,
    fontWeight: '900',
  },
  kpanSticker: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#B70014',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    transform: [{ rotate: '-6deg' }],
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 12,
  },
  kpanText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.8,
    fontWeight: '900',
  },
  cardTextContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  headlineTitle: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 26,
    lineHeight: 30,
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
    fontSize: 13,
    lineHeight: 19,
    color: '#4A4648',
    fontWeight: '500',
  },

  // Section Inférieure
  bottomSection: {
    width: '100%',
    gap: 10,
  },

  // 4. Aperçu des étapes suivantes
  previewSection: {
    width: '100%',
    gap: 6,
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

  // 5. Boutons d'Action (descendus plus bas pour combler l'espace résiduel)
  actionButtonsSection: {
    width: '100%',
    gap: 10,
    marginTop: 14,
    paddingBottom: 4,
  },
  primaryNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B70014',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 14,
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
    paddingVertical: 12.5,
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
    fontSize: 12.5,
    fontWeight: '700',
    color: '#171416',
  },
  reassuranceText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 10,
    color: '#888482',
    textAlign: 'center',
    fontWeight: '500',
    paddingTop: 2,
  },
});
