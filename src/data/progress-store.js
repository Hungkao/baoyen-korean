// Tầng dữ liệu tiến độ: giữ state hiện tại, đọc/ghi localStorage theo phạm vi khách hoặc tài khoản.
// Không chạm DOM. UI nghe sự kiện trên window để cập nhật giao diện:
//   storage-status         { status: 'ok' | 'read-failed' | 'write-failed' }
//   progress-saved         { key }   sau mỗi lần lưu (trừ khi silent)
//   progress-loaded                  sau khi thay toàn bộ tiến độ (khôi phục, đổi tài khoản, tải lại)
//   progress-scope-changed           khi đổi giữa khách và tài khoản
import { LessonEngine } from '../domain/lesson-engine.js';
import { PlatformEngine } from '../domain/platform-engine.js';
import { emptyProgress, normalizeProgress, validIds } from '../domain/progress-schema.js';
import { SRS } from '../domain/srs.js';
import { localDate } from '../shared/dates.js';

export const BASE_KEY = 'hangul-little-steps-v1';
let key = BASE_KEY;
// Live binding: module khác đọc được state mới nhất nhưng chỉ file này gán lại.
export let state = emptyProgress();

let canWrite = () => true;
const replacedHandlers = [];

function storageStatus(status) {
  window.dispatchEvent(new CustomEvent('storage-status', { detail: { status } }));
}
function readProgress(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return normalizeProgress(raw ? JSON.parse(raw) : null);
  } catch {
    storageStatus('read-failed');
    return emptyProgress();
  }
}

// Gọi một lần khi khởi động, sau khi UI đã nghe storage-status.
export function initProgressStore() {
  state = readProgress(key);
}
// Khóa tab (data/tab-lock.js) quyết định tab này có được ghi tiến độ hay không.
export function setWriteGuard(guard) {
  canWrite = guard;
}
// UI đăng ký việc vẽ lại khi toàn bộ tiến độ bị thay.
export function onProgressReplaced(handler) {
  replacedHandlers.push(handler);
}

export function save(silent = false) {
  if (!canWrite()) return false;
  let stored = true;
  try {
    localStorage.setItem(key, JSON.stringify(state));
    storageStatus('ok');
  } catch {
    stored = false;
    storageStatus('write-failed');
  }
  if (!silent) window.dispatchEvent(new CustomEvent('progress-saved', { detail: { key } }));
  return stored;
}

export function markLearned(id) {
  if (state.learned.includes(id)) return;
  state.learned.push(id);
  save();
}
// Lịch ôn đơn giản lấy cảm hứng từ SM-2, không phải SM-2 chuẩn; logic ở domain/srs.js. Chưa lưu.
export function recordReview(id, correct) {
  const next = SRS.next(state.srs[id], correct, localDate());
  if (next) state.srs[id] = next;
}

// API cho tài khoản, khóa tab và bài học; không đưa mã xác thực vào dữ liệu học.
export const progressStore = {
  get: () => ({ version: 1, progress: JSON.parse(JSON.stringify(state)) }),
  key: () => key,
  guest: () => ({ version: 1, progress: readProgress(BASE_KEY) }),
  apply(document, { silent = false } = {}) {
    if (
      document?.version !== 1 ||
      !document.progress ||
      !Array.isArray(document.progress.learned) ||
      !Number.isSafeInteger(document.progress.score)
    )
      throw new Error('Bản tiến độ không đúng định dạng hoặc thuộc phiên bản mới hơn.');
    state = normalizeProgress(document.progress);
    const stored = save(silent);
    this.refresh();
    return stored;
  },
  switchAccount(id) {
    if (id && !/^[a-f0-9-]{36}$/i.test(id)) throw new Error('Tài khoản không hợp lệ.');
    key = id ? BASE_KEY + ':' + id : BASE_KEY;
    state = readProgress(key);
    this.refresh();
    window.dispatchEvent(new Event('progress-scope-changed'));
  },
  reload() {
    state = readProgress(key);
    this.refresh();
  },
  updatePlatform(update) {
    if (!canWrite()) return false;
    const draft = PlatformEngine.normalize(state.platform);
    update(draft);
    state.platform = PlatformEngine.normalize(draft);
    return save();
  },
  learningAction(action) {
    if (!canWrite()) return { error: 'Tab này chưa có quyền lưu tiến độ.' };
    const result = LessonEngine.transition(state.platform.learning, action);
    if (result.error) return result;
    state.platform.learning = result.data;
    state.platform.events.push(...result.events.map(e => ({ ...e, date: localDate() })));
    state.platform.events = state.platform.events.slice(-100);
    for (const e of result.events)
      if (e.type === 'vocabulary_seen' && validIds.has(e.entityId) && !state.learned.includes(e.entityId))
        state.learned.push(e.entityId);
    state.score = Math.min(Number.MAX_SAFE_INTEGER, state.score + result.xp);
    const stored = save();
    for (const e of result.events) window.dispatchEvent(new CustomEvent(e.type, { detail: { id: e.entityId } }));
    return { ...result, stored };
  },
  refresh() {
    for (const handler of replacedHandlers) handler();
    window.dispatchEvent(new Event('progress-loaded'));
  }
};
