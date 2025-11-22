// Self-destructing service worker
// Deployed to replace old service worker and clear all caches

self.addEventListener('install', (event) => {
  // Activate immediately - don't wait
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    console.log('[SW] Activating self-destruct sequence...');
    
    // Step 1: Delete all caches this SW owns
    const keys = await caches.keys();
    console.log('[SW] Found caches:', keys);
    await Promise.all(keys.map(key => {
      console.log('[SW] Deleting cache:', key);
      return caches.delete(key);
    }));
    
    // Step 2: Unregister this service worker
    console.log('[SW] Unregistering service worker...');
    const unregistered = await self.registration.unregister();
    console.log('[SW] Unregistered:', unregistered);
    
    // Step 3: Reload all controlled client pages so they drop back to network
    const clients = await self.clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    });
    console.log('[SW] Found', clients.length, 'clients to reload');
    
    for (const client of clients) {
      console.log('[SW] Reloading client:', client.url);
      client.navigate(client.url);
    }
  })());
});

// Make all fetches fall back to network (don't cache anything)
self.addEventListener('fetch', (event) => {
  // Always fetch from network - never use cache
  event.respondWith(fetch(event.request));
});

