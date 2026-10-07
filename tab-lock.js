// Một tab chỉnh tiến độ tại một thời điểm; tránh ghi đè bản offline của tab khác.
(() => {
  let release = null,
    writable = false,
    generation = 0,
    retryTimer = null,
    fallback = false;
  const banner = document.getElementById('tab-lock-message');
  window.tabAccess = { writable: () => writable };
  function setAccess(allowed, message = '') {
    writable = allowed;
    document.querySelector('main').inert = !allowed;
    document.querySelector('nav').inert = !allowed;
    banner.hidden = !message;
    banner.textContent = message;
  }
  function allowSingleTab() {
    fallback = true;
    setAccess(
      true,
      'Em có thể học ở đây. Trình duyệt chưa hỗ trợ khóa nhiều tab; chỉ mở một tab app để giữ tiến độ nhé.'
    );
    window.dispatchEvent(new Event('tab-writable'));
  }
  async function acquire() {
    const current = ++generation;
    clearTimeout(retryTimer);
    if (release) {
      release();
      release = null;
    }
    setAccess(false, 'Đang mở tiến độ học…');
    if (!navigator.locks) {
      allowSingleTab();
      return;
    }
    try {
      await navigator.locks.request('bao-yen-edit:' + progressStore.key(), { ifAvailable: true }, async lock => {
        if (current !== generation) return;
        if (!lock) {
          setAccess(
            false,
            'App đang mở ở một tab khác. Đóng tab đó để tiếp tục ở đây; tiến độ sẽ được tải lại tự động.'
          );
          retryTimer = setTimeout(acquire, 2000);
          return;
        }
        progressStore.reload();
        setAccess(true);
        window.dispatchEvent(new Event('tab-writable'));
        await new Promise(resolve => {
          release = resolve;
        });
      });
    } catch {
      allowSingleTab();
    }
  }
  window.addEventListener('storage', event => {
    if (fallback && (event.key === progressStore.key() || event.key === null))
      setAccess(false, 'Tiến độ vừa thay đổi ở tab khác. Đóng tab kia và tải lại trang này để học tiếp.');
  });
  window.addEventListener('progress-scope-changed', acquire);
  window.addEventListener('pagehide', () => {
    if (release) release();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) acquire();
  });
  acquire();
})();
