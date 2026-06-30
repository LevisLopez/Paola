const CACHE_NAME = 'Paola-88';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './db.js',
  './lyrics.js',
  './sleep.js',
  './player.js',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/bg-main.jpg',
  './images/bg-alt.jpg',
  './images/bg-lyrics.jpg',
  './images/bg-extra1.jpg',
  './images/bg-extra2.jpg',
  './images/bg-extra3.jpg',
  './images/bg-extra4.jpg',
  './images/bg-extra5.jpg',
  './images/bg-extra6.jpg',
  './images/bg-extra7.jpg',
  './images/bg-extra8.jpg',
  './images/bg-extra9.jpg',
  './images/bg-extra10.jpg',
  './images/bg-extra11.jpg',
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.startsWith('blob:')) return;
  const url = new URL(event.request.url);
  const isStaticCDN = url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdn.jsdelivr.net');
  if (isStaticCDN) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
