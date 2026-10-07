// Lọc kho từ theo chặng/chủ đề. Hàm thuần, không đọc DOM hoặc storage.
import { topics, words } from '../content/catalog.js';

export function wordsForScope(level, topic) {
  return words.filter(w => (level === 'all' || w.level === level) && (topic === 'all' || w.topic === topic));
}
export function topicName(id) {
  return topics.find(t => t.id === id)?.name || 'Tất cả chủ đề';
}
export function scopeLabel(level, topic) {
  return topic !== 'all' ? topicName(topic) : level === 'all' ? 'Tất cả từ vựng' : 'Chặng ' + level;
}
