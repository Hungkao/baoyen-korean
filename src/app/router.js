// Điều hướng giữa các màn hình (section) trong index.html.
// Feature đăng ký việc cần làm khi vào/rời màn hình; router không biết chi tiết từng màn.
import { $ } from '../shared/dom.js';

const screens = [
  'home',
  'alphabet',
  'syllables',
  'vocabulary',
  'practice',
  'account',
  'onboarding',
  'roadmap',
  'settings',
  'lesson-outline',
  'lesson'
];
let current = 'home';
const leaveHandlers = [];
const enterHandlers = new Map();

export const currentScreen = () => current;
export function onLeaveScreen(handler) {
  leaveHandlers.push(handler);
}
export function onEnterScreen(name, handler) {
  if (!enterHandlers.has(name)) enterHandlers.set(name, []);
  enterHandlers.get(name).push(handler);
}

export function showScreen(next) {
  if (!screens.includes(next)) return;
  for (const handler of leaveHandlers) handler();
  current = next;
  for (const id of screens) $(id).hidden = id !== current;
  document.querySelector('.skip-link').href = '#' + current + '-title';
  document.body.dataset.view = current;
  // Ghép âm là tab con của Chữ cái; lộ trình và nội dung bài cũ thuộc tab Bài học.
  const tab = current === 'syllables' ? 'alphabet' : current === 'lesson-outline' ? 'roadmap' : current;
  document.querySelectorAll('nav button, [data-subscreen]').forEach(node => {
    if ((node.dataset.screen || node.dataset.subscreen) === (node.dataset.subscreen ? current : tab))
      node.setAttribute('aria-current', 'page');
    else node.removeAttribute('aria-current');
  });
  for (const handler of enterHandlers.get(current) || []) handler();
  $(current + '-title').focus();
  window.scrollTo({ top: 0, behavior: 'instant' });
  window.dispatchEvent(new CustomEvent('screen-changed', { detail: { screen: next } }));
}
