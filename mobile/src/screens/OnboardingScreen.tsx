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

  // Étape courante (1 ou 2)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Animations d'apparition
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;

  // Animations Étape 1 : Sautillement de "Y'a pas drap !"
  const hopAnim = useRef(new Animated.Value(0)).current;

  // Animations Étape 2 : Geste malicieux & Fumée du cigare
  const gestureAnim = useRef(new Animated.Value(0)).current;
  const smokeAnim1 = useRef(new Animated.Value(0)).current;
  const smokeAnim2 = useRef(new Animated.Value(0)).current;

  // Re-déclenche l'animation d'apparition à chaque changement d'étape
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(12);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep, fadeAnim, slideAnim]);

  useEffect(() => {
    // 1. Sautillement cartouche Étape 1
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

    // 2. Geste expressif malicieux (mouvement subtil de bande dessinée)
    const gestureLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(gestureAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(gestureAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    gestureLoop.start();

    // 3. Volutes de fumée du cigare avec expansion et estompage continu
    const smokeLoop1 = Animated.loop(
      Animated.timing(smokeAnim1, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );
    smokeLoop1.start();

    const smokeTimeout = setTimeout(() => {
      Animated.loop(
        Animated.timing(smokeAnim2, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      ).start();
    }, 900);

    return () => {
      hopLoop.stop();
      gestureLoop.stop();
      smokeLoop1.stop();
      clearTimeout(smokeTimeout);
    };
  }, [hopAnim, gestureAnim, smokeAnim1, smokeAnim2]);

  // Interpolations de fumée de cigare
  const smokeTranslateY1 = smokeAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -32],
  });
  const smokeScale1 = smokeAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1.3, 1.8],
  });
  const smokeOpacity1 = smokeAnim1.interpolate({
    inputRange: [0, 0.3, 0.8, 1],
    outputRange: [0, 0.75, 0.4, 0],
  });

  const smokeTranslateY2 = smokeAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -32],
  });
  const smokeScale2 = smokeAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1.3, 1.8],
  });
  const smokeOpacity2 = smokeAnim2.interpolate({
    inputRange: [0, 0.3, 0.8, 1],
    outputRange: [0, 0.75, 0.4, 0],
  });

  // Interpolation du geste du personnage
  const characterRotate = gestureAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1.8deg'],
  });

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
              style={[
                styles.skipButton,
                Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
              ]}
            >
              <Text style={styles.skipText}>PASSER</Text>
              <Text style={styles.skipArrow}>➔</Text>
            </TouchableOpacity>
          </View>

          {/* ========================================================= */}
          {/* 2. BARRE DE PROGRESSION SEGMENTÉE (3 ÉTAPES)              */}
          {/* ========================================================= */}
          <View style={styles.segmentedProgressRow}>
            {/* Segment 1 : validé en noir quand currentStep >= 2 */}
            <View
              style={[
                styles.progressSegment,
                currentStep > 1
                  ? styles.segmentCompleted
                  : currentStep === 1
                  ? styles.segmentActive
                  : styles.segmentInactive,
              ]}
            />
            {/* Segment 2 : actif en rouge vif #F5222D à l'Étape 2 */}
            <View
              style={[
                styles.progressSegment,
                currentStep > 2
                  ? styles.segmentCompleted
                  : currentStep === 2
                  ? styles.segmentActive
                  : styles.segmentInactive,
              ]}
            />
            {/* Segment 3 */}
            <View
              style={[
                styles.progressSegment,
                currentStep === 3 ? styles.segmentActive : styles.segmentInactive,
              ]}
            />
          </View>

          {/* ========================================================= */}
          {/* 3. CASE BD CENTRALE (DYNAMIQUE SELON L'ÉTAPE 1 OU 2)      */}
          {/* ========================================================= */}
          {currentStep === 1 ? (
            /* ------------------ ÉTAPE 01 ------------------ */
            <View style={styles.comicStepWrapper}>
              <View style={styles.stepTagBadge}>
                <Text style={styles.stepTagText}>ÉTAPE 01 • CARICATURES & STRIPS</Text>
              </View>

              <View style={styles.comicPanelCard}>
                <ThreeDSphere
                  size={36}
                  colorVariant="red"
                  floatDistance={5}
                  floatDuration={2200}
                  style={styles.panelSphereTopRight}
                />

                <View style={styles.comicInnerFrame}>
                  <Image
                    source={require('../../assets/image_onboarding_1.png')}
                    style={styles.illustrationImageCover}
                    resizeMode="cover"
                  />

                  <Animated.View
                    style={[
                      styles.drapCartouche,
                      { transform: [{ translateY: hopAnim }] },
                    ]}
                  >
                    <Text style={styles.drapText}>Y'A PAS DRAP ! ⚡</Text>
                  </Animated.View>

                  <View style={styles.kpanSticker}>
                    <Text style={styles.kpanText}>KPAN !</Text>
                  </View>
                </View>

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
          ) : (
            /* ------------------ ÉTAPE 02 ------------------ */
            <View style={styles.comicStepWrapper}>
              <View style={styles.stepTagBadge}>
                <Text style={styles.stepTagText}>ÉTAPE 02 • VIDÉOS & PUNCHLINES</Text>
              </View>

              <View
                style={[
                  styles.comicPanelCard,
                  Platform.OS === 'web' && (webIllustrationStyles.cardHalftone as any),
                ]}
              >
                {/* Sphère 3D rouge en accent (Haut Droite) */}
                <ThreeDSphere
                  size={38}
                  colorVariant="red"
                  floatDistance={5}
                  floatDuration={2200}
                  style={styles.panelSphereTopRight}
                />

                {/* Sphère 3D rouge en accent (Bas Gauche) */}
                <ThreeDSphere
                  size={24}
                  colorVariant="red"
                  floatDistance={4}
                  floatDuration={2600}
                  style={styles.panelSphereBottomLeft}
                />

                {/* Cadre BD avec rayonnement solaire satirique (Comic Sunburst) */}
                <View
                  style={[
                    styles.comicInnerFrame,
                    styles.sunburstFrame,
                    Platform.OS === 'web' && (webIllustrationStyles.sunburstBg as any),
                  ]}
                >
                  {/* Rayons solaires satiriques en couches (rendu natif de secours) */}
                  <View style={styles.sunburstNativeContainer} pointerEvents="none">
                    {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((deg) => (
                      <View
                        key={`sunray-${deg}`}
                        style={[
                          styles.sunburstRay,
                          { transform: [{ rotate: `${deg}deg` }] },
                        ]}
                      />
                    ))}
                  </View>

                  {/* Illustration Cauphy Gombo centrée et diminuée pour visibilité intégrale */}
                  <View style={styles.cauphyWrapper}>
                    <Animated.Image
                      source={require('../../assets/image_onboarding_2.png')}
                      style={[
                        styles.cauphyCharacterImage,
                        { transform: [{ rotate: characterRotate }] },
                      ]}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Volutes de fumée animées du cigare */}
                  <View style={styles.cigarSmokeContainer} pointerEvents="none">
                    <Animated.View
                      style={[
                        styles.smokePuff,
                        {
                          transform: [
                            { translateY: smokeTranslateY1 },
                            { scale: smokeScale1 },
                          ],
                          opacity: smokeOpacity1,
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.smokePuff,
                        {
                          transform: [
                            { translateY: smokeTranslateY2 },
                            { scale: smokeScale2 },
                          ],
                          opacity: smokeOpacity2,
                        },
                      ]}
                    />
                  </View>

                  {/* Bulle d'expression satirique : Y'A DÉRAPAGE ICI ! 😂 */}
                  <View style={styles.derapageBubble}>
                    <Text style={styles.derapageText}>Y'A DÉRAPAGE ICI ! 😂</Text>
                    <View style={styles.derapageBubbleTail} />
                  </View>

                  {/* Sticker Jaune TCHÂÂÂ ! en haut à droite */}
                  <View style={styles.tchaaaSticker}>
                    <Text style={styles.tchaaaText}>TCHÂÂÂ !</Text>
                  </View>

                  {/* Sticker Rouge KPAN ! en bas à droite */}
                  <View style={styles.kpanSticker}>
                    <Text style={styles.kpanText}>KPAN !</Text>
                  </View>
                </View>

                {/* Titraille percutante BOLD mais nette et lisible & Description */}
                <View style={styles.cardTextContent}>
                  <Text style={styles.headlineTitle}>
                    <Text style={styles.headlineBlack}>VIDÉOS CHOC, </Text>
                    <Text style={styles.headlineRed}>PUNCHLINES D'ABIDJAN !</Text>
                  </Text>

                  <Text style={styles.bodyDescription}>
                    Gags inédits, micro-trottoirs caustiques et clashs satiriques en
                    capsules ultra-courtes. L'actu d'Abidjan décryptée avec l'humour
                    nouchi sans filtre.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ========================================================= */}
          {/* 4. CARTOUCHES D'ÉTAPES AU BAS                             */}
          {/* ========================================================= */}
          {currentStep === 1 ? (
            /* Cartouches Étape 1 */
            <View style={styles.miniCardsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCurrentStep(2)}
                style={styles.miniCard}
              >
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
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCurrentStep(3)}
                style={styles.miniCard}
              >
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
              </TouchableOpacity>
            </View>
          ) : (
            /* Cartouches Étape 2 (Étape 1 validée, Étape 3 suivante) */
            <View style={styles.miniCardsRow}>
              {/* Étape 1 Validée */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCurrentStep(1)}
                style={styles.miniCard}
              >
                <View style={styles.completedCheckCircle}>
                  <Text style={styles.completedCheckText}>✓</Text>
                </View>
                <View style={styles.miniCardTexts}>
                  <Text style={styles.miniTitle} numberOfLines={1}>
                    1. Strips
                  </Text>
                  <Text style={styles.completedValidText} numberOfLines={1}>
                    ✓ Validé
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Étape 3 Suivante */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCurrentStep(3)}
                style={styles.miniCard}
              >
                <View style={styles.miniNumberCircle}>
                  <Text style={styles.miniNumberText}>3</Text>
                </View>
                <View style={styles.miniCardTexts}>
                  <Text style={styles.miniTitle} numberOfLines={1}>
                    3. Quiz 7 erreurs
                  </Text>
                  <Text style={styles.miniSub} numberOfLines={1}>
                    Suivant
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* ========================================================= */}
          {/* 5. BOUTONS D'ACTION                                       */}
          {/* ========================================================= */}
          <View style={styles.actionButtonsSection}>
            {/* Bouton principal : SUIVANT (1/3 ou 2/3) */}
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
                  <Text style={styles.stepCounterText}>
                    {currentStep}/3
                  </Text>
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
    paddingTop: Platform.OS === 'web' ? 14 : 36,
    paddingBottom: Platform.OS === 'web' ? 24 : 32,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 440,
    gap: 14,
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
  segmentCompleted: {
    backgroundColor: '#171416', // Segment validé en noir
  },
  segmentActive: {
    backgroundColor: '#F5222D', // Segment actif en rouge vif
  },
  segmentInactive: {
    backgroundColor: '#DCD9D7',
  },

  // 3. Case BD
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
    padding: 10,
    overflow: 'visible',
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    position: 'relative',
  },
  panelSphereTopRight: {
    position: 'absolute',
    top: -12,
    right: -10,
    zIndex: 15,
  },
  panelSphereBottomLeft: {
    position: 'absolute',
    bottom: -10,
    left: -8,
    zIndex: 15,
  },

  // Cadre intérieur de la case BD
  comicInnerFrame: {
    width: '100%',
    height: Platform.OS === 'web' ? 310 : 280,
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FAF7F2',
  },
  illustrationImageCover: {
    width: '100%',
    height: '100%',
  },

  // Fond bande dessinée rayonnement solaire (Comic Sunburst)
  sunburstFrame: {
    backgroundColor: '#FFF5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunburstNativeContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 2,
    height: 2,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  sunburstRay: {
    position: 'absolute',
    width: 700,
    height: 42,
    backgroundColor: '#F8CEBB',
  },

  // Conteneur de Cauphy Gombo diminué pour une visibilité totale
  cauphyWrapper: {
    width: '78%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  cauphyCharacterImage: {
    width: '100%',
    height: '100%',
  },

  // Fumée animée du cigare
  cigarSmokeContainer: {
    position: 'absolute',
    top: '27%',
    left: '57%',
    width: 20,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 14,
  },
  smokePuff: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 0.8,
    borderColor: 'rgba(200, 195, 190, 0.4)',
  },

  // Cartouche Étape 1 : Y'a pas drap !
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
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 13,
    color: '#B70014',
    letterSpacing: 0.5,
    fontWeight: '700',
  },

  // Bulle Étape 2 : Y'a dérapage ici ! 😂
  derapageBubble: {
    position: 'absolute',
    top: 12,
    left: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 12,
  },
  derapageText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 13,
    color: '#B70014',
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  derapageBubbleTail: {
    position: 'absolute',
    bottom: -6,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#171416',
  },

  // Sticker Jaune TCHÂÂÂ !
  tchaaaSticker: {
    position: 'absolute',
    top: 14,
    right: 12,
    backgroundColor: '#FACC15', // Jaune vif
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    transform: [{ rotate: '4deg' }],
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 12,
  },
  tchaaaText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13.5,
    color: '#171416',
    letterSpacing: 0.8,
    fontWeight: '900',
  },

  // Sticker Rouge KPAN !
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
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.8,
    fontWeight: '700',
  },

  // Contenu textuel sous l'image
  cardTextContent: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 8,
  },
  headlineTitle: {
    // BOLD mais pas trop, net et parfaitement lisible
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.3,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  headlineBlack: {
    color: '#171416',
    fontWeight: '800',
  },
  headlineRed: {
    color: '#F5222D',
    fontWeight: '800',
  },
  bodyDescription: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12.5,
    lineHeight: 18,
    color: '#4A4648',
    fontWeight: '500',
  },

  // 4. Cartouches d'étapes au bas
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
  completedCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#171416',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  miniCardTexts: {
    flex: 1,
  },
  miniTitle: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#171416',
  },
  miniSub: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 9.5,
    color: '#625D5F',
    fontWeight: '500',
  },
  completedValidText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 9.5,
    color: '#10B981', // Vert émeraude validé
    fontWeight: '700',
  },

  // 5. Boutons d'Action
  actionButtonsSection: {
    width: '100%',
    gap: 10,
    marginTop: 10,
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

const webIllustrationStyles = {
  sunburstBg: {
    backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, #FFF5EC 0deg 11.25deg, #F8CEBB 11.25deg 22.5deg)`,
    backgroundColor: '#FFF5EC',
  },
  cardHalftone: {
    backgroundImage: `radial-gradient(#171416 0.65px, transparent 0.65px)`,
    backgroundSize: '16px 16px',
    backgroundColor: '#FFFFFF',
  },
};

