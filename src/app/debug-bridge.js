// Cửa sổ cho kiểm thử tự động và gỡ lỗi trong DevTools: window.__app.
// Chỉ đọc state và gọi hàm sẵn có; không chứa mã xác thực. App không tự dùng object này.
import { COURSE_CONTENT } from '../content/course.js';
import { dailyPlan, letters, syllableLessons, words } from '../content/catalog.js';
import { LESSON_CONTENT } from '../content/lessons.js';
import { BASE_KEY, progressStore, recordReview, save, state } from '../data/progress-store.js';
import { tabAccess } from '../data/tab-lock.js';
import { composeSyllable } from '../domain/hangul.js';
import { LessonEngine } from '../domain/lesson-engine.js';
import { activeDayOf, normalizeProgress, total } from '../domain/progress-schema.js';
import { accountState } from '../features/account/account.js';
import { LessonUI } from '../features/lessons/lesson-renderer.js';
import { platformCatalog } from '../features/platform/platform-ui.js';
import { answerQuestion, inspectPractice, newQuestion } from '../features/practice/practice.js';
import { renderWord } from '../features/vocabulary/vocabulary.js';
import { dayBefore, localDate } from '../shared/dates.js';
import { koreanVoice, speak } from '../services/speech.js';
import { showScreen } from './router.js';
import { updateStats } from './status-bar.js';

export function exposeDebugBridge() {
  window.__app = Object.freeze({
    // Trạng thái sống (getter để luôn thấy bản mới nhất sau khi đổi tài khoản/khôi phục).
    get state() {
      return state;
    },
    get KEY() {
      return progressStore.key();
    },
    get accountState() {
      return accountState;
    },
    get question() {
      return inspectPractice().question;
    },
    get topicPracticeMode() {
      return inspectPractice().topicPracticeMode;
    },
    get koreanVoice() {
      return koreanVoice;
    },
    activeDay: () => activeDayOf(state, localDate()),
    // Nội dung và engine.
    BASE_KEY,
    COURSE_CONTENT,
    LESSON_CONTENT,
    dailyPlan,
    letters,
    words,
    syllableLessons,
    total,
    platformCatalog,
    LessonEngine,
    composeSyllable,
    normalizeProgress,
    localDate,
    dayBefore,
    // Thao tác.
    save,
    recordReview,
    progressStore,
    tabAccess,
    showScreen,
    updateStats,
    newQuestion,
    answerQuestion,
    renderWord,
    speak,
    LessonUI
  });
}
