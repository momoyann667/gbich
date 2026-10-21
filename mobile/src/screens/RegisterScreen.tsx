/**
 * GBICH'APP — Écran d'Inscription Satirique (Register Screen).
 *
 * Expérience festive et ergonomique :
 * - Badge flottant animé avec compteur social en direct
 * - Onomatopée percutante « CRÉE TON COMPTE GBICH! 💥 »
 * - Formulaire complet avec sélecteur d'indicatif 🇨🇮 +225
 * - Jauge de mot de passe à 3 paliers satiriques (Doux → Chicot 💥 → GBICH BLINDÉ ! 🛡️)
 * - Badges tactiles néo-brutalistes de centres d'intérêt
 * - Encart cadeau de bienvenue (100 gags inédits)
 * - Bouton brutaliste « VALIDER MON INSCRIPTION ⚡ » avec effet tactile
 * - Redirection rapide vers l'écran de connexion
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

interface CountryOption {
  code: string;
  flag: string;
  name: string;
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
];

interface InterestOption {
  id: string;
  label: string;
  emoji: string;
}

const INTERESTS: InterestOption[] = [
  { id: 'bd_strips', label: 'BD & Strips', emoji: '🎨' },
  { id: 'videos_choc', label: 'Vidéos Choc', emoji: '🔥' },
  { id: 'quiz_7_erreurs', label: 'Quiz 7 Erreurs', emoji: '🎯' },
  { id: 'potins_gags', label: 'Potins du Djassa', emoji: '⚡' },
  { id: 'journal_papier', label: 'Journal Papier', emoji: '📰' },
];

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const setSession = useAuthStore((state) => state.setSession);

  // Formulaire states
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRY_OPTIONS[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['bd_strips', 'quiz_7_erreurs']);

  // États UI & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [btnPressed, setBtnPressed] = useState(false);

  // Animations festives
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const starRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation de pulsation continue pour le badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation lente de l'étoile festive
    Animated.loop(
      Animated.timing(starRotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const starRotation = starRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Logique de jauge de solidité à 3 paliers satiriques
  const getPasswordStrength = () => {
    if (!password) {
      return {
        level: 0,
        label: '',
        color: '#D4D0CC',
        percent: '0%',
        desc: '',
      };
    }

    // Détection des caractères spéciaux
    const specialChars = password.match(/[!@#$%^&*(),.?":{}|<>_\-+=~/\\\[\]]/g) || [];
    const count = specialChars.length;

    // Palier 3 : "GBICH BLINDÉ ! 🛡️" (Plusieurs caractères spéciaux et min 6 car.)
    if (count >= 2 && password.length >= 6) {
      return {
        level: 3,
        label: 'GBICH BLINDÉ ! 🛡️',
        color: '#10B981', // Vert émeraude
        percent: '100%',
        desc: 'Blindé comme un coffre-fort ! Imperméable aux chicottes et aux brouteurs !',
      };
    }

    // Palier 2 : "CHICOT 💥" (Minimum 1 caractère spécial)
    if (count >= 1) {
      return {
        level: 2,
        label: 'CHICOT 💥',
        color: '#F5222D', // Rouge GBICH
        percent: '66%',
        desc: 'Ça commence à faire mal ! Ajoute encore un symbole pour passer en blindé.',
      };
    }

    // Palier 1 : "DOUX" (Simple, sans caractère spécial)
    return {
      level: 1,
      label: "C'EST DOUX 🥱",
      color: '#F59E0B', // Orange vif
      percent: '33%',
      desc: "Trop doux ! La chicotte va t'attraper direct. Mets au moins un caractère spécial !",
    };
  };

  const strength = getPasswordStrength();

  // Bascule sélection d'intérêt
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((item) => item !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Traitement d'inscription
  const handleRegister = async () => {
    const cleanUsername = username.trim();
    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErrorMessage("Hé le vanneur ! Entre ton blaze d'artiste avant de continuer !");
      return;
    }
    if (!cleanIdentifier) {
      setErrorMessage("Y'a drap ! Renseigne ton WhatsApp, téléphone ou email !");
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setErrorMessage("Mot de passe trop court ! Mets au moins 4 caractères avec un symbole !");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        username: cleanUsername,
        identifier: cleanIdentifier,
        password: cleanPassword,
        country_code: selectedCountry.code,
        interests: selectedInterests,
      });

      const data = response.data;
      if (data && data.access_token && data.user) {
        setSuccessMessage('BIENVENUE DANS LA BANDE GBICH! 🎉');
        setSession(data.access_token, data.user);

        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate('MainTabs');
        }, 900);
      } else {
        throw new Error('Réponse inattendue');
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail);
      } else if (err.message === 'Network Error' || !err.response) {
        setErrorMessage(
          "Impossible de joindre le serveur GBICH!. Vérifie que le backend tourne sur le port 8000 !"
        );
      } else {
        setErrorMessage("Alerte chicotte ! Une erreur est survenue lors de l'inscription.");
      }
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <ComicHalftoneBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        {/* ========================================================= */}
        {/* EN-TÊTE STATIQUE FIXE EN HAUT                            */}
        {/* ========================================================= */}
        <View style={styles.staticHeaderContainer}>
          <View style={styles.staticHeaderInner}>
            <View style={styles.topHeader}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleBack}
                  style={[
                    styles.backBtn,
                    Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                  ]}
                  accessibilityLabel="Retour"
                >
                  <Text style={styles.backBtnArrow}>←</Text>
                </TouchableOpacity>

                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.headerLogo as any}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.headerRight}>
                <Text style={styles.headerRegisterText}>REJOINDRE</Text>
                <View style={styles.headerAvatarBadge}>
                  <Text style={styles.headerAvatarIcon}>🎭</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentWrapper}>
            {/* ========================================================= */}
            {/* 2. ACCROCHE FESTIVE & COMPTEUR SOCIAL EN DIRECT           */}
            {/* ========================================================= */}
            <View style={styles.heroSection}>
              {/* Badge festif pulsant */}
              <Animated.View
                style={[
                  styles.festiveBadge,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Animated.Text
                  style={[
                    styles.festiveBadgeIcon,
                    { transform: [{ rotate: starRotation }] },
                  ]}
                >
                  ✨
                </Animated.Text>
                <Text style={styles.festiveBadgeText}>
                  REJOINS LE CLAN DES VANNEURS 🎭
                </Text>
              </Animated.View>

              {/* Compteur social live */}
              <View style={styles.socialCounterRow}>
                <View style={styles.livePulseDot} />
                <Text style={styles.socialCounterText}>
                  DÉJÀ <Text style={styles.counterHighlight}>14 500</Text> GBICHEURS CONNECTÉS
                </Text>
              </View>

              {/* Titre onomatopée éclatant en Anton */}
              <Text style={styles.heroMainTitle}>
                <Text style={styles.titleBlack}>CRÉE TON COMPTE </Text>
                <Text style={styles.titleRed}>GBICH!</Text>
                <Text> 💥</Text>
              </Text>

              {/* Sous-titre satirique d'ambiance */}
              <Text style={styles.heroSubtitle}>
                « Entre dans le temple du rire ivoirien sans filtre et sans gaourie ! »
              </Text>
            </View>

            {/* Bannières simples de feedback */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.bannerIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successBanner}>
                <Text style={styles.bannerIcon}>🎉</Text>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* ========================================================= */}
            {/* 3. FORMULAIRE D'INSCRIPTION INTERACTIF                   */}
            {/* ========================================================= */}
            <View style={styles.formContainer}>
              {/* Champ 1 : Nom d'artiste / Pseudo */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>NOM D'ARTISTE / PSEUDO</Text>
                  <Text style={styles.requiredTag}>REQUIS</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLeftIcon}>🎭</Text>
                  <TextInput
                    style={[
                      styles.textInputField,
                      Platform.OS === 'web' && ({ outline: 'none' } as any),
                    ]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Ex: Zokou le Chicot ou Cauphy Gombo"
                    placeholderTextColor="#8C888A"
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
                <Text style={styles.fieldHelper}>
                  Ton blaze officiel de vanneur sur tout le réseau GBICH!
                </Text>
              </View>

              {/* Champ 2 : WhatsApp / Téléphone ou Email */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>WHATSAPP / TÉLÉPHONE OU EMAIL</Text>
                  <Text style={styles.requiredTag}>REQUIS</Text>
                </View>

                <View style={styles.phoneInputRow}>
                  {/* Sélecteur d'indicatif 🇨🇮 +225 */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowCountryPicker(!showCountryPicker)}
                    style={styles.countryPickerBtn}
                  >
                    <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                    <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
                    <Text style={styles.countryArrow}>▾</Text>
                  </TouchableOpacity>

                  {/* Champ de saisie */}
                  <View style={[styles.inputWrapper, styles.phoneInputFlex]}>
                    <Text style={styles.inputLeftIcon}>📱</Text>
                    <TextInput
                      style={[
                        styles.textInputField,
                        Platform.OS === 'web' && ({ outline: 'none' } as any),
                      ]}
                      value={identifier}
                      onChangeText={setIdentifier}
                      placeholder="0707... ou zokou@gbich.ci"
                      placeholderTextColor="#8C888A"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* Dropdown d'indicatifs populaires */}
                {showCountryPicker ? (
                  <View style={styles.countryDropdown}>
                    {COUNTRY_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.code}
                        activeOpacity={0.7}
                        onPress={() => {
                          setSelectedCountry(opt);
                          setShowCountryPicker(false);
                        }}
                        style={[
                          styles.countryOptionRow,
                          selectedCountry.code === opt.code && styles.countryOptionActive,
                        ]}
                      >
                        <Text style={styles.countryFlag}>{opt.flag}</Text>
                        <Text style={styles.countryOptionName}>{opt.name}</Text>
                        <Text style={styles.countryOptionCode}>{opt.code}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* Champ 3 : Mot de passe & Jauge Satirique */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>MOT DE PASSE</Text>
                  <Text style={styles.requiredTag}>REQUIS</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLeftIcon}>🔒</Text>
                  <TextInput
                    style={[
                      styles.textInputField,
                      Platform.OS === 'web' && ({ outline: 'none' } as any),
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#8C888A"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    accessibilityLabel="Afficher ou masquer le mot de passe"
                  >
                    <Text style={styles.eyeBtnIcon}>
                      {showPassword ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ========================================================= */}
                {/* JAUGE DE SOLIDITÉ À PALIERS SATIRIQUES                   */}
                {/* ========================================================= */}
                {password.length > 0 ? (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthHeaderRow}>
                      <Text style={styles.strengthPrompt}>SOLIDITÉ :</Text>
                      <Text
                        style={[
                          styles.strengthLabel,
                          { color: strength.color },
                        ]}
                      >
                        {strength.label}
                      </Text>
                    </View>

                    {/* Barre de progression à 3 segments */}
                    <View style={styles.strengthTrack}>
                      <View
                        style={[
                          styles.strengthFill,
                          {
                            width: strength.percent as any,
                            backgroundColor: strength.color,
                          },
                        ]}
                      />
                    </View>

                    <Text style={styles.strengthDescription}>
                      {strength.desc}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.fieldHelper}>
                    Conseil : ajoute au moins 1 caractère spécial (!@#$%) pour débloquer le palier Chicot !
                  </Text>
                )}
              </View>

              {/* Champ 4 : Sélecteur de centres d'intérêt */}
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>
                  TES DOSSIERS PRÉFÉRÉS DANS LE DJASSA
                </Text>

                <View style={styles.interestsGrid}>
                  {INTERESTS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.8}
                        onPress={() => toggleInterest(item.id)}
                        style={[
                          styles.interestChip,
                          isSelected && styles.interestChipActive,
                        ]}
                      >
                        <Text style={styles.interestEmoji}>{item.emoji}</Text>
                        <Text
                          style={[
                            styles.interestLabel,
                            isSelected && styles.interestLabelActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isSelected ? (
                          <Text style={styles.interestCheck}>✓</Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* ========================================================= */}
              {/* 4. ENCART CADEAU DE BIENVENUE                             */}
              {/* ========================================================= */}
              <View style={styles.welcomeGiftCard}>
                <View style={styles.giftIconWrapper}>
                  <Text style={styles.giftEmoji}>🎁</Text>
                </View>
                <View style={styles.giftContent}>
                  <Text style={styles.giftTitle}>
                    CADEAU DE BIENVENUE IMMÉDIAT !
                  </Text>
                  <Text style={styles.giftDescription}>
                    Accès direct débloqué aux <Text style={styles.giftHighlight}>100 gags & strips satiriques inédits</Text> dès la validation de ton inscription.
                  </Text>
                </View>
              </View>

              {/* ========================================================= */}
              {/* 5. BOUTON PRINCIPAL VALIDER MON INSCRIPTION               */}
              {/* ========================================================= */}
              <TouchableOpacity
                activeOpacity={0.92}
                onPress={handleRegister}
                onPressIn={() => setBtnPressed(true)}
                onPressOut={() => setBtnPressed(false)}
                disabled={isLoading}
                style={[
                  styles.submitBtn,
                  btnPressed && styles.submitBtnPressed,
                  isLoading && styles.submitBtnDisabled,
                  Platform.OS === 'web' && ({
                    cursor: 'pointer',
                    boxShadow: btnPressed ? '0px 0px 0px #121212' : '4px 4px 0px #121212',
                    transform: btnPressed ? 'translate(3px, 3px)' : 'none',
                    transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                  } as any),
                ]}
              >
                {isLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.submitBtnText}>
                      ENREGISTREMENT DU BLAZE... ⏳
                    </Text>
                  </View>
                ) : (
                  <View style={styles.btnContentRow}>
                    <Text style={styles.submitBtnText}>
                      VALIDER MON INSCRIPTION
                    </Text>
                    <Text style={styles.lightningEmoji}>⚡</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* ========================================================= */}
              {/* 6. BASCULE RAPIDE VERS LA CONNEXION                       */}
              {/* ========================================================= */}
              <View style={styles.loginRedirectCard}>
                <Text style={styles.loginRedirectPrompt}>
                  Déjà membre de la bande ?
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginRedirectLink}>
                    CONNECTE-TOI DIRECTEMENT ➔
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Pied de page satirique */}
            <View style={styles.footerSection}>
              <View style={styles.footerDot} />
              <Text style={styles.footerText}>
                HUMOUR 100% IVOIRIEN CERTIFIÉ
              </Text>
              <View style={styles.footerDot} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ComicHalftoneBackground>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    width: '100%',
  },
  staticHeaderContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 20,
    backgroundColor: '#FAF7F2',
  },
  staticHeaderInner: {
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 12 : 24,
    paddingBottom: 6,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 24 : 36,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 480,
    gap: 16,
  },

  // 1. En-tête épuré
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnArrow: {
    fontSize: 24,
    fontWeight: '700',
    color: '#171416',
    marginTop: -2,
  },
  headerLogo: {
    width: 110,
    height: 38,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRegisterText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 15,
    color: '#F5222D',
    letterSpacing: 0.8,
  },
  headerAvatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5222D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F5222D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  headerAvatarIcon: {
    fontSize: 16,
  },

  // 2. Section Hero & Compteur Social
  heroSection: {
    gap: 6,
  },
  festiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFE600',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 9999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    gap: 6,
  },
  festiveBadgeIcon: {
    fontSize: 14,
  },
  festiveBadgeText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 11.5,
    fontWeight: '800',
    color: '#171416',
    letterSpacing: 0.6,
  },
  socialCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  socialCounterText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '700',
    color: '#625D5F',
    letterSpacing: 0.5,
  },
  counterHighlight: {
    color: '#F5222D',
    fontWeight: '900',
  },
  heroMainTitle: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: Platform.OS === 'web' ? 29 : 26,
    lineHeight: Platform.OS === 'web' ? 35 : 32,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  titleBlack: {
    color: '#171416',
  },
  titleRed: {
    color: '#F5222D',
  },
  heroSubtitle: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 13.5,
    color: '#5E3F3C',
    fontWeight: '500',
    lineHeight: 18,
  },

  // Feedback bannières
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderWidth: 1.5,
    borderColor: '#F5222D',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 8,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FFED',
    borderWidth: 1.5,
    borderColor: '#52C41A',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 8,
  },
  bannerIcon: {
    fontSize: 16,
  },
  errorText: {
    flex: 1,
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '700',
    color: '#B70014',
    lineHeight: 16,
  },
  successText: {
    flex: 1,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 14,
    color: '#389E0D',
    letterSpacing: 0.5,
  },

  // 3. Formulaire
  formContainer: {
    gap: 14,
    width: '100%',
  },
  inputGroup: {
    gap: 6,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '800',
    color: '#171416',
    letterSpacing: 0.4,
  },
  requiredTag: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 11,
    fontWeight: '800',
    color: '#F5222D',
  },
  fieldHelper: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11.5,
    color: '#7A7577',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    overflow: 'hidden',
  },
  inputLeftIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  textInputField: {
    flex: 1,
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 14,
    fontWeight: '500',
    color: '#171416',
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 4,
  },
  eyeBtnIcon: {
    fontSize: 16,
  },

  // Téléphone & Sélecteur pays
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
    gap: 4,
  },
  countryFlag: {
    fontSize: 18,
  },
  countryCodeText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 13,
    fontWeight: '800',
    color: '#171416',
  },
  countryArrow: {
    fontSize: 12,
    color: '#625D5F',
  },
  phoneInputFlex: {
    flex: 1,
  },
  countryDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 10,
    padding: 6,
    gap: 4,
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  countryOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 8,
  },
  countryOptionActive: {
    backgroundColor: '#FFE600',
  },
  countryOptionName: {
    flex: 1,
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 13,
    fontWeight: '600',
    color: '#171416',
  },
  countryOptionCode: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 13,
    fontWeight: '800',
    color: '#F5222D',
  },

  // Jauge de mot de passe
  strengthContainer: {
    backgroundColor: '#F8F5F2',
    borderWidth: 1.5,
    borderColor: '#D4D0CC',
    borderRadius: 10,
    padding: 10,
    gap: 6,
  },
  strengthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthPrompt: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 11,
    fontWeight: '800',
    color: '#625D5F',
  },
  strengthLabel: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  strengthTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#E8E5E2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 4,
  },
  strengthDescription: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11.5,
    color: '#4A4648',
    fontWeight: '500',
    lineHeight: 15,
  },

  // Badges centres d'intérêt
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  interestChipActive: {
    backgroundColor: '#F5222D',
    borderColor: '#171416',
  },
  interestEmoji: {
    fontSize: 13,
  },
  interestLabel: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12,
    fontWeight: '700',
    color: '#171416',
  },
  interestLabelActive: {
    color: '#FFFFFF',
  },
  interestCheck: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // 4. Cadeau de bienvenue
  welcomeGiftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE6',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginTop: 2,
  },
  giftIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE600',
    borderWidth: 1.5,
    borderColor: '#171416',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftEmoji: {
    fontSize: 18,
  },
  giftContent: {
    flex: 1,
    gap: 2,
  },
  giftTitle: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    color: '#D48800',
    letterSpacing: 0.5,
  },
  giftDescription: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11.5,
    color: '#4A4648',
    lineHeight: 15,
  },
  giftHighlight: {
    fontWeight: '700',
    color: '#171416',
  },

  // 5. Bouton principal
  submitBtn: {
    width: '100%',
    backgroundColor: '#F5222D',
    borderWidth: 3,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 6,
  },
  submitBtnPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  submitBtnDisabled: {
    opacity: 0.85,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 16.5,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  lightningEmoji: {
    fontSize: 18,
  },

  // 6. Bascule vers la connexion
  loginRedirectCard: {
    backgroundColor: '#F0EDEA',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },
  loginRedirectPrompt: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12.5,
    color: '#625D5F',
    fontWeight: '500',
  },
  loginRedirectLink: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12.5,
    fontWeight: '800',
    color: '#F5222D',
    letterSpacing: 0.4,
    textDecorationLine: 'underline',
  },

  // Footer
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F5222D',
  },
  footerText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 11,
    fontWeight: '800',
    color: '#625D5F',
    letterSpacing: 0.8,
  },
});
