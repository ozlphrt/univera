// SELF-DESTRUCTING SERVICE WORKER - VERSION 2
// This immediately unregisters itself and clears ALL caches
// Deployed to replace old service workers that cache old bundles

const CACHE_VERSION = 'v2-destroy';

self.addEventListener('install', function(event) {
  console.log('[SW] Installing self-destructing service worker...');
  // Skip waiting immediately - take control right away
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[SW] Activating - destroying all caches and unregistering...');
  event.waitUntil(
    Promise.all([
      // Delete ALL caches
      caches.keys().then(function(cacheNames) {
        console.log('[SW] Deleting caches:', cacheNames);
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ]).then(function() {
      // Unregister THIS service worker
      console.log('[SW] Unregistering service worker...');
      return self.registration.unregister();
    }).then(function(success) {
      console.log('[SW] ✅ Service worker unregistered:', success);
      // Notify all clients to reload
      return self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({
            type: 'SW_DESTROYED',
            action: 'reload'
          });
        });
      });
    }).catch(function(error) {
      console.error('[SW] Error during destruction:', error);
    })
  );
});

// CRITICAL: Don't intercept ANY requests - pass everything to network
// This ensures fresh HTML/JS loads even if old service worker was active
self.addEventListener('fetch', function(event) {
  // Always fetch from network - never cache
  event.respondWith(
    fetch(event.request).catch(function() {
      // If fetch fails, return a response that triggers reload
      return new Response('Service worker disabled - please reload', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    })
  );
});

