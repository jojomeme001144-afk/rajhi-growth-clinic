const CACHE_NAME = 'rajhi-growth-clinic-v2';
const LOCAL_ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const REMOTE_ASSETS = ['https://cdn.jsdelivr.net/npm/chart.js','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(async cache => { await cache.addAll(LOCAL_ASSETS); await Promise.allSettled(REMOTE_ASSETS.map(url => cache.add(url))); }).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE_NAME).then(cache => cache.put('./index.html',copy)).catch(()=>{}); return response; }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy)).catch(()=>{}); return response; })));
});
