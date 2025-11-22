// Self-destructing service worker
// Deployed to replace old service worker and clear all caches

// Force immediate activation - don't wait for other service workers
self.addEventListener('install', (event) => {
  console.log('[SW] Installing self-destruct service worker...');
  // Skip waiting and take control immediately
  self.skipWaiting();
  // Don't wait for activation
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating self-destruct sequence...');
  
  event.waitUntil((async () => {
    try {
      // Step 1: Claim all clients immediately
      await self.clients.claim();
      console.log('[SW] Claimed all clients');
      
      // Step 2: Delete ALL caches (not just this SW's)
      const keys = await caches.keys();
      console.log('[SW] Found caches:', keys);
      await Promise.all(keys.map(key => {
        console.log('[SW] Deleting cache:', key);
        return caches.delete(key);
      }));
      console.log('[SW] All caches deleted');
      
      // Step 3: Unregister this service worker
      console.log('[SW] Unregistering service worker...');
      const unregistered = await self.registration.unregister();
      console.log('[SW] Unregistered:', unregistered);
      
      // Step 4: Reload all controlled client pages
      const clients = await self.clients.matchAll({ 
        type: 'window',
        includeUncontrolled: false
      });
      console.log('[SW] Found', clients.length, 'clients to reload');
      
      for (const client of clients) {
        console.log('[SW] Reloading client:', client.url);
        try {
          await client.navigate(client.url);
        } catch (e) {
          console.log('[SW] Could not navigate client, trying location.reload');
          // Fallback: send message to reload
          client.postMessage({ type: 'RELOAD' });
        }
      }
      
      // If no clients, still unregister
      if (clients.length === 0) {
        console.log('[SW] No clients to reload, but SW is unregistered');
      }
    } catch (error) {
      console.error('[SW] Error during self-destruct:', error);
      // Still try to unregister even if there's an error
      try {
        await self.registration.unregister();
      } catch (e) {
        console.error('[SW] Failed to unregister:', e);
      }
    }
  })());
});

// Make all fetches fall back to network (don't cache anything)
self.addEventListener('fetch', (event) => {
  // Always fetch from network - never use cache
  event.respondWith(fetch(event.request).catch(() => {
    // If fetch fails, return a basic response
    return new Response('Service worker is being removed', { status: 503 });
  }));
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

