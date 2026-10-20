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
  Dimensions,
} from 'react-native';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';
import { ThreeDSphere } from '../components/common/ThreeDSphere';
import { GBICH_COLORS } from '../theme/tokens';
import { injectWebFonts } from '../utils/loadFonts';

interface SplashScreenProps {
  onExplore?: () => void;
  navigation?: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onExplore, navigation }) => {
  // Injecte les polices officielles web
  useEffect(() => {
    injectWebFonts();
  }, []);

  // Animations d'entrée
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;
  const speechBubbleSway = useRef(new Animated.Value(0)).current;

  // État du pourcentage de chargement
  const [progressPercent, setProgressPercent] = useState(0);

  // Interaction 3D Tilt (souris sur Web)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Animation d'apparition séquentielle
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

    // 2. Progression satirique 0% -> 100% ("Prêt à krou !")
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 1600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    const listenerId = progressAnim.addListener(({ value }) => {
      setProgressPercent(Math.round(value));
    });

    // 3. Balancement subtil du cartouche satirique "Le journal qui tape fort !"
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

    return () => {
      progressAnim.removeListener(listenerId);
      bubbleLoop.stop();
    };
  }, [entranceAnim, logoScaleAnim, progressAnim, speechBubbleSway]);

  // Gestion du clic avec retour tactile haptique / ressort néo-brutaliste
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
        // Redirige vers le feed principal ou l'onboarding
        navigation.navigate('MainTabs');
      }
    });
  };

  // Balancement du cartouche (-2deg à +2deg)
  const bubbleRotate = speechBubbleSway.interpolate({
    inputRange: [0, 1],
    outputRange: ['-1.5deg', '2deg'],
  });

  // Calcul du tilt 3D sur Web
  const handleMouseMove = (e: any) => {
    if (Platform.OS !== 'web') return;
    const { clientX, clientY } = e.nativeEvent || e;
    const { innerWidth, innerHeight } = window;
    const xOffset = ((clientX - innerWidth / 2) / innerWidth) * 14;
    const yOffset = ((clientY - innerHeight / 2) / innerHeight) * -14;
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
        {/* EN-TÊTE : BADGES PWA ET 100% SATIRIQUE                    */}
        {/* ========================================================= */}
        <Animated.View style={[styles.headerRow, { opacity: entranceAnim }]}>
          {/* Badge Gauche : PWA V2.0 • ABIDJAN */}
          <View style={styles.badgePwa}>
            <ThreeDSphere size={12} colorVariant="red" floatDistance={2} floatDuration={1800} />
            <Text style={styles.badgePwaText}>PWA V2.0 • ABIDJAN</Text>
          </View>

          {/* Badge Droit : 100% SATIRIQUE */}
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
              floatDistance={8}
              floatDuration={2600}
              style={styles.sphereTopLeft}
            />

            {/* Bulle / Cartouche supérieur : LE JOURNAL QUI TAPE FORT ! */}
            <Animated.View
              style={[
                styles.speechBubbleWrapper,
                { transform: [{ rotate: bubbleRotate }] },
              ]}
            >
              <View style={styles.speechBubble}>
                <Text style={styles.speechBubbleText}>LE JOURNAL QUI TAPE FORT !</Text>
                {/* Queue de bulle de bande dessinée pointant vers le bas */}
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

            {/* Sphère 3D 3 (Bas Droite, translucide/laquée) */}
            <ThreeDSphere
              size={34}
              colorVariant="red"
              floatDelay={800}
              floatDistance={7}
              floatDuration={2900}
              style={styles.sphereBottomRight}
            />

            {/* Sous-Cartouche Néo-brutaliste : L'HUMOUR ENGAGÉ & LA BD CULTE D'ABIDJAN */}
            <View style={styles.subBannerCard}>
              <Text style={styles.subBannerText}>
                L'HUMOUR ENGAGÉ & LA BD CULTE D'ABIDJAN
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ========================================================= */}
        {/* BAS DE PAGE : JAUGE DE CHARGEMENT & ACTION BRUTALISTE      */}
        {/* ========================================================= */}
        <Animated.View style={[styles.bottomSection, { opacity: entranceAnim }]}>
          {/* Carte Jauge de Chargement */}
          <View style={styles.loadingCard}>
            <View style={styles.loadingTopRow}>
              {/* Onde satirique rouge */}
              <Text style={styles.waveIcon}>〽️</Text>
              <Text style={styles.loadingStatusText} numberOfLines={1}>
                Prêt à krou ! Touchez ci-dessous pour en...
              </Text>
              <Text style={styles.percentText}>{progressPercent}%</Text>
            </View>

            {/* Barre de progression candy-striped animée */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                  Platform.OS === 'web' && (styles.webStripedBar as any),
                ]}
              />
            </View>

            {/* Métadonnées de connexion locales (Abidjan) */}
            <View style={styles.loadingBottomRow}>
              <View style={styles.locationGroup}>
                <View style={styles.locationDot} />
                <Text style={styles.metaSubText}>Treichville • Yopougon • Cocody</Text>
              </View>
              <Text style={styles.metaSubText}>Connexion satirique : Sécurisée</Text>
            </View>
          </View>

          {/* Bouton d'Action Néo-Brutaliste Tactile */}
          <Animated.View style={{ transform: [{ scale: btnScaleAnim }] }}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handlePressAction}
              style={[styles.actionBtn, Platform.OS === 'web' && ({ cursor: 'pointer' } as any)]}
            >
              {/* Perle 3D blanche avec reflet laqué */}
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

          {/* Footer Légal & Historique GBICH! */}
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

  // 1. En-tête / Badges
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  badgePwa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 9999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 8,
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  badgePwaText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 11,
    fontWeight: '700',
    color: '#171416',
    letterSpacing: 0.8,
  },
  badgeSatirique: {
    backgroundColor: '#B70014',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 12,
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  badgeSatiriqueText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
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
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
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
    bottom: -8,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#171416',
  },
  logoCard: {
    width: '100%',
    height: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#171416',
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
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
    backgroundColor: '#EBE8E4',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    zIndex: 6,
  },
  subBannerText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    fontWeight: '800',
    color: '#171416',
    letterSpacing: 0.8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // 3. Bas de page : Chargement, Bouton & Footer
  bottomSection: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    gap: 12,
    zIndex: 10,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 10,
  },
  loadingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waveIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  loadingStatusText: {
    flex: 1,
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '700',
    color: '#171416',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 9999,
    overflow: 'hidden',
    padding: 1,
    justifyContent: 'center',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F5222D',
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
    alignItems: 'center',
    paddingTop: 2,
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#936E6B',
  },
  metaSubText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 9.5,
    fontWeight: '600',
    color: '#625D5F',
  },

  // Bouton Néo-brutaliste
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B70014',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
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

  // Footer
  footerContainer: {
    alignItems: 'center',
    paddingTop: 4,
  },
  footerText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 9.5,
    fontWeight: '600',
    color: '#888482',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
