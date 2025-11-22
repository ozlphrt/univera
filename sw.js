// SELF-DESTRUCTING SERVICE WORKER - VERSION 3
// This immediately unregisters itself and clears ALL caches
// Deployed to replace old service workers that cache old bundles

const VERSION = 'v3-' + Date.now(); // Force new version on every deploy

self.addEventListener('install', function(event) {
  console.log('[SW v3] Installing - will destroy all caches');
  // Skip waiting immediately - take control right away
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('[SW v3] Activating - destroying everything...');
  event.waitUntil(
    Promise.all([
      // Delete ALL caches first
      caches.keys().then(function(cacheNames) {
        console.log('[SW v3] Found caches:', cacheNames);
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('[SW v3] Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ]).then(function() {
      console.log('[SW v3] All caches deleted, unregistering...');
      // Unregister THIS service worker
      return self.registration.unregister();
    }).then(function(success) {
      console.log('[SW v3] ✅ Service worker unregistered:', success);
      // Notify all clients to reload immediately
      return self.clients.matchAll().then(function(clients) {
        console.log('[SW v3] Notifying', clients.length, 'clients to reload');
        clients.forEach(function(client) {
          client.postMessage({
            type: 'SW_DESTROYED',
            action: 'reload',
            version: VERSION
          });
        });
        // Also force reload after a short delay
        setTimeout(function() {
          clients.forEach(function(client) {
            client.postMessage({
              type: 'FORCE_RELOAD',
              version: VERSION
            });
          });
        }, 100);
      });
    }).catch(function(error) {
      console.error('[SW v3] Error:', error);
    })
  );
});

// CRITICAL: Don't intercept ANY requests - pass everything to network
// This ensures fresh HTML/JS loads even if old service worker was active
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  
  // For HTML requests, ALWAYS fetch from network (no cache)
  if (event.request.destination === 'document' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(function() {
        return new Response('Service worker disabled', {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      })
    );
    return;
  }
  
  // For all other requests, fetch from network (no caching)
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(function() {
      return new Response('Service worker disabled', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    })
  );
});

