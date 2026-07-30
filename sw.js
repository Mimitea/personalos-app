const CACHE_NAME = 'personalos-v20-title';
const ASSETS = [
  '/personalos.html',
  './manifest.json',
  './icons/icon-192-v2.png',
  './icons/icon-512-v2.png',
  './icons/icon-180-v2.png',
  './icons/icon-1024.png',
  './icons/pixel/png/title.png',
  './icons/pixel/png/1.png',
  './icons/pixel/png/2.png',
  './icons/pixel/png/3.png',
  './icons/pixel/png/4.png',
  './icons/pixel/png/5.png',
  './icons/pixel/png/6.png'
];

// 安装时缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// 网络优先 + 离线回退
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 缓存成功响应的副本
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
