const CACHE_NAME = 'personalos-v21-safesave';

const ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-180-v2.png',
  './icons/icon-192-v2.png',
  './icons/icon-512-v2.png',
  './icons/pixel/png/title.png',
  './icons/pixel/png/1.png',
  './icons/pixel/png/2.png',
  './icons/pixel/png/3.png',
  './icons/pixel/png/4.png',
  './icons/pixel/png/5.png',
  './icons/pixel/png/6.png'
];

// 安装时缓存核心资源，但不清除旧缓存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活时不清理旧缓存，避免数据丢失
self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim()
  );
});

// 网络优先策略，确保拿到最新页面
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
