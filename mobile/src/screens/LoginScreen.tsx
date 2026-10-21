/**
 * GBICH'APP — Écran de Connexion Satirique (Login Screen).
 * Interface épurée et moderne : blocs simples sans petits carrés d'angle,
 * occupation intégrale de la hauteur de page sans vide en bas.
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
  const [btnPressed, setBtnPressed] = useState(false);

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

        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate('MainTabs');
        }, 800);
      } else {
        throw new Error('Réponse serveur inattendue');
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
            {/* Section Supérieure : En-tête, Animation & Titre */}
            <View style={styles.topSection}>
              {/* ========================================================= */}
              {/* 1. EN-TÊTE ÉPURÉ (Pas de bordure/carrés d'angle)           */}
              {/* ========================================================= */}
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
              {/* 3. ACCROCHE SATIRIQUE & TITRE                            */}
              {/* ========================================================= */}
              <View style={styles.headlineSection}>
                {/* Badge Alerte Brouteur Zéro simple */}
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

              {/* Bannières simples sans décalage d'angle */}
              {errorMessage ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {successMessage ? (
                <View style={styles.successBanner}>
                  <Text style={styles.successIcon}>🎉</Text>
                  <Text style={styles.successText}>{successMessage}</Text>
                </View>
              ) : null}
            </View>

            {/* Section Inférieure : Formulaire, Bouton & Footer (Plein écran) */}
            <View style={styles.bottomSection}>
              {/* ========================================================= */}
              {/* 4. FORMULAIRE ERGONOMIQUE (Champs simples et propres)     */}
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

                  <View style={styles.inputWrapper}>
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
                </View>

                {/* Case à cocher simple et épurée */}
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
                {/* 5. BOUTON D'ACTION PRINCIPAL AVEC EFFET TACTILE           */}
                {/* ========================================================= */}
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={handleLogin}
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

                {/* Encart Création de Compte simple et épuré */}
                <View style={styles.registerCard}>
                  <Text style={styles.registerCardPrompt}>
                    Pas encore membre de la bande ?
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      alert("Ya pas drap ! Remplis tes coordonnées pour intégrer le djassa GBICH!.");
                    }}
                  >
                    <Text style={styles.registerCardLink}>
                      CRÉER UN COMPTE ICI (C'EST GRATUIT !)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ========================================================= */}
              {/* 6. PIED DE PAGE REHAUSSÉ                                  */}
              {/* ========================================================= */}
              <View style={styles.footerSection}>
                <View style={styles.footerDot} />
                <Text style={styles.footerText}>
                  HUMOUR 100% IVOIRIEN CERTIFIÉ
                </Text>
                <View style={styles.footerDot} />
              </View>
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
    minHeight: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 12 : 24,
    paddingBottom: Platform.OS === 'web' ? 20 : 32,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 480,
    flex: 1,
    justifyContent: 'space-between',
    gap: 14,
  },
  topSection: {
    width: '100%',
    gap: 12,
  },
  bottomSection: {
    width: '100%',
    gap: 12,
    marginTop: 4,
  },

  // 1. En-tête épuré sans bordure ni carrés d'angle
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
  headerLoginText: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 16,
    color: '#F5222D',
    letterSpacing: 1,
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
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 6,
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
    fontSize: Platform.OS === 'web' ? 29 : 26,
    lineHeight: Platform.OS === 'web' ? 35 : 32,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 2,
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

  // Bannières simples
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
    borderWidth: 1.5,
    borderColor: '#52C41A',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 8,
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

  // 4. Formulaire avec champs simples et propres
  formContainer: {
    gap: 13,
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

  // Checkbox simple et épurée
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#171416',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#F5222D',
    borderColor: '#171416',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginTop: -2,
  },
  rememberText: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12.5,
    color: '#171416',
    fontWeight: '600',
  },

  // 5. Bouton principal néo-brutaliste
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
  rocketEmoji: {
    fontSize: 18,
  },

  // Carte Inscription simple et épurée
  registerCard: {
    backgroundColor: '#F0EDEA',
    borderWidth: 2,
    borderColor: '#171416',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
  },
  registerCardPrompt: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 12.5,
    color: '#625D5F',
    fontWeight: '500',
  },
  registerCardLink: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 12.5,
    fontWeight: '800',
    color: '#F5222D',
    letterSpacing: 0.4,
    textDecorationLine: 'underline',
  },

  // 6. Pied de page rehaussé
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 6,
    paddingBottom: 16,
    marginBottom: 4,
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
