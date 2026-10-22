/**
 * GBICH'APP — Service Worker Registration & Mises à Jour Automatiques PWA.
 * Active sur navigateur (Web / PWA).
 */

import { Platform } from 'react-native';

let swRegistration: ServiceWorkerRegistration | null = null;

export function registerServiceWorker(): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const isDevPort =
      window.location.port === '3008' ||
      window.location.port === '8081' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // En environnement de développement local Metro :
    // Purger immédiatement les Service Workers pour garantir que le code frais de Vite/Metro passe toujours
    if (__DEV__ || isDevPort) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
          console.log('[PWA Dev] Service Worker désenregistré pour permettre le Hot Reload');
        }
      });
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
      return;
    }

    // Gestion du rechargement automatique lorsqu'un nouveau Service Worker prend le contrôle
    let isReloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!isReloading) {
        isReloading = true;
        console.log('[PWA] Nouvelle version activée ! Rechargement transparent de l\'application...');
        window.location.reload();
      }
    });

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          swRegistration = registration;
          console.log('[PWA] Service Worker actif et à l\'écoute:', registration.scope);

          // 1. Détection immédiate d'une nouvelle version
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Une nouvelle version est prête : on lui ordonne de s'activer tout de suite
                    console.log('[PWA] Nouvelle version installée. Activation immédiate...');
                    installingWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                }
              };
            }
          };

          // 2. Vérification automatique à chaque retour sur l'app (déverrouillage ou basculement d'onglet)
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              registration.update().catch(() => {});
            }
          });

          window.addEventListener('focus', () => {
            registration.update().catch(() => {});
          });

          // 3. Vérification périodique toutes les 5 minutes
          setInterval(() => {
            registration.update().catch(() => {});
          }, 5 * 60 * 1000);
        })
        .catch((error) => {
          console.warn('[PWA] Erreur enregistrement Service Worker:', error);
        });
    });
  }
}

/**
 * Fonction publique permettant de forcer la vérification et l'application d'une mise à jour
 * depuis l'interface (ex: bouton dans l'écran de profil).
 */
export async function forceAppUpdate(): Promise<boolean> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      console.log('[PWA] Caches purgés avec succès.');
    }

    if (swRegistration) {
      await swRegistration.update();
    }

    // Actualiser la page
    window.location.reload();
    return true;
  } catch (err) {
    console.warn('[PWA] Échec lors de la mise à jour forcée:', err);
    window.location.reload();
    return false;
  }
}
