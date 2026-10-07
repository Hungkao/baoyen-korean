// Trang chính: lời nhắn theo ngày.
import { onEnterScreen } from '../../app/router.js';
import { loveMessages } from '../../content/catalog.js';
import { state } from '../../data/progress-store.js';
import { activeDayOf } from '../../domain/progress-schema.js';
import { localDate } from '../../shared/dates.js';
import { $ } from '../../shared/dom.js';
import { isTopicPractice } from '../practice/practice.js';

export function renderHome() {
  // Lời nhắn đổi theo ngày của lộ trình cũ để giữ nhịp quen thuộc.
  $('love-message').textContent = loveMessages[(activeDayOf(state, localDate()) - 1) % loveMessages.length];
  if ($('back-vocab')) $('back-vocab').hidden = !isTopicPractice();
}

export function initHome() {
  onEnterScreen('home', renderHome);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) renderHome();
  });
}
