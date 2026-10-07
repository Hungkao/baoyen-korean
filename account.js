/* Tài khoản Supabase qua REST. Mã bí mật chỉ nằm trong phiên trình duyệt. */
(() => {
  'use strict';
  const el = id => document.getElementById(id);
  const config = window.APP_CONFIG || {};
  const configured = /^https:\/\/[^/]+\.supabase\.co$/.test(config.supabaseUrl || '') && !!config.supabaseKey && !config.supabaseKey.startsWith('sb_secret_');
  const SESSION_KEY = 'bao-yen-auth-v1';
  const rescueKey = () => 'bao-yen-rescue-v1:' + store.key();
  let session = null, metadata = { revision: 0, dirty: false }, epoch = 0, changes = 0;
  let syncTimer, syncing = false, refreshPromise = null, conflict = null, pendingEmail = '';
  const store = window.progressStore;
  window.accountState = () => ({signedIn:!!session,configured,pending:metadata.dirty,conflict:!!conflict});

  function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
  function write(key, value) {
    try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { el('auth-message').textContent = 'Không lưu được phiên trên máy. Hãy cho phép dữ liệu trang và tải bản sao lưu trước khi đóng.'; return false; }
  }
  const metaKey = () => 'bao-yen-sync:' + session.user.id;
  function saveMeta() { if (session) write(metaKey(), metadata); }
  function summary(document) { const p = document?.progress; const core=p?.platform?.learning;const completed=Object.values(core?.results||{}).filter(r=>r?.completedAt).length;return p ? `${p.score || 0} điểm, ${p.learned?.length || 0} mục đã xem, ${p.completedDays?.length || 0} bài cũ, ${completed} bài giáo trình mới${core?.session&&!core.session.finished?', có bài đang học':''}` : 'Chưa có tiến độ'; }
  function render() {
    el('cloud-unconfigured').hidden = configured;
    el('email-form').hidden = !configured || !!session || !!pendingEmail;
    el('code-form').hidden = !configured || !!session || !pendingEmail;
    el('signed-in').hidden = !session;
    el('account-status').textContent = session ? 'Tiến độ thuộc tài khoản của em.' : 'Đang dùng tiến độ riêng trên máy này.';
    el('account-email-label').textContent = session?.user.email || '';
    const guest=store.guest().progress;
    el('import-guest').hidden = !session || !(guest.learned.length || guest.score || guest.platform.profile || guest.platform.learning.session || Object.keys(guest.platform.learning.results).length);
    el('export-rescue').hidden = !read(rescueKey());
    window.dispatchEvent(new Event('account-state-changed'));
  }
  function friendlyError(error) {
    if (error.name === 'AbortError') return 'Kết nối đang chậm. Em thử lại sau một chút nhé.';
    if (error.status === 429) return 'Đã gửi nhiều yêu cầu. Em đợi một chút rồi thử lại nhé.';
    if (error.status === 401 || error.status === 403) return 'Phiên đăng nhập hoặc mã xác nhận đã hết hạn. Em đăng nhập lại nhé.';
    if (error.code === 'over_email_send_rate_limit') return 'Chưa thể gửi thêm email lúc này. Em kiểm tra thư trước đó hoặc thử lại sau.';
    if (error.status === 400 || error.status === 422) return 'Chưa xác nhận được. Kiểm tra email, mã mới nhất và cấu hình gửi email của app.';
    if (error.status === 404) return 'Kết nối dữ liệu chưa sẵn sàng. Người thiết lập app cần chạy file supabase/schema.sql.';
    if (error instanceof TypeError || !navigator.onLine) return 'Chưa kết nối được. Tiến độ vẫn ở trên máy; app sẽ thử đồng bộ khi có mạng.';
    return error.safeMessage || 'Chưa hoàn tất thao tác. Tiến độ trên máy được giữ lại; em thử lại sau nhé.';
  }
  async function request(path, { method = 'GET', body, token } = {}) {
    if (!configured) throw new Error('Cloud is not configured');
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(config.supabaseUrl + path, {
        method, signal: controller.signal, cache: 'no-store',
        headers: { apikey: config.supabaseKey, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {})
      });
      const result = response.status === 204 ? null : await response.json().catch(() => null);
      if (!response.ok) { const error = new Error('Request failed'); error.status = response.status; error.code = result?.error_code || result?.code; throw error; }
      return result;
    } finally { clearTimeout(timeout); }
  }
  function acceptSession(value) {
    if (!value?.access_token || !value.refresh_token || !/^[a-f0-9-]{36}$/i.test(value.user?.id || '')) throw new Error('Invalid session');
    session = { access_token: value.access_token, refresh_token: value.refresh_token, user: { id: value.user.id, email: value.user.email }, expires_at: value.expires_at || Math.floor(Date.now() / 1000) + (value.expires_in || 3600) };
    write(SESSION_KEY, session);
  }
  async function accessToken() {
    if (!session) throw new Error('Not signed in');
    if (session.expires_at > Date.now() / 1000 + 60) return session.access_token;
    if (!refreshPromise) {
      const generation = epoch, current = session;
      refreshPromise = request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: current.refresh_token } })
        .then(result => { if (generation !== epoch) throw new Error('Session changed'); acceptSession(result); return session.access_token; })
        .finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
  }
  function loadAccount() {
    el('sync-status').textContent = 'Đang mở tiến độ tài khoản…';
    const saved = read(metaKey());
    metadata = { revision: Number.isSafeInteger(saved?.revision) && saved.revision >= 0 ? saved.revision : 0, dirty: saved?.dirty === true };
    changes = 0; conflict = null; el('sync-conflict').hidden = true;
    store.switchAccount(session.user.id);
    if (!read(store.key())) metadata = { revision: 0, dirty: false };
    render();
  }
  function preserveCurrent() {
    if (!write(rescueKey(), { createdAt: new Date().toISOString(), ...store.get() })) {
      const error = new Error('Backup failed'); error.safeMessage = 'Chưa lưu được bản dự phòng. Hãy tải bản sao lưu trước; chưa thay tiến độ.'; throw error;
    }
    render();
  }
  function presentConflict(remote) {
    conflict = remote; el('sync-conflict').hidden = false;
    el('conflict-summary').textContent = 'Trên máy: ' + summary(store.get()) + '. Đã đồng bộ: ' + summary(remote.payload) + '.';
    el('sync-status').textContent = 'Cần chọn bản tiến độ để tiếp tục đồng bộ.';
  }
  function scheduleSync() { clearTimeout(syncTimer); syncTimer = setTimeout(sync, 900); }
  async function sync() {
    if (!session || syncing || conflict || !window.tabAccess?.writable()) return;
    if (!navigator.onLine) { el('sync-status').textContent = 'Đang offline. Tiến độ được giữ trên máy.'; return; }
    syncing = true; const generation = epoch;
    el('sync-status').textContent = 'Đang đồng bộ…';
    try {
      const token = await accessToken(); if (generation !== epoch) return;
      const rows = await request('/rest/v1/learning_progress?select=payload,revision&user_id=eq.' + encodeURIComponent(session.user.id), { token });
      if (generation !== epoch) return;
      if (!Array.isArray(rows)) throw new Error('Invalid cloud data');
      const remote = rows[0] || { revision: 0, payload: null };
      if (!Number.isSafeInteger(remote.revision) || remote.revision < 0) throw new Error('Invalid revision');
      if (metadata.dirty) {
        if (remote.revision !== metadata.revision) { presentConflict(remote); return; }
        const sentChanges = changes;
        const result = await request('/rest/v1/rpc/save_learning_progress', { method: 'POST', token, body: { p_payload: store.get(), p_expected_revision: metadata.revision } });
        if (generation !== epoch) return;
        if (!result?.ok) { presentConflict(result); return; }
        if (!Number.isSafeInteger(result.revision)) throw new Error('Invalid revision');
        metadata.revision = result.revision; metadata.dirty = changes !== sentChanges; saveMeta();
      } else if (remote.revision > 0) {
        if (remote.revision !== metadata.revision) {
          preserveCurrent();
          if (!store.apply(remote.payload, { silent: true })) throw new Error('Could not persist cloud progress');
          metadata.revision = remote.revision; saveMeta();
        }
      }
      el('sync-status').textContent = metadata.dirty ? 'Còn thay đổi đang chờ đồng bộ.' : 'Đã đồng bộ lúc ' + new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date()) + '.';
      render(); if (metadata.dirty) scheduleSync();
    } catch (error) { if (generation === epoch) el('sync-status').textContent = friendlyError(error); }
    finally { syncing = false; }
  }
  window.addEventListener('progress-saved', event => {
    if (!session || event.detail.key !== store.key()) return;
    changes++; metadata.dirty = true; saveMeta(); el('sync-status').textContent = 'Tiến độ mới đang chờ đồng bộ.'; scheduleSync();
  });
  window.addEventListener('online', sync);
  window.addEventListener('tab-writable', () => {
    if(session){const saved=read(metaKey());if(saved && Number.isSafeInteger(saved.revision))metadata={revision:saved.revision,dirty:saved.dirty===true};sync();}
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  el('sync-now').addEventListener('click', sync);

  async function busy(form, operation) {
    const buttons = [...form.querySelectorAll('button')]; buttons.forEach(button => button.disabled = true); el('auth-message').textContent = '';
    try { await operation(); } catch (error) { el('auth-message').textContent = friendlyError(error); }
    finally { buttons.forEach(button => button.disabled = false); render(); }
  }
  el('email-form').addEventListener('submit', event => {
    event.preventDefault(); const email = el('account-email').value.trim();
    busy(event.currentTarget, async () => {
      const redirect = location.protocol.startsWith('http') ? '?redirect_to=' + encodeURIComponent(location.origin + location.pathname) : '';
      await request('/auth/v1/otp' + redirect, { method: 'POST', body: { email, create_user: true } });
      pendingEmail = email; el('auth-message').textContent = 'Kiểm tra hộp thư và thư rác. Nhập mã xác nhận trong email; nếu có nút đăng nhập, em cũng có thể mở nút đó.';
      render(); el('account-code').focus();
    });
  });
  el('change-email').addEventListener('click', () => { pendingEmail = ''; el('account-code').value = ''; render(); el('account-email').focus(); });
  el('code-form').addEventListener('submit', event => {
    event.preventDefault();
    el('sync-status').textContent = 'Đang xác nhận tài khoản…';
    busy(event.currentTarget, async () => {
      const result = await request('/auth/v1/verify', { method: 'POST', body: { email: pendingEmail, token: el('account-code').value.trim(), type: 'email' } });
      epoch++; acceptSession(result); pendingEmail = ''; el('account-code').value = ''; loadAccount(); await sync();
      el('auth-message').textContent = 'Đã đăng nhập. Nếu trước đây em học trên máy này, có thể chuyển tiến độ cũ bằng nút bên dưới.';
    });
  });
  el('sign-out').addEventListener('click', async () => {
    if (metadata.dirty && !confirm('Máy này còn tiến độ chưa đồng bộ. Bản này vẫn được giữ riêng theo tài khoản trên máy. Em muốn đăng xuất?')) return;
    const token = session?.access_token; epoch++; session = null; conflict = null; clearTimeout(syncTimer); write(SESSION_KEY, null);
    store.switchAccount(null); el('sync-conflict').hidden = true; el('sync-status').textContent = ''; el('auth-message').textContent = 'Đã đăng xuất trên máy này.'; render();
    if (token) try { await request('/auth/v1/logout?scope=local', { method: 'POST', token }); } catch { /* Đã xóa phiên cục bộ kể cả khi mất mạng. */ }
  });
  el('import-guest').addEventListener('click', () => {
    if (!confirm('Dùng tiến độ học trước khi đăng nhập thay cho tiến độ hiện tại của tài khoản trên máy này? App sẽ giữ một bản dự phòng.')) return;
    try { preserveCurrent(); store.apply(store.guest()); el('auth-message').textContent = 'Đã chuyển tiến độ cũ, đang chờ đồng bộ.'; }
    catch (error) { el('auth-message').textContent = friendlyError(error); }
  });
  el('keep-cloud').addEventListener('click', () => {
    if (!conflict || !confirm('Thay tiến độ trên máy bằng bản đã đồng bộ? Bản trên máy sẽ được lưu dự phòng.')) return;
    try {
      preserveCurrent(); if (!store.apply(conflict.payload, { silent: true })) throw new Error('Could not save');
      metadata = { revision: conflict.revision, dirty: false }; saveMeta(); conflict = null; el('sync-conflict').hidden = true; el('sync-status').textContent = 'Đã dùng bản đã đồng bộ.';
    } catch (error) { el('sync-status').textContent = friendlyError(error); }
  });
  el('keep-local').addEventListener('click', () => {
    if (!conflict || !confirm('Dùng bản trên máy này thay bản đã đồng bộ?')) return;
    metadata.revision = conflict.revision; metadata.dirty = true; saveMeta(); conflict = null; el('sync-conflict').hidden = true; sync();
  });

  function download(document, name) {
    const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob);
    const link = documentForDownload.createElement('a'); link.href = url; link.download = name; documentForDownload.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const documentForDownload = document;
  el('export-progress').addEventListener('click', () => { download({ ...store.get(), createdAt: new Date().toISOString() }, 'bao-yen-tien-do.json'); el('backup-message').textContent = 'Đã chuẩn bị file sao lưu. Em kiểm tra thư mục tải xuống nhé.'; });
  el('export-rescue').addEventListener('click', () => { const backup = read(rescueKey()); if (backup) download(backup, 'bao-yen-du-phong.json'); });
  el('choose-import').addEventListener('click', () => el('import-progress').click());
  el('import-progress').addEventListener('change', async event => {
    const file = event.target.files[0]; event.target.value = ''; if (!file) return;
    try {
      if (file.size > 524288) throw new Error('File is too large');
      const data = JSON.parse(await file.text());
      if (data?.version !== 1 || !Array.isArray(data.progress?.learned) || !Number.isSafeInteger(data.progress?.score)) throw new Error('Invalid backup');
      if (!confirm('Khôi phục file này sẽ thay tiến độ hiện tại: ' + summary(data) + '. Tiếp tục?')) return;
      preserveCurrent(); if (!store.apply(data)) throw new Error('Save failed'); el('backup-message').textContent = 'Đã khôi phục tiến độ. Bản trước đó vẫn có thể tải dự phòng.';
    } catch { el('backup-message').textContent = 'Chưa khôi phục được. Hãy chọn file sao lưu của app, nhỏ hơn 512 KB, và cho phép lưu dữ liệu trang.'; }
  });

  async function start() {
    render(); if (!configured) return;
    const hash = new URLSearchParams(location.hash.slice(1));
    if (hash.has('access_token')) {
      history.replaceState(null, '', location.pathname + location.search);
      try {
        const access = hash.get('access_token'), user = await request('/auth/v1/user', { token: access });
        acceptSession({ access_token: access, refresh_token: hash.get('refresh_token'), expires_in: Number(hash.get('expires_in')) || 3600, user });
        loadAccount(); showScreen('account'); await sync();
      } catch (error) { el('auth-message').textContent = friendlyError(error); showScreen('account'); }
      return;
    }
    const cached = read(SESSION_KEY);
    if (cached) try { acceptSession(cached); loadAccount(); await sync(); } catch (error) { el('auth-message').textContent = friendlyError(error); }
  }
  start();
})();
