// Khung app: thanh điều hướng, giọng đọc khi ẩn tab và vẽ lại khi toàn bộ tiến độ bị thay.
import { onProgressReplaced } from '../data/progress-store.js';
import { renderLetters } from '../features/alphabet/alphabet.js';
import { renderHome } from '../features/home/home.js';
import { resetPractice } from '../features/practice/practice.js';
import { renderLesson } from '../features/syllables/syllables.js';
import { syncVocabularyFilter } from '../features/vocabulary/vocabulary.js';
import { synth } from '../services/speech.js';
import { currentScreen, showScreen } from './router.js';
import { updateStats } from './status-bar.js';

export function initShell() {
  document.querySelectorAll('nav button, [data-subscreen]').forEach(button =>
    button.addEventListener('click', () => {
      resetPractice();
      showScreen(button.dataset.screen || button.dataset.subscreen);
    })
  );
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && synth) synth.cancel();
  });
  // Khôi phục bản sao lưu, đổi tài khoản hoặc tải lại từ tab khác.
  onProgressReplaced(() => {
    resetPractice();
    syncVocabularyFilter();
    updateStats();
    renderLetters();
    renderLesson();
    renderHome();
    if (currentScreen() !== 'account') showScreen('home');
  });
}
