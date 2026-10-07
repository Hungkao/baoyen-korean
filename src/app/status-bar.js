// Điểm, chuỗi đúng, số mục đã xem và thông báo lưu trữ ở đầu trang.
import { state } from '../data/progress-store.js';
import { total } from '../domain/progress-schema.js';
import { $ } from '../shared/dom.js';

const storageMessages = {
  ok: '',
  'read-failed': 'Chưa đọc được tiến độ đã lưu. Bạn vẫn có thể học trong phiên này.',
  'write-failed':
    'Trình duyệt đang chặn lưu tiến độ. Hãy cho phép dữ liệu trang web và xuất bản sao lưu trước khi đóng trang.'
};

export function updateStats() {
  $('score').textContent = state.score;
  $('header-score').textContent = state.score;
  $('streak').textContent = state.streak;
  $('learned').textContent = state.learned.length + '/' + total;
  $('progress').max = total;
  $('progress').value = state.learned.length;
}

// Gọi trước initProgressStore() để không bỏ lỡ lỗi đọc tiến độ lúc khởi động.
export function initStatusBar() {
  window.addEventListener('storage-status', event => {
    $('storage-notice').textContent = storageMessages[event.detail.status];
  });
  window.addEventListener('progress-saved', updateStats);
}
