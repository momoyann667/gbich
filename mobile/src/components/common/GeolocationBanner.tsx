/**
 * GBICH'APP — Geolocation Status Notification & Gesture Trigger.
 * 
 * - Affiche une confirmation discrète satirique quand la position est repérée
 * - Offre un bouton interactif sur mobile pour déclencher l'autorisation native
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { useLocationStore } from '../../store/locationStore';
import { useGeolocationTracker } from '../../hooks/useGeolocationTracker';

export const GeolocationBanner: React.FC = () => {
  const { coordinates, status } = useLocationStore();
  const { requestPosition } = useGeolocationTracker();
  const [showToast, setShowToast] = useState<boolean>(false);
  const toastAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (coordinates && status === 'granted') {
      setShowToast(true);
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }).start(() => setShowToast(false));
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [coordinates, status, toastAnim]);

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <>
      {/* Toast discret de confirmation quand la position est repérée */}
      {showToast && coordinates && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.toastContent}>
            <Text style={styles.toastIcon}>📍</Text>
            <View style={styles.toastTextCol}>
              <Text style={styles.toastTitle}>DJASSA LOCALISÉ !</Text>
              <Text style={styles.toastSubtitle}>
                Zone : <Text style={styles.toastHighlight}>{coordinates.city || "Côte d'Ivoire"}</Text> enregistrée pour la carte ! 🎯
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Si refusé ou non autorisé sur mobile, bouton discret en haut à droite */}
      {status === 'denied' && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => requestPosition(true)}
          style={styles.retryBadge}
        >
          <Text style={styles.retryIcon}>📍</Text>
          <Text style={styles.retryText}>Activer ma position</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 14 : 36,
    alignSelf: 'center',
    zIndex: 99998,
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#FAF7F2',
    borderWidth: 2.5,
    borderColor: '#171416',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#171416',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toastIcon: {
    fontSize: 20,
  },
  toastTextCol: {
    flex: 1,
  },
  toastTitle: {
    fontFamily: Platform.OS === 'web' ? 'Anton, sans-serif' : 'System',
    fontSize: 13,
    color: '#F5222D',
    letterSpacing: 0.6,
  },
  toastSubtitle: {
    fontFamily: Platform.OS === 'web' ? "'Inter', sans-serif" : 'System',
    fontSize: 11.5,
    color: '#171416',
  },
  toastHighlight: {
    fontWeight: '800',
    color: '#171416',
  },
  retryBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 99990,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderWidth: 1.5,
    borderColor: '#F5222D',
    borderRadius: 9999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  retryIcon: {
    fontSize: 12,
  },
  retryText: {
    fontFamily: Platform.OS === 'web' ? "'Space Grotesk', sans-serif" : 'System',
    fontSize: 10,
    fontWeight: '800',
    color: '#F5222D',
  },
});
