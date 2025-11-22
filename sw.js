// SELF-DESTRUCTING SERVICE WORKER
// This service worker immediately unregisters itself and clears all caches
// It's deployed to replace any old service workers

self.addEventListener('install', function(event) {
  // Skip waiting immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Claim all clients immediately
  event.waitUntil(
    self.clients.claim().then(function() {
      // Delete all caches
      return caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    }).then(function() {
      // Unregister this service worker
      return self.registration.unregister();
    }).then(function(success) {
      console.log('✅ Service worker self-destructed:', success);
      // Notify all clients to reload
      return self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({
            type: 'SW_DESTROYED',
            action: 'reload'
          });
        });
      });
    })
  );
});

// Don't intercept any fetch requests - let everything go to network
self.addEventListener('fetch', function(event) {
  // Do nothing - just pass through to network
  event.respondWith(fetch(event.request));
});

