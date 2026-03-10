const CACHE = 'udhar-v3';
const BASE = '/udhari-tool/';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => 
      c.addAll([BASE, BASE+'index.html', BASE+'manifest.json', BASE+'icon.png'])
    ).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.url.includes('firebase') || 
     e.request.url.includes('googleapis') ||
     e.request.url.includes('gstatic')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
