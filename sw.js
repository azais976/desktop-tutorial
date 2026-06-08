/* BarberLink — Service Worker
   Met l'app en cache pour un fonctionnement hors-ligne et une installation PWA.
   Stratégie : "network-first" pour le HTML/JS (toujours la dernière version si
   en ligne), "cache-first" pour les ressources statiques (icônes, polices). */

const CACHE = 'barberlink-v1';

// Ressources de base de l'app (app shell)
const APP_SHELL = [
  './',
  './index.html',
  './App.jsx',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

// Installation : on pré-charge l'app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // addAll échoue si une seule ressource manque : on tolère les absences
      Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// Activation : on supprime les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Récupération des requêtes
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ne jamais mettre en cache les appels d'API (paiement, IA, etc.)
  if (url.pathname.includes('/v1/') || url.hostname.includes('api.')) {
    return; // laisse passer vers le réseau
  }

  const isDoc =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    req.destination === 'script' ||
    url.pathname.endsWith('.jsx') ||
    url.pathname.endsWith('.html');

  if (isDoc) {
    // network-first : dernière version en ligne, repli sur le cache hors-ligne
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match('./index.html'))
        )
    );
    return;
  }

  // cache-first pour le reste (icônes, polices, images)
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
    )
  );
});
