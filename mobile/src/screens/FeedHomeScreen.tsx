/**
 * GBICH'APP — Écran d'Accueil (FeedHomeScreen).
 * Reproduction fidèle et percutante de l'écran d'accueil officiel (accueil.png).
 *
 * Sections :
 * 1. Header & Alerte Satirique (Logo GBICH!, recherche, notifications, profil OU bouton Se connecter)
 * 2. Ruban d'actu défilant caustique (Wolo Flash) & Solde d'Enjaillement (1 250 Coins)
 * 3. La « Une » du Vendredi (Hero Satirique Cauphy Gombo)
 * 4. Filtres Thématiques & Strips Croustillants (Cauphy Gombo au Tribunal, Jo Bleck, Sergent Gazeur)
 * 5. Punchline Vidéo (Capsule 45s) & Défi Quotidien (Jeux 7 erreurs)
 * 6. La Vanne de la Communauté
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GBICH_COLORS } from '../theme/tokens';
import { useAuthStore } from '../store/authStore';
import { ComicHalftoneBackground } from '../components/common/ComicHalftoneBackground';

interface FeedHomeScreenProps {
  navigation?: any;
}

export const FeedHomeScreen: React.FC<FeedHomeScreenProps> = ({ navigation }) => {
  const { user, isAuthenticated, isGuest } = useAuthStore();

  // État de recherche
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtre thématique sélectionné
  const [selectedFilter, setSelectedFilter] = useState<string>('Tout chaud 🔥');

  // Animation pour le ruban défilant Wolo Flash
  const tickerAnim = useRef(new Animated.Value(0)).current;
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modal de recharge de coins
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState<boolean>(false);

  // Modal lecteur strip / démo
  const [activeStripModal, setActiveStripModal] = useState<string | null>(null);

  useEffect(() => {
    // Animation de défilement subtile ou pulsation pour le flash d'info
    const animLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tickerAnim, {
          toValue: -15,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(tickerAnim, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    );
    animLoop.start();
    return () => animLoop.stop();
  }, [tickerAnim]);

  const handleGoToLogin = () => {
    navigation?.navigate('Login');
  };

  const handleAudioToggle = () => {
    setIsMuted(!isMuted);
    if (Platform.OS === 'web') {
      window.alert(
        !isMuted
          ? '🔇 Son coupé. Silence au Djassa !'
          : '📢 Tchôôô ! Son activé : "Le gombo a pris l\'ascenseur, préparez la monnaie !"'
      );
    } else {
      Alert.alert(
        'Flash Satirique',
        !isMuted
          ? '🔇 Son coupé.'
          : '📢 Tchôôô ! Son activé : "Le gombo a pris l\'ascenseur !"'
      );
    }
  };

  const thematicFilters = [
    'Tout chaud 🔥',
    'Strips Nouchi 📚',
    'Scandales 🚨',
    'Caricatures 🎨',
    'Micro-Trottoir 🎤',
  ];

  return (
    <ComicHalftoneBackground>
      <View style={styles.outerContainer}>
        {/* ========================================================= */}
        {/* 1. HEADER & ALERTE SATIRIQUE                              */}
        {/* ========================================================= */}
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerAccueilTitle}>ACCUEIL</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Si invité ou non connecté : Bouton "Se connecter" proéminent */}
            {!isAuthenticated || isGuest ? (
              <TouchableOpacity
                style={styles.connectBtn}
                activeOpacity={0.85}
                onPress={handleGoToLogin}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={18}
                  color="#FFFFFF"
                  style={styles.connectBtnIcon}
                />
                <Text style={styles.connectBtnText}>Se connecter</Text>
              </TouchableOpacity>
            ) : (
              // Si connecté : Solde de coins, recherche, notifications & avatar
              <View style={styles.authHeaderCluster}>
                {/* Badge Coins */}
                <TouchableOpacity
                  style={styles.headerCoinPill}
                  activeOpacity={0.8}
                  onPress={() => setIsRechargeModalOpen(true)}
                >
                  <Text style={styles.coinPillIcon}>🪙</Text>
                  <Text style={styles.coinPillAmount}>450</Text>
                </TouchableOpacity>

                {/* Loupe recherche */}
                <TouchableOpacity
                  style={styles.headerIconBtn}
                  activeOpacity={0.75}
                  onPress={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Ionicons name="search" size={20} color="#171416" />
                </TouchableOpacity>

                {/* Cloche notification avec point rouge */}
                <TouchableOpacity
                  style={styles.headerIconBtn}
                  activeOpacity={0.75}
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      window.alert('🔔 3 nouvelles vannes croustillantes au Djassa !');
                    } else {
                      Alert.alert('Notifications', '3 nouvelles vannes croustillantes au Djassa !');
                    }
                  }}
                >
                  <Ionicons name="notifications-outline" size={20} color="#171416" />
                  <View style={styles.notifDot} />
                </TouchableOpacity>

                {/* Avatar utilisateur */}
                <TouchableOpacity
                  style={styles.userAvatarCircle}
                  activeOpacity={0.85}
                  onPress={() => navigation?.navigate('Profile')}
                >
                  <Text style={styles.userAvatarText}>
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : 'GB'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Barre de recherche déroulante */}
        {isSearchOpen && (
          <View style={styles.searchBarContainer}>
            <Ionicons name="search-outline" size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un strip, personnage, vanne..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* CONTENU SCROLLABLE */}
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ========================================================= */}
          {/* 2. RUBAN DÉFILANT D'ACTU CAUSTIQUE (WOLO FLASH)           */}
          {/* ========================================================= */}
          <View style={styles.woloFlashCard}>
            <View style={styles.woloMetaRow}>
              <View style={styles.woloBadge}>
                <Text style={styles.woloBadgeText}>📢 WOLO FLASH</Text>
              </View>
              <Text style={styles.woloWeatherText}>
                ABIDJAN 32°C • MOITEUR & DÉLIRES
              </Text>
            </View>

            <View style={styles.woloHeadlineRow}>
              <Animated.View
                style={[
                  styles.woloHeadlineTrack,
                  { transform: [{ translateX: tickerAnim }] },
                ]}
              >
                <Text style={styles.woloHeadlineText}>
                  🔥 TCHÔÔ ! Y'A DRAP : LE GOMBO A AUGMENTÉ...
                </Text>
              </Animated.View>

              <TouchableOpacity
                style={styles.speakerBtn}
                activeOpacity={0.85}
                onPress={handleAudioToggle}
              >
                <Ionicons
                  name={isMuted ? 'volume-mute' : 'megaphone'}
                  size={15}
                  color="#F5222D"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ========================================================= */}
          {/* BANDEAU DU SOLDE D'ENJAILLEMENT                           */}
          {/* ========================================================= */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceLeft}>
              <View style={styles.coinRedSphere}>
                <Text style={styles.coinSphereIcon}>🪙</Text>
              </View>
              <View style={styles.balanceTextWrap}>
                <Text style={styles.balanceLabel}>SOLDE D'ENJAILLEMENT</Text>
                <Text style={styles.balanceAmount}>1 250 COINS</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.rechargePillBtn}
              activeOpacity={0.85}
              onPress={() => setIsRechargeModalOpen(true)}
            >
              <Text style={styles.rechargePillText}>✚ Recharger</Text>
            </TouchableOpacity>
          </View>

          {/* ========================================================= */}
          {/* 3. LA « UNE » DU VENDREDI (HERO SATIRIQUE)                */}
          {/* ========================================================= */}
          <View style={styles.heroCard}>
            {/* Header supérieur de la Une */}
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroIssueWrap}>
                <View style={styles.heroIssueBadge}>
                  <Text style={styles.heroIssueText}>N° 342 • VENDREDI CHOC</Text>
                </View>
                <View style={styles.heroRedDot} />
              </View>
              <Text style={styles.heroExclusifText}>EXCLUSIF</Text>
            </View>

            {/* Cadre Illustration Comic Cauphy Gombo */}
            <View style={styles.heroComicFrame}>
              {/* Halftone Dot Matrix Pattern */}
              <View style={styles.halftoneDotPattern}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <View key={i} style={styles.halftoneDot} />
                ))}
              </View>

              {/* Personnage Cauphy Gombo ultra net */}
              <Image
                source={require('../../assets/image_onboarding_2.png')}
                style={styles.heroCauphyImg}
                resizeMode="contain"
              />

              {/* Sticker Comic Incliné GBICH! */}
              <View style={styles.heroStickerBadge}>
                <Text style={styles.heroStickerText}>GBICH!</Text>
              </View>

              {/* Compteur de vues en direct */}
              <View style={styles.heroViewsPill}>
                <Ionicons name="eye-outline" size={12} color="#F5222D" style={{ marginRight: 4 }} />
                <Text style={styles.heroViewsText}>14.2k vues ce matin</Text>
              </View>
            </View>

            {/* Contenu Satirique de la Une */}
            <View style={styles.heroContentWrap}>
              <View style={styles.heroCategoryRow}>
                <Ionicons name="flame" size={14} color="#F5222D" style={{ marginRight: 4 }} />
                <Text style={styles.heroCategoryTitle}>SCANDALE AU DJASSA</Text>
              </View>

              <Text style={styles.heroMainTitle}>
                AFFAIRE DE VISAS & CHICOTTE : LES VOYAGEURS DU DJASSA !
              </Text>

              <Text style={styles.heroSubtitle}>
                Cauphy Gombo a encore ouvert son faux consulat à Adjamé Mirador. Les passeports sont sortis avec des tampons en caoutchouc de pneu de gbaka !
              </Text>

              {/* Statistiques d'engagement */}
              <View style={styles.heroStatsRow}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.statEmoji}>😂</Text>
                  <Text style={styles.statLabel}>4.8k fous rires</Text>
                </View>
                <View style={styles.heroStatItem}>
                  <Text style={styles.statEmoji}>💬</Text>
                  <Text style={styles.statLabel}>382 clashs</Text>
                </View>
                <View style={styles.heroReadTimeWrap}>
                  <Text style={styles.statReadTime}>Lecture : 2 min</Text>
                </View>
              </View>

              {/* Bouton d'action principal */}
              <TouchableOpacity
                style={styles.heroActionBtn}
                activeOpacity={0.88}
                onPress={() => setActiveStripModal('Affaire de Visas & Chicotte')}
              >
                <Text style={styles.heroActionBtnText}>
                  📖 LIRE LE STRIP CHOC ⚡
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ========================================================= */}
          {/* 4. FILTRES THÉMATIQUES                                    */}
          {/* ========================================================= */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
            style={styles.filtersScrollView}
          >
            {thematicFilters.map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.8}
                  onPress={() => setSelectedFilter(filter)}
                  style={[
                    styles.filterChip,
                    isActive ? styles.filterChipActive : styles.filterChipInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive ? styles.filterChipTextActive : styles.filterChipTextInactive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ========================================================= */}
          {/* 5. SÉLECTION DE BD PHARES (STRIPS CROUSTILLANTS)          */}
          {/* ========================================================= */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionHeaderRedDot} />
              <Text style={styles.sectionHeaderTitle}>LES STRIPS CROUSTILLANTS</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('Kiosk')}
            >
              <Text style={styles.sectionViewAllText}>VOIR TOUT &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* BD 1 : Cauphy Gombo au Tribunal (Gratuit) */}
          <TouchableOpacity
            style={styles.stripCard}
            activeOpacity={0.9}
            onPress={() => setActiveStripModal('Cauphy Gombo au Tribunal')}
          >
            <View style={styles.stripThumbWrap}>
              <Image
                source={require('../../assets/thumb_tribunal.png')}
                style={styles.stripThumbImg}
                resizeMode="cover"
              />
              <View style={styles.stripBadgeRed}>
                <Text style={styles.stripBadgeRedText}>NOUVEAU</Text>
              </View>
            </View>

            <View style={styles.stripInfoCol}>
              <Text style={styles.stripCategory}>SÉRIE CULTE</Text>
              <Text style={styles.stripTitle}>CAUPHY GOMBO AU TRIBUNAL</Text>
              <Text style={styles.stripSubtitle} numberOfLines={1}>
                Le juge a demandé les pièces, il a apporté un pagne...
              </Text>
              <View style={styles.stripMetaRow}>
                <View style={styles.freePill}>
                  <Text style={styles.freePillText}>GRATUIT</Text>
                </View>
              </View>
            </View>

            <View style={styles.stripActionCircleRed}>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* BD 2 : Jo Bleck contre les Gnambros (5 Coins) */}
          <TouchableOpacity
            style={styles.stripCard}
            activeOpacity={0.9}
            onPress={() => setActiveStripModal('Jo Bleck contre les Gnambros')}
          >
            <View style={styles.stripThumbWrap}>
              <Image
                source={require('../../assets/thumb_jobleck.png')}
                style={styles.stripThumbImg}
                resizeMode="cover"
              />
              <View style={styles.stripBadgeBlack}>
                <Text style={styles.stripBadgeBlackText}>TOP LU</Text>
              </View>
            </View>

            <View style={styles.stripInfoCol}>
              <Text style={styles.stripCategory}>ACTION GBICH!</Text>
              <Text style={styles.stripTitle}>JO BLECK CONTRE LES GNAMBROS</Text>
              <Text style={styles.stripSubtitle} numberOfLines={1}>
                Affaire de monnaie dans gbaka de Yopougon...
              </Text>
              <View style={styles.stripMetaRow}>
                <View style={styles.coinsPill}>
                  <Text style={styles.coinsPillText}>5 COINS</Text>
                </View>
              </View>
            </View>

            <View style={styles.stripActionCircleGrey}>
              <Ionicons name="arrow-forward" size={14} color="#666666" />
            </View>
          </TouchableOpacity>

          {/* BD 3 : Sergent Gazeur & la Circulation (Gratuit) */}
          <TouchableOpacity
            style={styles.stripCard}
            activeOpacity={0.9}
            onPress={() => setActiveStripModal('Sergent Gazeur & la Circulation')}
          >
            <View style={styles.stripThumbWrap}>
              <Image
                source={require('../../assets/thumb_gazeur.png')}
                style={styles.stripThumbImg}
                resizeMode="cover"
              />
            </View>

            <View style={styles.stripInfoCol}>
              <Text style={styles.stripCategory}>HUMOUR URBAIN</Text>
              <Text style={styles.stripTitle}>SERGENT GAZEUR & LA CIRCULATION</Text>
              <Text style={styles.stripSubtitle} numberOfLines={1}>
                Quand le sifflet refuse de siffler sous le soleil...
              </Text>
              <View style={styles.stripMetaRow}>
                <View style={styles.freePill}>
                  <Text style={styles.freePillText}>GRATUIT</Text>
                </View>
              </View>
            </View>

            <View style={styles.stripActionCircleGrey}>
              <Ionicons name="arrow-forward" size={14} color="#666666" />
            </View>
          </TouchableOpacity>

          {/* ========================================================= */}
          {/* 6. PUNCHLINE VIDÉO (CAPSULE 45S)                          */}
          {/* ========================================================= */}
          <View style={styles.videoCard}>
            <View style={styles.videoHeaderRow}>
              <View style={styles.videoHeaderLeft}>
                <View style={styles.videoRedPlayDot}>
                  <Ionicons name="play" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.videoHeaderTitle}>PUNCHLINE VIDÉO</Text>
              </View>
              <View style={styles.videoCapsulePill}>
                <Text style={styles.videoCapsuleText}>CAPSULE 45S</Text>
              </View>
            </View>

            {/* Vignette Vidéo avec bouton Play central */}
            <TouchableOpacity
              style={styles.videoThumbWrap}
              activeOpacity={0.88}
              onPress={() => navigation?.navigate('Videos')}
            >
              <Image
                source={require('../../assets/video_thumb_clean.png')}
                style={styles.videoThumbImg}
                resizeMode="cover"
              />
              <View style={styles.videoPlayOverlayBtn}>
                <Ionicons name="play" size={24} color="#F5222D" style={{ marginLeft: 3 }} />
              </View>
              <View style={styles.videoDurationPill}>
                <Text style={styles.videoDurationText}>0:45</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.videoTitle}>
              MICRO-TROTTOIR PLATEAU : TU PRÉFÈRES L'AMOUR SINCÈRE OU LE GARBA CHAUD ?
            </Text>

            <Text style={styles.videoSubtitle}>
              Les réponses des étudiants de Cocody vont vous terrasser par terre !
            </Text>
          </View>

          {/* ========================================================= */}
          {/* 7. DÉFI QUOTIDIEN (JEUX)                                  */}
          {/* ========================================================= */}
          <View style={styles.defiCard}>
            <View style={styles.defiHeaderRow}>
              <View style={styles.defiPillBadge}>
                <Text style={styles.defiPillBadgeText}>DÉFI QUOTIDIEN</Text>
              </View>
              <Text style={styles.defiRewardText}>✪ GAGNE +50 COINS</Text>
            </View>

            {/* Illustration Grille de Jeux */}
            <Image
              source={require('../../assets/defi_jeux_clean.png')}
              style={styles.defiGameBoardImg}
              resizeMode="cover"
            />

            <Text style={styles.defiTitle}>
              LE QUIZ SATIRIQUE DES 7 ERREURS D'ABIDJAN
            </Text>

            <Text style={styles.defiSubtitle}>
              Trouve les différences entre les promesses de campagne et le goudron actuel avant la fin du sablier !
            </Text>

            <TouchableOpacity
              style={styles.defiActionBtn}
              activeOpacity={0.88}
              onPress={() => navigation?.navigate('Games')}
            >
              <Text style={styles.defiActionBtnText}>
                🎮 JOUER MAINTENANT 🎮
              </Text>
            </TouchableOpacity>
          </View>

          {/* ========================================================= */}
          {/* 8. LA VANNE DE LA COMMUNAUTÉ                              */}
          {/* ========================================================= */}
          <View style={styles.communityCard}>
            <View style={styles.communityHeaderRow}>
              <View style={styles.communityHeaderLeft}>
                <Ionicons name="chatbubble-ellipses-outline" size={14} color="#F5222D" style={{ marginRight: 6 }} />
                <Text style={styles.communityHeaderTitle}>LA PUNCHLINE DES LECTEURS</Text>
              </View>
              <Text style={styles.communityLocationText}>Yopougon Side</Text>
            </View>

            {/* Bulle de BD Punchline */}
            <View style={styles.speechBubbleCard}>
              <Text style={styles.speechBubbleQuote}>
                « MON FRÈRE, LA VIE EST DEVENUE CHÈRE AU PAYS, MÊME POUR SALUER QUELQU'UN POLIMENT AU QUARTIER IL FAUT PASSER PAR ORANGE MONEY ! »
              </Text>
            </View>

            {/* Auteur de la vanne */}
            <View style={styles.communityAuthorRow}>
              <View style={styles.communityAuthorLeft}>
                <View style={styles.communityAvatar}>
                  <Text style={styles.communityAvatarText}>KM</Text>
                </View>
                <Text style={styles.communityUsername}>@KouadioLeMoqueur</Text>
              </View>

              <View style={styles.communityLikesWrap}>
                <Ionicons name="heart-outline" size={14} color="#F5222D" style={{ marginRight: 4 }} />
                <Text style={styles.communityLikesText}>1 420 vannes</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>

        {/* ========================================================= */}
        {/* MODAL RECHARGE DE COINS                                   */}
        {/* ========================================================= */}
        <Modal
          visible={isRechargeModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsRechargeModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>RECHARGE D'ENJAILLEMENT 🪙</Text>
                <TouchableOpacity onPress={() => setIsRechargeModalOpen(false)}>
                  <Ionicons name="close" size={24} color="#171416" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDesc}>
                Fais le plein de Gbich Coins pour débloquer les numéros collector, strips exclusifs et participer aux tournois de jeux !
              </Text>

              <View style={styles.coinPacks}>
                <TouchableOpacity
                  style={styles.coinPackItem}
                  onPress={() => {
                    setIsRechargeModalOpen(false);
                    if (Platform.OS === 'web') {
                      window.alert('Pack 500 Coins sélectionné (500 FCFA via Wave/Orange Money)');
                    } else {
                      Alert.alert('Pack Coins', 'Pack 500 Coins sélectionné (500 FCFA)');
                    }
                  }}
                >
                  <Text style={styles.packCoins}>500 COINS</Text>
                  <Text style={styles.packPrice}>500 FCFA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.coinPackItem, styles.coinPackPopular]}
                  onPress={() => {
                    setIsRechargeModalOpen(false);
                    if (Platform.OS === 'web') {
                      window.alert('Pack 1 250 Coins sélectionné (1 000 FCFA + 250 Bonus !)');
                    } else {
                      Alert.alert('Pack Coins', 'Pack 1 250 Coins sélectionné (1 000 FCFA)');
                    }
                  }}
                >
                  <View style={styles.packPopularBadge}>
                    <Text style={styles.packPopularText}>TOP VALEUR</Text>
                  </View>
                  <Text style={styles.packCoins}>1 250 COINS</Text>
                  <Text style={styles.packPrice}>1 000 FCFA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.coinPackItem}
                  onPress={() => {
                    setIsRechargeModalOpen(false);
                    if (Platform.OS === 'web') {
                      window.alert('Pack 3 000 Coins sélectionné (2 000 FCFA)');
                    } else {
                      Alert.alert('Pack Coins', 'Pack 3 000 Coins sélectionné (2 000 FCFA)');
                    }
                  }}
                >
                  <Text style={styles.packCoins}>3 000 COINS</Text>
                  <Text style={styles.packPrice}>2 000 FCFA</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsRechargeModalOpen(false)}
              >
                <Text style={styles.modalCloseBtnText}>FERMER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ========================================================= */}
        {/* MODAL LECTEUR STRIP CHOC                                  */}
        {/* ========================================================= */}
        <Modal
          visible={activeStripModal !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setActiveStripModal(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{activeStripModal}</Text>
                <TouchableOpacity onPress={() => setActiveStripModal(null)}>
                  <Ionicons name="close" size={24} color="#171416" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDesc}>
                Chargement des planches satiriques haute définition de GBICH!...
              </Text>

              <Image
                source={require('../../assets/hero_cauphy_gombo.png')}
                style={styles.modalPreviewImg}
                resizeMode="contain"
              />

              <TouchableOpacity
                style={styles.modalActionBtn}
                onPress={() => {
                  setActiveStripModal(null);
                  if (Platform.OS === 'web') {
                    window.alert('Bonne lecture du strip choc !');
                  } else {
                    Alert.alert('Strip Choc', 'Bonne lecture du strip !');
                  }
                }}
              >
                <Text style={styles.modalActionBtnText}>COMMENCER LA LECTURE ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ComicHalftoneBackground>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  // 1. HEADER STATIQUE
  topHeader: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E8E5E2',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 86,
    height: 32,
  },
  headerTitleWrap: {
    borderLeftWidth: 1.5,
    borderLeftColor: '#E0DCD6',
    paddingLeft: 8,
  },
  headerAccueilTitle: {
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#F5222D',
    letterSpacing: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5222D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#171416',
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px #171416', cursor: 'pointer' } as any,
      default: { elevation: 2 },
    }),
  },
  connectBtnIcon: {
    marginRight: 4,
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.3,
  },
  authHeaderCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCoinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E8E5E2',
  },
  coinPillIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  coinPillAmount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#171416',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7F4EE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  notifDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F5222D',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  userAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5222D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#171416',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
  },

  // Barre de recherche
  searchBarContainer: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5E2',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#171416',
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    paddingVertical: 4,
  },

  // SCROLL WRAPPER
  scrollWrapper: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },

  // 2. RUBAN FLASH INFO (WOLO FLASH)
  woloFlashCard: {
    width: '100%',
    backgroundColor: '#F5222D',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#171416',
    padding: 10,
    marginBottom: 12,
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px #171416' } as any,
      default: { elevation: 3 },
    }),
  },
  woloMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  woloBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  woloBadgeText: {
    color: '#F5222D',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  woloWeatherText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.3,
  },
  woloHeadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  woloHeadlineTrack: {
    flex: 1,
  },
  woloHeadlineText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  speakerBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },

  // BANDEAU DU SOLDE D'ENJAILLEMENT
  balanceCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#171416',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px #171416' } as any,
      default: { elevation: 2 },
    }),
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinRedSphere: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1F0',
    borderWidth: 1.5,
    borderColor: '#F5222D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  coinSphereIcon: {
    fontSize: 18,
  },
  balanceTextWrap: {
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 9.5,
    color: '#666666',
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 18,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.5,
  },
  rechargePillBtn: {
    backgroundColor: '#F5222D',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#171416',
    ...Platform.select({
      web: { boxShadow: '1.5px 1.5px 0px #171416', cursor: 'pointer' } as any,
      default: { elevation: 2 },
    }),
  },
  rechargePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },

  // 3. LA « UNE » DU VENDREDI (HERO SATIRIQUE)
  heroCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#171416',
    padding: 12,
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #171416' } as any,
      default: {
        shadowColor: '#171416',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
      },
    }),
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroIssueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroIssueBadge: {
    backgroundColor: '#171416',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroIssueText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.5,
  },
  heroRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F5222D',
  },
  heroExclusifText: {
    color: '#F5222D',
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.8,
  },
  heroComicFrame: {
    width: '100%',
    height: 250,
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E5E2',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  halftoneDotPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.25,
    padding: 4,
    justifyContent: 'space-around',
  },
  halftoneDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F5222D',
    margin: 8,
  },
  heroCauphyImg: {
    width: '90%',
    height: '92%',
    zIndex: 2,
  },
  heroStickerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F5222D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#171416',
    transform: [{ rotate: '-10deg' }],
    zIndex: 5,
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px #171416' } as any,
    }),
  },
  heroStickerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    letterSpacing: 0.5,
  },
  heroViewsPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E8E5E2',
    zIndex: 5,
  },
  heroViewsText: {
    color: '#444444',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  heroContentWrap: {
    width: '100%',
  },
  heroCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroCategoryTitle: {
    color: '#F5222D',
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.5,
  },
  heroMainTitle: {
    fontSize: 21,
    lineHeight: 24,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#555250',
    lineHeight: 16,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    marginBottom: 10,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE6',
  },
  heroStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  statEmoji: {
    fontSize: 13,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  heroReadTimeWrap: {
    marginLeft: 'auto',
  },
  statReadTime: {
    fontSize: 10.5,
    color: '#A80F1C',
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  heroActionBtn: {
    backgroundColor: '#F5222D',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#171416',
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #171416', cursor: 'pointer' } as any,
      default: { elevation: 3 },
    }),
  },
  heroActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    letterSpacing: 0.5,
  },

  // 4. FILTRES THÉMATIQUES
  filtersScrollView: {
    width: '100%',
    marginBottom: 16,
  },
  filtersScrollContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  filterChipActive: {
    backgroundColor: '#D32F2F',
    borderColor: '#171416',
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px #171416' } as any,
    }),
  },
  filterChipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0DCD6',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextInactive: {
    color: '#222222',
  },

  // 5. STRIPS CROUSTILLANTS
  sectionHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5222D',
    marginRight: 6,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.5,
  },
  sectionViewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F5222D',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  stripCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#171416',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px #171416', cursor: 'pointer' } as any,
      default: { elevation: 2 },
    }),
  },
  stripThumbWrap: {
    width: 62,
    height: 62,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#171416',
  },
  stripThumbImg: {
    width: '100%',
    height: '100%',
  },
  stripBadgeRed: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: '#F5222D',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  stripBadgeRedText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  stripBadgeBlack: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: '#171416',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  stripBadgeBlackText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  stripInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  stripCategory: {
    fontSize: 9,
    color: '#F5222D',
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    marginBottom: 2,
  },
  stripTitle: {
    fontSize: 13.5,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  stripSubtitle: {
    fontSize: 10.5,
    color: '#666666',
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    marginBottom: 4,
  },
  stripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freePill: {
    backgroundColor: '#EAE6E1',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9999,
  },
  freePillText: {
    color: '#171416',
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  coinsPill: {
    backgroundColor: '#FFF1F0',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#F5222D',
  },
  coinsPillText: {
    color: '#F5222D',
    fontSize: 8.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  stripActionCircleRed: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F5222D',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  stripActionCircleGrey: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAE6E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  // 6. PUNCHLINE VIDÉO
  videoCard: {
    width: '100%',
    backgroundColor: '#1E1B1D',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171416',
    padding: 12,
    marginTop: 6,
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #F5222D' } as any,
      default: {
        shadowColor: '#F5222D',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 0,
        elevation: 3,
      },
    }),
  },
  videoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  videoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoRedPlayDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F5222D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  videoHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    letterSpacing: 0.5,
  },
  videoCapsulePill: {
    backgroundColor: '#F5222D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  videoCapsuleText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  videoThumbWrap: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#333333',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  videoThumbImg: {
    width: '100%',
    height: '100%',
  },
  videoPlayOverlayBtn: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5222D',
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.4)' } as any,
    }),
  },
  videoDurationPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  videoTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  videoSubtitle: {
    fontSize: 11,
    color: '#AAAAAA',
    lineHeight: 15,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
  },

  // 7. DÉFI QUOTIDIEN (JEUX)
  defiCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171416',
    padding: 12,
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #171416' } as any,
      default: { elevation: 3 },
    }),
  },
  defiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  defiPillBadge: {
    backgroundColor: '#F5222D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  defiPillBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  defiRewardText: {
    color: '#F5222D',
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  defiGameBoardImg: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#171416',
  },
  defiTitle: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  defiSubtitle: {
    fontSize: 11,
    color: '#555250',
    lineHeight: 15,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    marginBottom: 10,
  },
  defiActionBtn: {
    backgroundColor: '#171416',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#171416',
    ...Platform.select({
      web: { cursor: 'pointer', boxShadow: '2px 2px 0px #F5222D' } as any,
    }),
  },
  defiActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    letterSpacing: 0.5,
  },

  // 8. LA VANNE DE LA COMMUNAUTÉ
  communityCard: {
    width: '100%',
    backgroundColor: '#FAF7F2',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171416',
    padding: 12,
    marginBottom: 20,
    ...Platform.select({
      web: { boxShadow: '3px 3px 0px #171416' } as any,
      default: { elevation: 3 },
    }),
  },
  communityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  communityHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityHeaderTitle: {
    color: '#F5222D',
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
    letterSpacing: 0.4,
  },
  communityLocationText: {
    color: '#777777',
    fontSize: 10,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
  },
  speechBubbleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#171416',
    padding: 12,
    marginBottom: 10,
    ...Platform.select({
      web: { boxShadow: '2px 2px 0px rgba(0,0,0,0.06)' } as any,
    }),
  },
  speechBubbleQuote: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.3,
  },
  communityAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  communityAuthorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5222D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  communityAvatarText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
  },
  communityUsername: {
    fontSize: 11,
    fontWeight: '700',
    color: '#171416',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  communityLikesWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityLikesText: {
    color: '#F5222D',
    fontSize: 10.5,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },

  // MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#171416',
    padding: 18,
    ...Platform.select({
      web: { boxShadow: '4px 4px 0px #171416' } as any,
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
    letterSpacing: 0.5,
  },
  modalDesc: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
    fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
    marginBottom: 16,
  },
  coinPacks: {
    gap: 10,
    marginBottom: 16,
  },
  coinPackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#171416',
    backgroundColor: '#FAF7F2',
    position: 'relative',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  coinPackPopular: {
    backgroundColor: '#FFF1F0',
    borderColor: '#F5222D',
  },
  packPopularBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#F5222D',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  packPopularText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  packCoins: {
    fontSize: 15,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    color: '#171416',
  },
  packPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F5222D',
    fontFamily: Platform.OS === 'web' ? '"Space Grotesk", sans-serif' : 'System',
  },
  modalCloseBtn: {
    backgroundColor: '#171416',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
  },
  modalPreviewImg: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalActionBtn: {
    backgroundColor: '#F5222D',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#171416',
    paddingVertical: 11,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer', boxShadow: '2px 2px 0px #171416' } as any,
    }),
  },
  modalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    letterSpacing: 0.5,
  },
});
