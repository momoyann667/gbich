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

  // Animation tactile du bouton SUIVANT (translation 3px, 3px)
  const btnTranslate = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(btnTranslate, {
      toValue: 3,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(btnTranslate, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  // Animation de clignotement / lumière rouge continue pour le segment actif
  const progressBlinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progressBlinkAnim, {
          toValue: 0.35,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressBlinkAnim, {
          toValue: 1,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    blinkLoop.start();
    return () => blinkLoop.stop();
  }, [progressBlinkAnim]);

  // Animations Étape 3 : Rotation 3D continue et pulsation de la sphère à trame
  const sphereRotateAnim = useRef(new Animated.Value(0)).current;
  const spherePulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateLoop = Animated.loop(
      Animated.timing(sphereRotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(spherePulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(spherePulseAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    rotateLoop.start();
    pulseLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
    };
  }, [sphereRotateAnim, spherePulseAnim]);

  const sphereRotation = sphereRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sphereScale = spherePulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.08],
  });

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
              style={styles.headerLogo as any}
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
            {/* Segment 1 : clignote rouge tout le temps à l'étape 1, validé en noir ensuite */}
            <Animated.View
              style={[
                styles.progressSegment,
                currentStep > 1
                  ? styles.segmentCompleted
                  : currentStep === 1
                  ? [
                      styles.segmentActive,
                      { opacity: progressBlinkAnim },
                      Platform.OS === 'web' &&
                        ([styles.segmentActiveWebPulse, webIllustrationStyles.segmentActiveWebBlink] as any),
                    ]
                  : styles.segmentInactive,
              ]}
            />
            {/* Segment 2 : inactif à l'étape 1, clignote rouge tout le temps à l'étape 2, validé en noir ensuite */}
            <Animated.View
              style={[
                styles.progressSegment,
                currentStep > 2
                  ? styles.segmentCompleted
                  : currentStep === 2
                  ? [
                      styles.segmentActive,
                      { opacity: progressBlinkAnim },
                      Platform.OS === 'web' &&
                        ([styles.segmentActiveWebPulse, webIllustrationStyles.segmentActiveWebBlink] as any),
                    ]
                  : styles.segmentInactive,
              ]}
            />
            {/* Segment 3 : inactif aux étapes 1 & 2, clignote rouge tout le temps à l'étape 3 */}
            <Animated.View
              style={[
                styles.progressSegment,
                currentStep === 3
                  ? [
                      styles.segmentActive,
                      { opacity: progressBlinkAnim },
                      Platform.OS === 'web' &&
                        ([styles.segmentActiveWebPulse, webIllustrationStyles.segmentActiveWebBlink] as any),
                    ]
                  : styles.segmentInactive,
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
                    style={styles.illustrationImageCover as any}
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
          ) : currentStep === 2 ? (
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
                        styles.cauphyCharacterImage as any,
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
          ) : (
            /* ------------------ ÉTAPE 03 ------------------ */
            <View style={styles.comicStepWrapper}>
              <View style={styles.stepHeaderRow}>
                <View style={styles.stepTagBadge}>
                  <Text style={styles.stepTagText}>🔴 ÉTAPE 03 • JEUX & DÉFIS SATIRIQUES</Text>
                </View>
                <Text style={styles.stepFractionText}>03 / 03</Text>
              </View>

              <View
                style={[
                  styles.comicPanelCard,
                  Platform.OS === 'web' && (webIllustrationStyles.cardHalftone as any),
                ]}
              >
                {/* Sphère 3D rouge en accent (Haut Gauche) */}
                <ThreeDSphere
                  size={36}
                  colorVariant="red"
                  floatDistance={5}
                  floatDuration={2200}
                  style={styles.panelSphereTopLeft}
                />

                {/* Sphère 3D rouge en accent (Haut Droite) */}
                <ThreeDSphere
                  size={36}
                  colorVariant="red"
                  floatDistance={4}
                  floatDuration={2500}
                  style={styles.panelSphereTopRight}
                />

                {/* Cadre BD de l'image de jeux & quiz avec sphère 3D animée et lignes manga */}
                <View style={styles.comicInnerFrame}>
                  <Image
                    source={require('../../assets/image_onboarding_3.png')}
                    style={styles.illustrationImageCover as any}
                    resizeMode="cover"
                  />

                  {/* Lignes de vitesse manga et halo sombre radial au cœur de la case */}
                  <View
                    pointerEvents="none"
                    style={[
                      styles.mangaSpeedLinesOverlay,
                      Platform.OS === 'web' && (webIllustrationStyles.mangaDarkRadial as any),
                    ]}
                  >
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                      (deg) => (
                        <View
                          key={`manga-speed-${deg}`}
                          style={[
                            styles.mangaSpeedRay,
                            { transform: [{ rotate: `${deg}deg` }] },
                          ]}
                        />
                      )
                    )}
                  </View>

                  {/* Sphère à trame halftone rouge/orange : rotation 3D continue & pulsation */}
                  <Animated.View
                    style={[
                      styles.halftoneHeroSphere,
                      {
                        transform: [
                          { rotate: sphereRotation },
                          { scale: sphereScale },
                        ],
                      },
                      Platform.OS === 'web' &&
                        ([webIllustrationStyles.halftoneOrangeRedSphere, webIllustrationStyles.webSphereRotating3D] as any),
                    ]}
                  >
                    {/* Texture micro-points halftone */}
                    <View
                      style={[
                        styles.sphereHalftoneDots,
                        Platform.OS === 'web' &&
                          (webIllustrationStyles.sphereDotGrid as any),
                      ]}
                    />
                    {/* Éclat spéculaire laqué 3D */}
                    <View style={styles.sphereSpecularGlint} />
                  </Animated.View>

                  {/* Sticker TCHÊÊ ! 🔥 en haut à gauche */}
                  <View style={styles.tcheeSticker}>
                    <Text style={styles.tcheeText}>TCHÊÊ ! 🔥</Text>
                  </View>

                  {/* Badge Pilule GAGNE DES GBICHS ! en bas à droite */}
                  <View style={styles.gagneBadge}>
                    <Text style={styles.gagneIcon}>🎯</Text>
                    <Text style={styles.gagneText}>GAGNE DES GBICHS !</Text>
                  </View>
                </View>

                {/* Bulle / Cartouche interactive : TROUVE LES 7 ERREURS SI TU ES CHICOT ! */}
                <View style={styles.sevenErrorsBubble}>
                  <View style={styles.sevenErrorsTail} />
                  <View style={styles.sevenErrorsContent}>
                    <Text style={styles.targetIcon}>🎯</Text>
                    <Text style={styles.sevenErrorsText}>
                      « TROUVE LES 7 ERREURS SI TU ES CHICOT ! » 🎯
                    </Text>
                  </View>
                </View>

                {/* Titraille percutante en ANTON & Description */}
                <View style={styles.cardTextContent}>
                  <Text style={styles.headlineTitle}>
                    <Text style={styles.headlineBlack}>DÉFIE LES ERREURS, GAGNE DES </Text>
                    <Text style={styles.headlineRedUnderline}>GBICHS !</Text>
                  </Text>

                  <Text style={styles.bodyDescription}>
                    Affronte chaque jour le Quiz satirique de l'actu et le mythique jeu des
                    7 erreurs d'Abidjan. Cumule des points, débloque des badges et monte au
                    classement des plus grands vanneurs !
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
          ) : currentStep === 2 ? (
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
          ) : (
            /* Cartouches Étape 3 (Étape 1 & 2 validées) */
            <View style={styles.miniCardsRow}>
              {/* Étape 1 Validée */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCurrentStep(1)}
                style={styles.miniCard}
              >
                <View style={styles.completedCheckCircleRed}>
                  <Text style={styles.completedCheckTextRed}>✓</Text>
                </View>
                <View style={styles.miniCardTexts}>
                  <Text style={styles.miniTitle} numberOfLines={1}>
                    01. STRIPS & BD
                  </Text>
                  <Text style={styles.completedValidTextRed} numberOfLines={1}>
                    ✓ Validé
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Étape 2 Validée */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCurrentStep(2)}
                style={styles.miniCard}
              >
                <View style={styles.completedCheckCircleRed}>
                  <Text style={styles.completedCheckTextRed}>✓</Text>
                </View>
                <View style={styles.miniCardTexts}>
                  <Text style={styles.miniTitle} numberOfLines={1}>
                    02. VIDÉOS CHOC
                  </Text>
                  <Text style={styles.completedValidTextRed} numberOfLines={1}>
                    ✓ Validé
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* ========================================================= */}
          {/* 5. BOUTONS D'ACTION                                       */}
          {/* ========================================================= */}
          <View style={styles.actionButtonsSection}>
            {/* Bouton principal : SUIVANT ou DÉMARRER L'AVENTURE avec effet tactile */}
            <Animated.View
              style={{
                transform: [
                  { scale: btnScaleAnim },
                  { translateX: btnTranslate },
                  { translateY: btnTranslate },
                ],
              }}
            >
              <TouchableOpacity
                activeOpacity={0.92}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleNext}
                style={[
                  styles.primaryNextBtn,
                  Platform.OS === 'web' &&
                    ([webIllustrationStyles.tactileNextBtn, { cursor: 'pointer' }] as any),
                ]}
              >
                {currentStep === 3 ? (
                  <>
                    <ThreeDSphere
                      size={24}
                      colorVariant="red"
                      floatDistance={3}
                      floatDuration={2000}
                      style={styles.btnSphereAccent}
                    />
                    <Text style={styles.finishBtnText}>
                      DÉMARRER L'AVENTURE GBICH! 🚀
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.nextBtnText}>SUIVANT</Text>
                    <View style={styles.stepCounterBadge}>
                      <Text style={styles.stepCounterText}>
                        {currentStep}/3
                      </Text>
                    </View>
                    <Text style={styles.nextBtnArrow}>➔</Text>
                  </>
                )}
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
                {currentStep === 3
                  ? 'Se connecter / Créer un compte'
                  : 'Créer un compte ou entrer en invité'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.reassuranceText}>
              {currentStep === 3
                ? '✓ 100% Gratuit • Humour ivoirien certifié sans filtre'
                : 'Accès gratuit et instantané • Aucune carte bancaire requise'}
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
    paddingTop: Platform.OS === 'web' ? 10 : 26,
    paddingBottom: Platform.OS === 'web' ? 32 : 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
    maxWidth: 440,
    flex: 1,
    justifyContent: 'space-between',
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
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: -6,
    zIndex: 10,
    paddingHorizontal: 2,
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
  stepFractionText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    color: '#171416',
    letterSpacing: 0.8,
    marginRight: 6,
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
  panelSphereTopLeft: {
    position: 'absolute',
    top: -12,
    left: -10,
    zIndex: 15,
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

  // Cadre intérieur de la case BD (hauteur compacte pour visibilité optimale du bas)
  comicInnerFrame: {
    width: '100%',
    height: Platform.OS === 'web' ? 260 : 235,
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
    top: 10,
    left: 10,
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
    top: 10,
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
    top: 10,
    right: 10,
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
    bottom: 10,
    right: 10,
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

  // Éléments Étape 3 : TCHÊÊ ! 🔥 & Pilule GAGNE DES GBICHS !
  tcheeSticker: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#F5222D',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    transform: [{ rotate: '-4deg' }],
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 12,
  },
  tcheeText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  gagneBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#171416',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
    gap: 5,
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    zIndex: 12,
  },
  gagneIcon: {
    fontSize: 11,
  },
  gagneText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 11,
    color: '#171416',
    letterSpacing: 0.5,
  },

  // Bulle / Cartouche Étape 3 : 7 ERREURS
  sevenErrorsBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
    marginBottom: 2,
    position: 'relative',
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  sevenErrorsTail: {
    position: 'absolute',
    top: -6,
    left: 28,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#171416',
  },
  sevenErrorsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  targetIcon: {
    fontSize: 13,
  },
  sevenErrorsText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11.5,
    fontWeight: '700',
    color: '#171416',
    letterSpacing: 0.2,
  },

  // Contenu textuel sous l'image
  cardTextContent: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 6,
  },
  headlineTitle: {
    // Titres percutants en ANTON
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: Platform.OS === 'web' ? 26 : 23,
    lineHeight: Platform.OS === 'web' ? 32 : 29,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headlineBlack: {
    color: '#171416',
  },
  headlineRed: {
    color: '#F5222D',
  },
  headlineRedUnderline: {
    color: '#F5222D',
    textDecorationLine: 'underline',
  },
  bodyDescription: {
    // Textes explicatifs en plus grand
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: Platform.OS === 'web' ? 14 : 13,
    lineHeight: Platform.OS === 'web' ? 21 : 19,
    color: '#3A3638',
    fontWeight: '500',
  },

  // 4. Cartouches d'étapes au bas (agrandies et plus tactiles)
  miniCardsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 2,
  },
  miniCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBE8E5',
    borderWidth: 1.8,
    borderColor: '#D4D0CC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 56,
    gap: 10,
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  miniNumberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DCD9D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniNumberText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12.5,
    fontWeight: '800',
    color: '#171416',
  },
  completedCheckCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#171416',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  completedCheckCircleRed: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5222D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#171416',
  },
  completedCheckTextRed: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  miniCardTexts: {
    flex: 1,
    gap: 1,
  },
  miniTitle: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '700',
    color: '#171416',
  },
  miniSub: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 10.5,
    color: '#625D5F',
    fontWeight: '500',
  },
  completedValidText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 10.5,
    color: '#10B981', // Vert émeraude validé
    fontWeight: '700',
  },
  completedValidTextRed: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 10.5,
    color: '#F5222D',
    fontWeight: '700',
  },

  // 5. Boutons d'Action positionnés tout en bas
  actionButtonsSection: {
    width: '100%',
    gap: 8,
    marginTop: 6,
    paddingTop: 8,
    paddingBottom: 2,
  },
  primaryNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5222D',
    borderWidth: 3,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#171416',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    gap: 10,
    position: 'relative',
  },
  btnSphereAccent: {
    position: 'absolute',
    top: -10,
    right: -8,
    zIndex: 15,
  },
  finishBtnText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 15.5,
    color: '#FFFFFF',
    letterSpacing: 0.8,
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
    paddingVertical: 12,
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
    fontSize: 11,
    color: '#625D5F',
    textAlign: 'center',
    fontWeight: '600',
    paddingTop: 3,
    paddingBottom: 2,
  },
  segmentActiveWebPulse: {
    boxShadow: '0 0 10px rgba(245, 34, 45, 0.95), 0 0 18px rgba(245, 34, 45, 0.5)',
  },
  halftoneHeroSphere: {
    position: 'absolute',
    top: '14%',
    right: '10%',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F5222D',
    borderWidth: 2,
    borderColor: '#171416',
    zIndex: 13,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 5,
  },
  mangaSpeedLinesOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  mangaSpeedRay: {
    position: 'absolute',
    width: 500,
    height: 1.5,
    backgroundColor: 'rgba(23, 20, 22, 0.22)',
  },
  sphereHalftoneDots: {
    ...StyleSheet.absoluteFill,
    opacity: 0.35,
  },
  sphereSpecularGlint: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: 18,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ rotate: '-25deg' }],
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
  tactileNextBtn: {
    boxShadow: '5px 5px 0px #171416',
  },
  halftoneOrangeRedSphere: {
    background:
      'radial-gradient(circle at 35% 28%, #FFA940 0%, #FF5A1F 28%, #F5222D 58%, #8B0010 85%, #2A0408 100%)',
    boxShadow:
      '0 8px 18px rgba(245, 34, 45, 0.6), inset -3px -3px 8px rgba(42, 4, 8, 0.7), inset 2px 2px 5px rgba(255, 255, 255, 0.85)',
  },
  webSphereRotating3D: {
    animation: 'spin3D 4s ease-in-out infinite',
  },
  segmentActiveWebBlink: {
    animation: 'redSignalBlink 0.85s ease-in-out infinite',
  },
  sphereDotGrid: {
    backgroundImage: 'radial-gradient(#171416 1px, transparent 1px)',
    backgroundSize: '6px 6px',
  },
  mangaDarkRadial: {
    background:
      'radial-gradient(circle at 75% 30%, rgba(245, 34, 45, 0.12) 0%, rgba(23, 20, 22, 0.35) 75%, rgba(23, 20, 22, 0.55) 100%)',
  },
};

