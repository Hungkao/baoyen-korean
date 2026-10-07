// Điểm vào duy nhất của app. Thứ tự khởi động có ý nghĩa:
// UI nghe sự kiện trước → đọc tiến độ → vẽ màn → khóa tab → tài khoản → nền tảng/bài học → PWA.
import './styles/main.css';
import { exposeDebugBridge } from './app/debug-bridge.js';
import { initShell } from './app/shell.js';
import { initStatusBar, updateStats } from './app/status-bar.js';
import { initProgressStore } from './data/progress-store.js';
import { initTabLock } from './data/tab-lock.js';
import { initAccount } from './features/account/account.js';
import { initAlphabet, renderLetters } from './features/alphabet/alphabet.js';
import { initHome, renderHome } from './features/home/home.js';
import { initLessonRenderer } from './features/lessons/lesson-renderer.js';
import { initPlatformUi } from './features/platform/platform-ui.js';
import { initPractice } from './features/practice/practice.js';
import { initSyllables } from './features/syllables/syllables.js';
import { initVocabulary } from './features/vocabulary/vocabulary.js';
import { initPwa } from './services/pwa.js';
import { initSpeech } from './services/speech.js';

initSpeech();
initStatusBar();
initProgressStore();
initShell();
initHome();
initAlphabet();
initVocabulary();
initPractice();
updateStats();
renderLetters();
initSyllables();
renderHome();
initTabLock();
initAccount();
initPlatformUi();
initLessonRenderer();
initPwa();
exposeDebugBridge();
