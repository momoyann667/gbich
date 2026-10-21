/**
 * GBICH'APP — Service Worker Registration Helper.
 * Active uniquement sur navigateur (Web / PWA).
 */

import { Platform } from 'react-native';

export function registerServiceWorker(): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // En développement, désactiver et purger immédiatement le cache pour garantir la fraîcheur du code
    if (__DEV__) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker enregistré avec succès:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[PWA] Nouvelle version disponible. Rafraîchissez pour mettre à jour.');
                  } else {
                    console.log('[PWA] Contenu mis en cache pour utilisation hors connexion.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('[PWA] Échec de l\'enregistrement du Service Worker:', error);
        });
    });
  }
}
