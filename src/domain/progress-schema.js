// Cấu trúc tiến độ và chuẩn hóa dữ liệu cũ, bản sao lưu, dữ liệu đồng bộ. Không đọc DOM hoặc storage.
import { dailyPlan, learningItems, letters, PLAN_DAYS, syllableLessons, topics, words } from '../content/catalog.js';
import { localDate, validDate } from '../shared/dates.js';
import { PlatformEngine } from './platform-engine.js';

export const total = letters.length + words.length;
export function emptyProgress() {
  return {
    score: 0,
    streak: 0,
    learned: [],
    wordIndex: 0,
    completedLessons: [],
    lessonIndex: 0,
    completedDays: [],
    daily: null,
    mistakes: [],
    srs: {},
    vocabFilter: { level: 'all', topic: 'all' },
    platform: PlatformEngine.empty()
  };
}
const learningIds = new Set(learningItems.map(x => x.id));
export const validIds = new Set([...letters.map(x => 'letter:' + x.ko), ...words.map(x => 'word:' + x.ko)]);
// Dùng cùng một bộ kiểm tra cho dữ liệu cũ, bản sao lưu và dữ liệu đồng bộ.
// Hàm thuần: không đọc hoặc sửa biến state toàn cục.
export function normalizeProgress(saved, today = localDate()) {
  const progress = emptyProgress();
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    progress.platform = PlatformEngine.normalize(saved.platform);
    for (const key of ['score', 'streak'])
      if (Number.isSafeInteger(saved[key]) && saved[key] >= 0) progress[key] = saved[key];
    if (Array.isArray(saved.learned)) progress.learned = [...new Set(saved.learned.filter(x => validIds.has(x)))];
    if (Number.isInteger(saved.wordIndex) && saved.wordIndex >= 0 && saved.wordIndex < words.length)
      progress.wordIndex = saved.wordIndex;
    const filter = saved.vocabFilter;
    if (filter && ['all', 'A1', 'A2', 'B1', 'B2'].includes(filter.level)) {
      progress.vocabFilter.level = filter.level;
      if (topics.some(t => t.id === filter.topic && (filter.level === 'all' || t.level === filter.level)))
        progress.vocabFilter.topic = filter.topic;
    }
    if (Array.isArray(saved.completedLessons))
      progress.completedLessons = [
        ...new Set(saved.completedLessons.filter(x => syllableLessons.some(lesson => lesson.ko === x)))
      ];
    if (Number.isInteger(saved.lessonIndex) && saved.lessonIndex >= 0 && saved.lessonIndex < syllableLessons.length)
      progress.lessonIndex = saved.lessonIndex;
    if (Array.isArray(saved.completedDays)) {
      for (const entry of saved.completedDays) {
        if (
          entry &&
          entry.day === progress.completedDays.length + 1 &&
          entry.day <= PLAN_DAYS &&
          validDate(entry.date) &&
          entry.date <= today &&
          (!progress.completedDays.length || entry.date > progress.completedDays.at(-1).date)
        )
          progress.completedDays.push({ day: entry.day, date: entry.date });
      }
    }
    if (Array.isArray(saved.mistakes))
      progress.mistakes = [...new Set(saved.mistakes.filter(id => learningIds.has(id)))];
    const d = saved.daily;
    if (
      d &&
      d.date === today &&
      d.day === activeDayOf(progress, today) &&
      Number.isSafeInteger(d.answers) &&
      d.answers >= 0 &&
      Number.isSafeInteger(d.correct) &&
      d.correct >= 0 &&
      d.correct <= d.answers
    ) {
      const plan = dailyPlan[activeDayOf(progress, today) - 1];
      const ids = plan.items.map(item => plan.type + ':' + item.ko);
      progress.daily = {
        date: d.date,
        day: d.day,
        answers: d.answers,
        correct: d.correct,
        studied: Array.isArray(d.studied) ? [...new Set(d.studied.filter(id => ids.includes(id)))] : []
      };
    }
  }
  if (saved?.srs && typeof saved.srs === 'object' && !Array.isArray(saved.srs)) {
    for (const [id, e] of Object.entries(saved.srs)) {
      if (
        learningIds.has(id) &&
        e &&
        Number.isFinite(e.interval) &&
        e.interval >= 1 &&
        Number.isFinite(e.ease) &&
        validDate(e.due)
      )
        progress.srs[id] = {
          interval: Math.min(365, Math.round(e.interval)),
          ease: Math.min(2.5, Math.max(1.3, e.ease)),
          due: e.due,
          reps: Number.isSafeInteger(e.reps) && e.reps >= 0 ? Math.min(e.reps, 10000) : 0,
          lastReviewed: validDate(e.lastReviewed) ? e.lastReviewed : null
        };
    }
  }
  return progress;
}
// Ngày đang học của lộ trình 56 bài cũ (chỉ để tương thích dữ liệu).
export function activeDayOf(progress, today) {
  return (
    progress.completedDays.find(x => x.date === today)?.day || Math.min(PLAN_DAYS, progress.completedDays.length + 1)
  );
}
