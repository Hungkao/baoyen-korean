/* Chỉ cache tài nguyên giao diện cùng origin. Không cache API/tài khoản. */
// prettier-ignore
const CACHE = 'bao-yen-shell-e8020e857a';
// prettier-ignore
const ASSETS = ['./', './index.html', './styles.css?v=b51627e8cc', './core-data.js?v=0016185afd', './srs.js?v=ecbb5e9be9', './progress-store.js?v=2c87d9a371', './speech.js?v=98d9a7842c', './app.js?v=20fe6a3d07', './course-content.js?v=2497d82d27', './platform-engine.js?v=544747d925', './platform-ui.js?v=3ab1ad2513', './exercise-engine.js?v=f780bb500f', './lesson-content.js?v=b038eb1ac9', './lesson-engine.js?v=238da086de', './lesson-renderer.js?v=d64d9e0911', './vocabulary-basic.js?v=1446dbac2f', './vocabulary-intermediate.js?v=1706492e99', './tab-lock.js?v=64c5337e30', './account.js?v=1e7281c5d0', './pwa.js?v=58d44aea55', './config.js?v=d4617a4857', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event =>
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys())
        if (name.startsWith('bao-yen-shell-') && name !== CACHE) await caches.delete(name);
      await self.clients.claim();
    })()
  )
);
self.addEventListener('message', event => {
  if (event.data === 'APPLY_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const known = ASSETS.some(asset => new URL(asset, self.registration.scope).pathname === url.pathname);
  if (!known) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (event.request.mode === 'navigate') {
        // Shell HTML và JS cùng phiên bản; nút Cập nhật kích hoạt worker mới.
        return (await cache.match(new URL('./index.html', self.registration.scope).href)) || fetch(event.request);
      }
      // So khớp cả ?v= để không trả nhầm JS cũ cho HTML mới.
      const cached = await cache.match(url.pathname + url.search);
      return cached || fetch(event.request);
    })()
  );
});
