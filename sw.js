/* service worker della pagina Austria 2026 — generato da build_offline.py.
   VERSION e' l'impronta del contenuto: cambiando la pagina cambiano questi byte,
   il browser se ne accorge e propone l'aggiornamento. */
var VERSION = 'b17782245c';
var CACHE = 'austria-2026-' + VERSION;
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // cache:'reload' evita di ripescare dalla cache HTTP una copia gia' vecchia
    return c.addAll(ASSETS.map(function (u) { return new Request(u, {cache: 'reload'}); }));
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

// il nuovo worker resta in attesa finche' l'utente non tocca "Aggiorna"
self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  // i link a Google Maps e YouTube devono passare dalla rete, non dalla cache
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(function (hit) {
      if (hit) return hit;
      return fetch(req).catch(function () {
        return req.mode === 'navigate' ? caches.match('./index.html') : Response.error();
      });
    })
  );
});
