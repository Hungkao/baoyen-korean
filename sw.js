/* Chỉ cache tài nguyên giao diện cùng origin. Không cache API/tài khoản. */
// prettier-ignore
const CACHE = 'bao-yen-shell-9b2b8a2e0e';
// prettier-ignore
const ASSETS = ['./', './index.html', './styles.css', './core-data.js', './srs.js', './progress-store.js', './speech.js', './app.js', './course-content.js', './platform-engine.js', './platform-ui.js', './exercise-engine.js', './lesson-content.js', './lesson-engine.js', './lesson-renderer.js', './vocabulary-basic.js', './vocabulary-intermediate.js', './tab-lock.js', './account.js', './pwa.js', './config.js', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'];
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
      const cached = await cache.match(url.pathname);
      return cached || fetch(event.request);
    })()
  );
});
