/**
 * GBICH'APP — Écran de Connexion Satirique (Login Screen).
 * Style Comic Brutalism selon documentation (connexion.png & code_connexion.html).
 */

import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { AnimatedChaseScene } from '../components/AnimatedChaseScene';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const setSession = useAuthStore((state) => state.setSession);

  // États du formulaire
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // États d'envoi et de feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    const cleanId = identifier.trim();
    const cleanPwd = password.trim();

    if (!cleanId) {
      setErrorMessage("Hé Gaou ! Rentre ton email ou ton numéro avant d'entrer !");
      return;
    }
    if (!cleanPwd) {
      setErrorMessage("Y'a drap ! Tu as oublié de taper ton mot de passe !");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        identifier: cleanId,
        password: cleanPwd,
        remember_me: rememberMe,
      });

      const data = response.data;
      if (data && data.access_token && data.user) {
        setSuccessMessage('BIENVENUE DANS LE DJASSA ! 🎉');
        setSession(data.access_token, data.user);

        // Petit délai visuel pour apprécier la punchline avant navigation
        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate('MainTabs');
        }, 900);
      } else {
        throw new Error('Réponse serveur inattendue');
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail);
      } else if (err.message === 'Network Error' || !err.response) {
        setErrorMessage(
          "Impossible de joindre le serveur GBICH!. Vérifie ta connexion ou le backend !"
        );
      } else {
        setErrorMessage("Alerte dérapage ! Une erreur est survenue lors de la connexion.");
      }
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Onboarding');
    }
  };

  return (
    <ComicHalftoneBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentWrapper}>
            {/* ========================================================= */}
            {/* 1. EN-TÊTE FIXE / NAVIGATION                             */}
            {/* ========================================================= */}
            <View style={styles.topHeader}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  activeOpacity={0.75}
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
                <Text style={styles.headerLoginText}>LOGIN</Text>
                <View style={styles.headerAvatarBadge}>
                  <Text style={styles.headerAvatarIcon}>👤</Text>
                </View>
              </View>
            </View>

            {/* ========================================================= */}
            {/* 2. ANIMATION 2D COURSE-POURSUITE BURLESQUE (SVG)         */}
            {/* ========================================================= */}
            <View style={styles.animationSection}>
              <AnimatedChaseScene />
            </View>

            {/* ========================================================= */}
            {/* 3. ACCROCHE SATIRIQUE & TITRE NÉO-BRUTALISTE              */}
            {/* ========================================================= */}
            <View style={styles.headlineSection}>
              {/* Badge Alerte Brouteur Zéro */}
              <View style={styles.brouteurBadge}>
                <Text style={styles.brouteurIcon}>🛡️</Text>
                <Text style={styles.brouteurText}>ALERTE BROUTEUR ZÉRO</Text>
              </View>

              {/* Titre percutant en Anton */}
              <Text style={styles.mainTitle}>
                <Text style={styles.titleBlack}>TE REVOILÀ, </Text>
                <Text style={styles.titleRed}>GAOU !</Text>
                <Text> 👋</Text>
              </Text>

              {/* Sous-titre satirique d'ambiance */}
              <Text style={styles.subtitleText}>
                « Connecte-toi vite avant que la chicotte ne t'attrape ! »
              </Text>
            </View>

            {/* Message d'erreur (si présent) */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Message de succès (si connexion réussie) */}
            {successMessage ? (
              <View style={styles.successBanner}>
                <Text style={styles.successIcon}>🎉</Text>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* ========================================================= */}
            {/* 4. FORMULAIRE ERGONOMIQUE                                 */}
            {/* ========================================================= */}
            <View style={styles.formContainer}>
              {/* Champ 1 : Identifiant */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>
                    IDENTIFIANT / EMAIL OU TÉLÉPHONE
                  </Text>
                  <Text style={styles.requiredTag}>REQUIS</Text>
                </View>

                <View
                  style={[
                    styles.inputWrapper,
                    Platform.OS === 'web' && (webStyles.inputShadow as any),
                  ]}
                >
                  <Text style={styles.inputLeftIcon}>👤</Text>
                  <TextInput
                    style={[
                      styles.textInputField,
                      Platform.OS === 'web' && ({ outline: 'none' } as any),
                    ]}
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="Ex: zokou@gbich.ci ou 0707..."
                    placeholderTextColor="#8C888A"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Champ 2 : Mot de passe */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>MOT DE PASSE</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      alert("Ya pas drap ! Rapproche-toi du djassa ou contacte le rédacteur en chef.");
                    }}
                  >
                    <Text style={styles.forgotPasswordLink}>
                      Tu as oublié ton code ?
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.inputWrapper,
                    Platform.OS === 'web' && (webStyles.inputShadow as any),
                  ]}
                >
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
              </View>

              {/* Case à cocher : Se souvenir de moi */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberRow}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    rememberMe && styles.checkboxActive,
                  ]}
                >
                  {rememberMe ? <Text style={styles.checkboxCheck}>✓</Text> : null}
                </View>
                <Text style={styles.rememberText}>
                  Se souvenir de moi sur ce djassa
                </Text>
              </TouchableOpacity>

              {/* ========================================================= */}
              {/* 5. BOUTON D'ACTION PRINCIPAL                              */}
              {/* ========================================================= */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleLogin}
                disabled={isLoading}
                style={[
                  styles.submitBtn,
                  isLoading && styles.submitBtnDisabled,
                  Platform.OS === 'web' && (webStyles.btnTactile as any),
                ]}
              >
                {isLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.submitBtnText}>
                      VÉRIFICATION DU GAOU... ⏳
                    </Text>
                  </View>
                ) : (
                  <View style={styles.btnContentRow}>
                    <Text style={styles.submitBtnText}>
                      SE CONNECTER ET ENTRER
                    </Text>
                    <Text style={styles.rocketEmoji}>🚀</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* ========================================================= */}
            {/* 6. PIED DE PAGE & AMBIANCE                                */}
            {/* ========================================================= */}
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 12 : 24,
    paddingBottom: Platform.OS === 'web' ? 32 : 40,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 440,
    gap: 16,
  },

  // 1. En-tête
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
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#171416',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  backBtnArrow: {
    fontSize: 20,
    fontWeight: '900',
    color: '#171416',
    marginTop: -2,
  },
  headerLogo: {
    width: 108,
    height: 36,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLoginText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 16,
    color: '#F5222D',
    letterSpacing: 1,
  },
  headerAvatarBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5222D',
    borderWidth: 2,
    borderColor: '#171416',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 3,
  },
  headerAvatarIcon: {
    fontSize: 15,
  },

  // 2. Animation
  animationSection: {
    width: '100%',
  },

  // 3. Accroche
  headlineSection: {
    gap: 4,
  },
  brouteurBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EBE8E5',
    borderWidth: 1.8,
    borderColor: '#171416',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    gap: 6,
    shadowColor: '#171416',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  brouteurIcon: {
    fontSize: 13,
  },
  brouteurText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 11,
    fontWeight: '800',
    color: '#171416',
    letterSpacing: 0.6,
  },
  mainTitle: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: Platform.OS === 'web' ? 28 : 25,
    lineHeight: Platform.OS === 'web' ? 34 : 31,
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
  subtitleText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 13.5,
    color: '#5E3F3C',
    fontWeight: '500',
    lineHeight: 18,
  },

  // Bannières d'alerte
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderWidth: 2,
    borderColor: '#F5222D',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  errorIcon: {
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FFED',
    borderWidth: 2,
    borderColor: '#52C41A',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  successIcon: {
    fontSize: 16,
  },
  successText: {
    flex: 1,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 14,
    color: '#389E0D',
    letterSpacing: 0.5,
  },

  // 4. Formulaire
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
  forgotPasswordLink: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11.5,
    fontWeight: '700',
    color: '#F5222D',
    textDecorationLine: 'underline',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.2,
    borderColor: '#171416',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
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

  // Checkbox
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#171416',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  checkboxActive: {
    backgroundColor: '#F5222D',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginTop: -2,
  },
  rememberText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12.5,
    color: '#171416',
    fontWeight: '600',
  },

  // 5. Bouton principal
  submitBtn: {
    width: '100%',
    backgroundColor: '#F5222D',
    borderWidth: 3,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171416',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    marginTop: 4,
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
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  rocketEmoji: {
    fontSize: 18,
  },

  // 6. Pied de page
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 8,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F5222D',
  },
  footerText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 10.5,
    fontWeight: '800',
    color: '#625D5F',
    letterSpacing: 0.8,
  },
});

const webStyles = {
  inputShadow: {
    boxShadow: '3px 3px 0px #171416',
  },
  btnTactile: {
    boxShadow: '4px 4px 0px #171416',
    cursor: 'pointer',
  },
};
