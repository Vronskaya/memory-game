const CACHE_NAME = 'memory-game-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Возвращаем кэшированную версию
        }
        return fetch(event.request).catch(() => {
          // Если нет интернета, показываем заглушку
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

