/* Chỉ cache tài nguyên giao diện cùng origin. Không cache API/tài khoản.
   CACHE và ASSETS được scripts/vite-plugin-sw.js điền lại khi build. */
// prettier-ignore
const CACHE = 'bao-yen-shell-dev';
// prettier-ignore
const ASSETS = ['./'];
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
      // Tên file JS/CSS có hash nên không thể trả nhầm bản cũ cho HTML mới.
      const cached = await cache.match(url.pathname + url.search);
      return cached || fetch(event.request);
    })()
  );
});
