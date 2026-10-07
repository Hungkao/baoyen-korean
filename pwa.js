(() => {
  const el = id => document.getElementById(id);
  let installPrompt = null,
    registration = null;
  function networkStatus() {
    el('offline-status').textContent = navigator.onLine
      ? 'Có mạng. Dữ liệu tài khoản được đồng bộ khi kết nối sẵn sàng.'
      : 'Đang offline. Em vẫn có thể học nội dung đã tải. Giọng đọc cần có sẵn trên máy.';
  }
  networkStatus();
  window.addEventListener('online', networkStatus);
  window.addEventListener('offline', networkStatus);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    el('install-app').hidden = false;
  });
  el('install-app').addEventListener('click', async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } finally {
      installPrompt = null;
      el('install-app').hidden = true;
    }
  });
  window.addEventListener('appinstalled', () => {
    el('install-app').hidden = true;
    el('install-help').textContent = 'App đã được thêm vào màn hình chính ♡';
  });
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone)
    el('install-help').textContent = 'Em đang mở app từ màn hình chính ♡';
  if (!('serviceWorker' in navigator) || !['https:', 'http:'].includes(location.protocol)) return;
  let applyingUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (applyingUpdate) location.reload();
  });
  el('update-app').addEventListener('click', () => {
    if (registration?.waiting) {
      applyingUpdate = true;
      registration.waiting.postMessage('APPLY_UPDATE');
    }
  });
  navigator.serviceWorker
    .register('./sw.js')
    .then(result => {
      registration = result;
      if (result.waiting) el('update-app').hidden = false;
      result.addEventListener('updatefound', () => {
        const worker = result.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) el('update-app').hidden = false;
        });
      });
    })
    .catch(() => {
      el('offline-status').textContent = 'Chưa chuẩn bị được chế độ offline. Em vẫn có thể dùng app khi có mạng.';
    });
})();
