/**
 * GBICH'APP — Geolocation Tracking Hook.
 * 
 * - Déclenche la demande de position au démarrage.
 * - Sur mobile avec navigateur HTTP (non-sécurisé), active un repli automatique par fuseau horaire
 *   (ex: Africa/Abidjan -> 5.3484, -4.0152) pour que le tableau de bord reçoive la zone quoi qu'il arrive.
 * - Fournit la méthode `requestPosition(true)` déclenchable par un clic/toucher utilisateur.
 */

import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useLocationStore, LocationCoordinates } from '../store/locationStore';
import { apiClient } from '../api/client';

export function useGeolocationTracker() {
  const { setCoordinates, setStatus, setErrorMessage, status, coordinates } = useLocationStore();

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

  const getTimezoneFallback = (): LocationCoordinates => {
    let tz = 'Africa/Abidjan';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Abidjan';
    } catch {
      // Ignore
    }

    const tzMap: Record<string, { lat: number; lon: number; city: string; country: string }> = {
      'Africa/Abidjan': { lat: 5.3484, lon: -4.0152, city: 'Abidjan', country: "Côte d'Ivoire" },
      'Africa/Dakar': { lat: 14.7167, lon: -17.4677, city: 'Dakar', country: 'Sénégal' },
      'Africa/Accra': { lat: 5.6037, lon: -0.1870, city: 'Accra', country: 'Ghana' },
      'Africa/Lagos': { lat: 6.5244, lon: 3.3792, city: 'Lagos', country: 'Nigeria' },
      'Europe/Paris': { lat: 48.8566, lon: 2.3522, city: 'Paris', country: 'France' },
    };

    const found = tzMap[tz] || { lat: 5.3484, lon: -4.0152, city: 'Abidjan', country: "Côte d'Ivoire" };
    return {
      latitude: found.lat,
      longitude: found.lon,
      accuracy: 2500, // Précision indicative par zone
      city: found.city,
      country: found.country,
      timestamp: Date.now(),
    };
  };

  const getApproximateZone = (lat: number, lon: number): { city: string; country: string } => {
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

  const sendLocationToBackend = async (coords: LocationCoordinates, deviceType: string) => {
    try {
      await apiClient.post('/analytics/location', {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        device_type: deviceType,
        city: coords.city,
        country: coords.country,
      });
      console.log(`[GBICH! Geolocation] Position transmise au serveur : ${coords.city} (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`);
    } catch {
      console.warn('[GBICH! Geolocation] Envoi serveur en attente (mode hors-ligne)');
    }
  };

  const requestPosition = useCallback((isUserGesture = false) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      setStatus('unavailable');
      return;
    }

    const deviceType = getDeviceType();
    const isSecure = window.isSecureContext;

    // Sur mobile en réseau local HTTP (non sécurisé, ex: http://192.168.x.x:3008),
    // les navigateurs mobiles (Chrome, Safari) bloquent strictement l'API GPS sans afficher le prompt.
    // On applique immédiatement le repli intelligent pour alimenter la carte du tableau de bord !
    if (!isSecure && !('geolocation' in navigator) || (!isSecure && Platform.OS === 'web' && /iphone|ipad|ipod|android/i.test(navigator.userAgent))) {
      console.log('[GBICH! Geolocation] Contexte HTTP mobile détecté. Activation du repli intelligent pour la carte.');
      const fallback = getTimezoneFallback();
      setCoordinates(fallback);
      setStatus('granted');
      sendLocationToBackend(fallback, `${deviceType}_fallback`);
      return;
    }

    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      const fallback = getTimezoneFallback();
      setCoordinates(fallback);
      sendLocationToBackend(fallback, `${deviceType}_fallback`);
      return;
    }

    setStatus('prompted');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const { city, country } = getApproximateZone(latitude, longitude);

        const coords: LocationCoordinates = {
          latitude,
          longitude,
          accuracy: accuracy || undefined,
          city,
          country,
          timestamp: position.timestamp || Date.now(),
        };

        setCoordinates(coords);
        setStatus('granted');

        try {
          localStorage.setItem('gbich_last_coords', JSON.stringify(coords));
        } catch {
          // Ignore
        }

        sendLocationToBackend(coords, deviceType);
      },
      (error) => {
        let msg = 'Position refusée';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Autorisation refusée ou bloquée par le navigateur';
          setStatus('denied');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Signal GPS non disponible';
          setStatus('unavailable');
        } else if (error.code === error.TIMEOUT) {
          msg = 'Délai d\'attente dépassé';
          setStatus('unavailable');
        }
        setErrorMessage(msg);
        console.log(`[GBICH! Geolocation] ${msg} (code ${error.code})`);

        // En cas d'échec sur mobile, s'assurer que le tableau de bord a au moins la zone estimée
        const fallback = getTimezoneFallback();
        setCoordinates(fallback);
        sendLocationToBackend(fallback, `${deviceType}_fallback`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 120000,
      }
    );
  }, [setCoordinates, setErrorMessage, setStatus]);

  useEffect(() => {
    // Déclenchement automatique dès l'ouverture
    requestPosition(false);
  }, [requestPosition]);

  return { requestPosition, status, coordinates };
}
