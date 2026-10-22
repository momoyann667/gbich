/**
 * GBICH'APP — Service Worker pour PWA Offline, Cache Intelligent & Mises à Jour Automatiques.
 * Version: v1.0.2
 */

const CACHE_NAME = 'gbich-app-v1.0.2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon.png',
  '/assets/favicon.png'
];

// Installation: Mise en cache préalable et activation immédiate
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pré-mise en cache du shell applicatif:', CACHE_NAME);
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activation: Purge radicale de TOUS les anciens caches et prise de contrôle instantanée
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache obsolète:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Écoute des messages clients pour forcer l'activation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. DÉVELOPPEMENT LOCAL (Metro / Expo / HMR) :
  // Ne JAMAIS cacher les fichiers sur le serveur de dev port 3008 ou en live reload
  if (
    url.port === '3008' ||
    url.port === '8081' ||
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.pathname.includes('_expo') ||
    url.pathname.includes('hot=true') ||
    url.searchParams.has('dev')
  ) {
    // Passer directement au réseau natif sans interférence de cache
    return;
  }

  // 2. REQUÊTES API (/api/) : Network-first avec repli cache hors-ligne
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              JSON.stringify({
                offline: true,
                message: "Vous êtes actuellement hors connexion. Le contenu n'a pas pu être actualisé."
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            );
          });
        })
    );
    return;
  }

  // 3. NAVIGATION (HTML principal) & FICHIERS JS / BUNDLES :
  // STRATÉGIE NETWORK-FIRST ABSOLUE pour que l'utilisateur reçoive TOUJOURS la dernière version !
  if (
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.bundle')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Si pas de réseau (mode avion, tunnel, hors-ligne) : repli sur le cache local
          const cached = await caches.match(event.request);
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return (await caches.match('/')) || (await caches.match('/index.html'));
          }
        })
    );
    return;
  }

  // 4. RESSOURCES STATIQUES (Images, logos, polices, favicons) :
  // Stale-While-Revalidate : réponse rapide du cache + mise à jour en tâche de fond
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return networkResponse;
        })
        .catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});
