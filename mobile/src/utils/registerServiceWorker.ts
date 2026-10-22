/**
 * GBICH'APP — Service Worker Registration & Mise à Jour Automatique PWA.
 * Active uniquement sur navigateur (Web / PWA).
 */

import { Platform } from 'react-native';

export function registerServiceWorker(): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // En développement, désactiver et purger immédiatement le cache pour garantir le Hot Reload direct
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

    // Gestion de rechargement automatique lorsqu'un nouveau Service Worker prend le contrôle
    let isReloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!isReloading) {
        isReloading = true;
        console.log('[PWA] Nouvelle version activée. Actualisation transparente de l\'application...');
        window.location.reload();
      }
    });

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker enregistré avec succès:', registration.scope);

          // 1. Détection des nouvelles versions
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[PWA] Nouvelle version téléchargée et prête.');
                  } else {
                    console.log('[PWA] Contenu mis en cache pour utilisation hors connexion.');
                  }
                }
              };
            }
          };

          // 2. Vérification automatique à chaque retour au premier plan (quand l'utilisateur ouvre l'appli)
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              registration.update().catch(() => {});
            }
          });

          window.addEventListener('focus', () => {
            registration.update().catch(() => {});
          });

          // 3. Vérification périodique silencieuse toutes les 10 minutes
          setInterval(() => {
            registration.update().catch(() => {});
          }, 10 * 60 * 1000);
        })
        .catch((error) => {
          console.warn('[PWA] Échec de l\'enregistrement du Service Worker:', error);
        });
    });
  }
}
