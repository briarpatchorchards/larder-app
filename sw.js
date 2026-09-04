/* Larder beta service worker.
 *
 * Two jobs, and deliberately nothing else:
 *   1. Make the app open instantly and work with no signal.
 *   2. Never, under any circumstances, touch the tester's data.
 *
 * The cache holds only fetched FILES. Everything a tester enters lives in
 * localStorage, which a service worker cannot reach and this file never tries to.
 * So bumping CACHE below ships a new build and leaves every plan, rating and prep
 * session exactly where it was.
 *
 * Update strategy: network-first for the page itself, so opening the app while
 * online always gets the newest build; cache-first for images and fonts, which are
 * big and rarely change. If the network is gone, everything falls back to cache.
 */

var CACHE = 'larder-0.1';

var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      // A single missing file must not stop the worker installing.
      .catch(function () { return null; })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  // Feedback posts and anything cross-origin and dynamic: straight to the network.
  if (url.hostname.indexOf('formspree.io') > -1) return;

  var isPage = req.mode === 'navigate' ||
    (sameOrigin && (url.pathname === '/' || /\.html$/.test(url.pathname)));

  if (isPage) {
    // Network first: an online launch always lands on the newest build.
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            return hit || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Everything else — images, fonts, icons: cache first, then fill in behind.
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
    })
  );
});
