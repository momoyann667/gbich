/**
 * GBICH'APP — Geolocation Tracking Hook.
 * Déclenche la demande de position dès l'ouverture de l'application
 * et synchronise les coordonnées avec le backend pour la cartographie du tableau de bord.
 */

import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useLocationStore } from '../store/locationStore';
import { apiClient } from '../api/client';

export function useGeolocationTracker() {
  const { setCoordinates, setStatus, setErrorMessage, status } = useLocationStore();

  const getDeviceType = (): string => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined') {
      return Platform.OS;
    }
    const ua = navigator.userAgent.toLowerCase();
    const isStandalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      (navigator as any).standalone === true;

    if (/iphone|ipad|ipod/.test(ua)) {
      return isStandalone ? 'ios_standalone_pwa' : 'ios_mobile_browser';
    }
    if (/android/.test(ua)) {
      return isStandalone ? 'android_standalone_pwa' : 'android_mobile_browser';
    }
    return 'desktop_web';
  };

  const getApproximateZone = (lat: number, lon: number): { city: string; country: string } => {
    // Détection rapide des grandes zones de Côte d'Ivoire & Afrique de l'Ouest
    if (lat >= 5.15 && lat <= 5.55 && lon >= -4.25 && lon <= -3.85) {
      return { city: 'Abidjan', country: "Côte d'Ivoire" };
    }
    if (lat >= 7.55 && lat <= 7.85 && lon >= -5.2 && lon <= -4.9) {
      return { city: 'Bouaké', country: "Côte d'Ivoire" };
    }
    if (lat >= 6.7 && lat <= 7.0 && lon >= -5.4 && lon <= -5.1) {
      return { city: 'Yamoussoukro', country: "Côte d'Ivoire" };
    }
    if (lat >= 4.3 && lat <= 10.8 && lon >= -8.7 && lon <= -2.5) {
      return { city: 'Côte d\'Ivoire', country: "Côte d'Ivoire" };
    }
    return { city: 'International', country: 'International' };
  };

  const requestPosition = useCallback(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }

    setStatus('prompted');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const { city, country } = getApproximateZone(latitude, longitude);
        const deviceType = getDeviceType();

        const coords = {
          latitude,
          longitude,
          accuracy: accuracy || undefined,
          city,
          country,
          timestamp: position.timestamp || Date.now(),
        };

        setCoordinates(coords);

        // Sauvegarde locale
        try {
          localStorage.setItem('gbich_last_coords', JSON.stringify(coords));
        } catch {
          // Ignore storage errors
        }

        // Transmission au backend pour la cartographie du tableau de bord
        try {
          await apiClient.post('/analytics/location', {
            latitude,
            longitude,
            accuracy: accuracy || undefined,
            device_type: deviceType,
            city,
            country,
          });
          console.log(`[GBICH! Geolocation] Position capturée pour le dashboard : ${city} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        } catch (err) {
          console.warn('[GBICH! Geolocation] Sauvegarde serveur en attente (mode hors-ligne)');
        }
      },
      (error) => {
        let msg = 'Position refusée';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Autorisation refusée par l\'utilisateur';
          setStatus('denied');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Signal GPS non disponible';
          setStatus('unavailable');
        } else if (error.code === error.TIMEOUT) {
          msg = 'Délai d\'attente dépassé';
          setStatus('unavailable');
        }
        setErrorMessage(msg);
        console.log(`[GBICH! Geolocation] ${msg}`);
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 300000, // Réutilise la position en cache si < 5 minutes
      }
    );
  }, [setCoordinates, setErrorMessage, setStatus]);

  useEffect(() => {
    // Déclenchement automatique dès l'ouverture de l'application
    requestPosition();
  }, [requestPosition]);

  return { requestPosition, status };
}
