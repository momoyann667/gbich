import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';
import { ThreeDSphere } from '../components/common/ThreeDSphere';
import { RotatingPen } from '../components/common/RotatingPen';
import { GBICH_COLORS } from '../theme/tokens';
import { injectWebFonts } from '../utils/loadFonts';

interface SplashScreenProps {
  onExplore?: () => void;
  navigation?: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onExplore, navigation }) => {
  useEffect(() => {
    injectWebFonts();
  }, []);

  // Animations d'entrée
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;
  const speechBubbleSway = useRef(new Animated.Value(0)).current;

  // Animation de clignotement lent du bouton d'action (Slow blink / breathing glow)
  const slowBlinkAnim = useRef(new Animated.Value(1)).current;

  // Animation d'illusion d'optique sur la jauge de chargement (balayage d'onde permanent)
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const [progressPercent, setProgressPercent] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Apparition séquentielle
    Animated.parallel([
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Progression satirique 0% -> 100%
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 1600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    const listenerId = progressAnim.addListener(({ value }) => {
      setProgressPercent(Math.round(value));
    });

    // 3. Balancement doux du cartouche supérieur
    const bubbleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(speechBubbleSway, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(speechBubbleSway, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bubbleLoop.start();

    // 4. Clignotement lent du bouton principal (slow breathing)
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(slowBlinkAnim, {
          toValue: 0.82,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(slowBlinkAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    blinkLoop.start();

    // 5. Illusion d'optique continue sur la jauge de chargement
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();

    return () => {
      progressAnim.removeListener(listenerId);
      bubbleLoop.stop();
      blinkLoop.stop();
      shimmerLoop.stop();
    };
  }, [entranceAnim, logoScaleAnim, progressAnim, speechBubbleSway, slowBlinkAnim, shimmerAnim]);

  // Clic avec retour haptique
  const handlePressAction = () => {
    Animated.sequence([
      Animated.timing(btnScaleAnim, {
        toValue: 0.96,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(btnScaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onExplore) {
        onExplore();
      } else if (navigation?.navigate) {
        navigation.navigate('Onboarding');
      }
    });
  };

  const bubbleRotate = speechBubbleSway.interpolate({
    inputRange: [0, 1],
    outputRange: ['-1.5deg', '2deg'],
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 360],
  });

  const handleMouseMove = (e: any) => {
    if (Platform.OS !== 'web') return;
    const { clientX, clientY } = e.nativeEvent || e;
    const { innerWidth, innerHeight } = window;
    const xOffset = ((clientX - innerWidth / 2) / innerWidth) * 12;
    const yOffset = ((clientY - innerHeight / 2) / innerHeight) * -12;
    setTilt({ x: yOffset, y: xOffset });
  };

  const handleMouseLeave = () => {
    if (Platform.OS === 'web') {
      setTilt({ x: 0, y: 0 });
    }
  };

  return (
    <ComicHalftoneBackground>
      <View
        style={styles.screenWrapper}
        {...({
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
        } as any)}
      >
        {/* ========================================================= */}
        {/* EN-TÊTE : BADGE 100% SATIRIQUE ÉLÉGANT                    */}
        {/* ========================================================= */}
        <Animated.View style={[styles.headerRow, { opacity: entranceAnim }]}>
          <View style={{ flex: 1 }} />
          <View style={styles.badgeSatirique}>
            <Text style={styles.badgeSatiriqueText}>100% SATIRIQUE</Text>
          </View>
        </Animated.View>

        {/* ========================================================= */}
        {/* COEUR 3D : LOGO GBICH! & SPHÈRES LAQUÉES                   */}
        {/* ========================================================= */}
        <Animated.View
          style={[
            styles.centerSection,
            {
              opacity: entranceAnim,
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        >
          {/* Conteneur 3D Tilt */}
          <View
            style={[
              styles.cardPerspectiveContainer,
              Platform.OS === 'web' &&
                ({
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: 'transform 0.15s ease-out',
                } as any),
            ]}
          >
            {/* Sphère 3D 1 (Haut Gauche) */}
            <ThreeDSphere
              size={42}
              colorVariant="red"
              floatDelay={0}
              floatDistance={7}
              floatDuration={2600}
              style={styles.sphereTopLeft}
            />

            {/* Bulle supérieure : LE JOURNAL QUI TAPE FORT ! */}
            <Animated.View
              style={[
                styles.speechBubbleWrapper,
                { transform: [{ rotate: bubbleRotate }] },
              ]}
            >
              <View style={styles.speechBubble}>
                <Text style={styles.speechBubbleText}>LE JOURNAL QUI TAPE FORT !</Text>
                <View style={styles.speechBubbleTail} />
              </View>
            </Animated.View>

            {/* Carte Blanche du Logo Officiel GBICH! */}
            <View style={styles.logoCard}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Sphère 3D 2 (Milieu Droite) */}
            <ThreeDSphere
              size={24}
              colorVariant="red"
              floatDelay={400}
              floatDistance={5}
              floatDuration={2200}
              style={styles.sphereMiddleRight}
            />

            {/* Sphère 3D 3 (Bas Droite) */}
            <ThreeDSphere
              size={34}
              colorVariant="red"
              floatDelay={800}
              floatDistance={6}
              floatDuration={2900}
              style={styles.sphereBottomRight}
            />

            {/* Sous-Bannière en Police Inter ultra-lisible */}
            <View style={styles.subBannerCard}>
              <Text style={styles.subBannerText}>
                L'HUMOUR ENGAGÉ & LA BD CULTE D'ABIDJAN
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ========================================================= */}
        {/* BAS DE PAGE : CARTOUCHE BD DE CHARGEMENT & ACTION BRUTALISTE */}
        {/* ========================================================= */}
        <Animated.View style={[styles.bottomSection, { opacity: entranceAnim }]}>
          {/* Indicateur de chargement stylisé en cartouche BD fidèle à la capture */}
          <View style={styles.loadingCard}>
            <View style={styles.loadingTopRow}>
              {/* Stylo plume rouge authentique qui tourne indéfiniment à 360° */}
              <RotatingPen size={22} />

              {/* Texte exact : Prêt à krou ! Touchez ci-dessous pour en... */}
              <Text style={styles.loadingStatusText} numberOfLines={1}>
                Prêt à krou ! Touchez ci-dessous pour en...
              </Text>
              <Text style={styles.percentText}>{progressPercent}%</Text>
            </View>

            {/* Barre de progression rouge vif #F5222D animée avec illusion d'optique */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                  Platform.OS === 'web' && (styles.webStripedBar as any),
                ]}
              />

              {/* Balayage d'onde lumineuse (illusion continue même plein à 100%) */}
              <Animated.View
                style={[
                  styles.opticalShimmerBeam,
                  {
                    transform: [{ translateX: shimmerTranslateX }],
                  },
                ]}
              />
            </View>

            {/* Ligne inférieure : Métadonnées exactes comme sur la capture */}
            <View style={styles.loadingBottomRow}>
              <View style={styles.locationGroup}>
                <View style={styles.locationDot} />
                <Text style={styles.metaSubText}>
                  {"Treichville • Yopougon •\nCocody"}
                </Text>
              </View>

              <Text style={[styles.metaSubText, styles.metaSubTextRight]}>
                {"Connexion satirique :\nSécurisée"}
              </Text>
            </View>
          </View>

          {/* Bouton d'action tactile "DÉCOUVRIR L'EXPÉRIENCE ->" avec ombre dure 4px 4px #171416 et bordure 3px noir encre */}
          <Animated.View
            style={[
              {
                transform: [{ scale: btnScaleAnim }],
                opacity: slowBlinkAnim,
              },
              Platform.OS === 'web' && (styles.webBtnGlow as any),
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handlePressAction}
              style={[
                styles.actionBtn,
                Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
              ]}
            >
              <ThreeDSphere
                size={18}
                colorVariant="pearl"
                floatDistance={2}
                floatDuration={1500}
                style={styles.btnPearl}
              />

              <Text style={styles.actionBtnText}>DÉCOUVRIR L'EXPÉRIENCE</Text>

              <Text style={styles.actionBtnArrow}>➔</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer Légal & Historique */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              • © GBICH! Média • Fondé en 1999 • Tous droits réservés •
            </Text>
          </View>
        </Animated.View>
      </View>
    </ComicHalftoneBackground>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 24 : 48,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },

  // 1. En-tête : Badge 100% Satirique
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeSatirique: {
    backgroundColor: '#B70014',
    borderWidth: 1.5,
    borderColor: '#171416',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeSatiriqueText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  // 2. Coeur 3D et Logo
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    zIndex: 5,
  },
  cardPerspectiveContainer: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    position: 'relative',
  },
  speechBubbleWrapper: {
    position: 'relative',
    zIndex: 12,
    marginBottom: -16,
    alignSelf: 'center',
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  speechBubbleText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 15,
    color: '#B70014',
    letterSpacing: 1,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  speechBubbleTail: {
    position: 'absolute',
    bottom: -7,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#171416',
  },
  logoCard: {
    width: '100%',
    height: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 6,
  },
  logoImage: {
    width: '92%',
    height: '90%',
  },
  sphereTopLeft: {
    position: 'absolute',
    top: -12,
    left: -10,
    zIndex: 14,
  },
  sphereMiddleRight: {
    position: 'absolute',
    top: '38%',
    right: -10,
    zIndex: 14,
  },
  sphereBottomRight: {
    position: 'absolute',
    bottom: 22,
    right: -12,
    zIndex: 14,
  },
  subBannerCard: {
    width: '100%',
    backgroundColor: '#FAF7F2',
    borderWidth: 1.5,
    borderColor: '#171416',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 6,
  },
  subBannerText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '700',
    color: '#171416',
    letterSpacing: 0.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // 3. Bas de page : Cartouche BD de Chargement
  bottomSection: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    gap: 12,
    zIndex: 10,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 10,
  },
  loadingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingStatusText: {
    flex: 1,
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11.5,
    fontWeight: '600',
    color: '#171416',
    lineHeight: 16,
  },
  percentText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 16,
    fontWeight: '900',
    color: '#B70014',
    marginLeft: 6,
  },
  progressBarTrack: {
    height: 14,
    backgroundColor: '#FAF7F2',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 9999,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F5222D', // Rouge vif #F5222D
    borderRadius: 9999,
  },
  opticalShimmerBeam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 9999,
  },
  webStripedBar: {
    backgroundImage: `repeating-linear-gradient(
      -45deg,
      #F5222D,
      #F5222D 10px,
      #B70014 10px,
      #B70014 20px
    )`,
    backgroundSize: '28px 28px',
  },
  loadingBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5A52',
    marginTop: 3,
  },
  metaSubText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '600',
    color: '#625D5F',
  },
  metaSubTextRight: {
    textAlign: 'left',
  },

  // Bouton d'Action avec ombre douce
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B70014',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#F5222D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    gap: 12,
  },
  btnPearl: {
    marginRight: 2,
  },
  actionBtnText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  actionBtnArrow: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  webBtnGlow: {
    filter: 'drop-shadow(0 4px 10px rgba(183, 0, 20, 0.35))',
  },

  // Footer
  footerContainer: {
    alignItems: 'center',
    paddingTop: 4,
  },
  footerText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 10,
    fontWeight: '500',
    color: '#888482',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
