// Thẻ từ vựng theo chặng/chủ đề: thử nhớ, lật thẻ, tự đánh giá để xếp lịch ôn.
import { onEnterScreen } from '../../app/router.js';
import { topics, words } from '../../content/catalog.js';
import { markLearned, recordReview, save, state } from '../../data/progress-store.js';
import { scopeLabel, topicName, wordsForScope } from '../../domain/vocabulary-scope.js';
import { localDate } from '../../shared/dates.js';
import { $ } from '../../shared/dom.js';
import { speak } from '../../services/speech.js';
import { startTopicSession } from '../practice/practice.js';

let currentTopic = 'all',
  currentLevel = 'all',
  vocabIndex = 0,
  wordRated = false;

function getFilteredWords() {
  return wordsForScope(currentLevel, currentTopic);
}
// Đọc lại bộ lọc đã lưu khi tiến độ bị thay (đổi tài khoản, khôi phục).
export function syncVocabularyFilter() {
  currentLevel = state.vocabFilter.level;
  currentTopic = state.vocabFilter.topic;
}
function setupTopicFilter() {
  const c = $('topic-filter');
  c.replaceChildren();
  $('topic-select').replaceChildren();
  $('level-filter').value = currentLevel;
  const visible = topics.filter(t => currentLevel === 'all' || t.level === currentLevel);
  for (const t of [{ id: 'all', name: 'Tất cả chủ đề' }, ...visible]) {
    const option = document.createElement('option');
    option.value = t.id;
    option.textContent = t.name;
    $('topic-select').append(option);
  }
  $('topic-select').value = currentTopic;
  for (const t of visible) {
    const list = words.filter(w => w.topic === t.id),
      seen = list.filter(w => state.learned.includes('word:' + w.ko)).length;
    const b = document.createElement('button');
    b.className = 'topic-btn' + (t.id === currentTopic ? ' active' : '');
    b.dataset.topic = t.id;
    b.setAttribute('aria-pressed', String(t.id === currentTopic));
    const name = document.createElement('strong');
    name.textContent = t.name;
    const count = document.createElement('span');
    count.textContent = t.level + ' · ' + list.length + ' từ · Đã xem ' + seen;
    b.append(name, count);
    b.addEventListener('click', () => changeVocabularyFilter(currentLevel, t.id));
    c.append(b);
  }
  const index = getFilteredWords().findIndex(w => w === words[state.wordIndex]);
  vocabIndex = Math.max(0, index);
}
function changeVocabularyFilter(level, topic) {
  currentLevel = level;
  currentTopic = topic;
  state.vocabFilter = { level, topic };
  const first = getFilteredWords()[0];
  if (first) state.wordIndex = words.indexOf(first);
  setupTopicFilter();
  renderWord();
  save();
  $('topic-action-message').textContent = '';
}
function renderTopicOverview() {
  const fw = getFilteredWords(),
    seen = fw.filter(w => state.learned.includes('word:' + w.ko)).length;
  const due = fw.filter(w => state.srs['word:' + w.ko]?.due <= localDate()).length;
  $('topic-overview').textContent =
    scopeLabel(currentLevel, currentTopic) + ' · ' + fw.length + ' từ · ' + seen + ' đã xem · ' + due + ' đến hạn';
  $('review-topic-btn').textContent = 'Ôn đến hạn · ' + due + ' từ';
}
export function renderWord() {
  const fw = getFilteredWords();
  $('word-card').hidden = !fw.length;
  $('practice-topic-btn').disabled = !fw.length;
  if (!fw.length) {
    renderTopicOverview();
    return;
  }
  vocabIndex = ((vocabIndex % fw.length) + fw.length) % fw.length;
  const item = fw[vocabIndex];
  state.wordIndex = words.indexOf(item);
  $('word-counter').textContent = 'Thẻ ' + (vocabIndex + 1) + ' / ' + fw.length;
  $('word-level').textContent = item.level + ' · ' + topicName(item.topic);
  $('word-ko').textContent = item.ko;
  $('word-roman').textContent = item.roman;
  $('word-meaning').textContent = item.meaning;
  $('word-example-ko').textContent = item.exampleKo;
  $('word-example-vi').textContent = item.exampleVi;
  $('word-details').hidden = true;
  $('reveal-word').hidden = false;
  $('reveal-word').setAttribute('aria-expanded', 'false');
  wordRated = false;
  $('remember-word').disabled = false;
  $('again-word').disabled = false;
  $('word-rating-status').textContent = '';
  markLearned('word:' + item.ko);
  renderTopicOverview();
}
function rateWord(correct) {
  if (wordRated || $('word-details').hidden) return;
  wordRated = true;
  const item = getFilteredWords()[vocabIndex],
    id = 'word:' + item.ko;
  recordReview(id, correct);
  if (correct) state.mistakes = state.mistakes.filter(x => x !== id);
  else if (!state.mistakes.includes(id)) state.mistakes.push(id);
  save();
  $('remember-word').disabled = true;
  $('again-word').disabled = true;
  $('word-rating-status').textContent =
    (correct ? 'Một bước nhỏ đáng yêu ♡' : 'Không sao, em sẽ gặp lại từ này nhé ♡') +
    ' · Ôn tiếp: ' +
    state.srs[id].due.split('-').reverse().join('/');
  renderTopicOverview();
}
function moveWord(step) {
  const fw = getFilteredWords();
  if (!fw.length) return;
  vocabIndex = (vocabIndex + step + fw.length) % fw.length;
  renderWord();
  save();
}

export function initVocabulary() {
  syncVocabularyFilter();
  $('level-filter').addEventListener('change', () => changeVocabularyFilter($('level-filter').value, 'all'));
  $('topic-select').addEventListener('change', () => changeVocabularyFilter(currentLevel, $('topic-select').value));
  $('reveal-word').addEventListener('click', () => {
    $('word-details').hidden = false;
    $('reveal-word').setAttribute('aria-expanded', 'true');
  });
  $('remember-word').addEventListener('click', () => rateWord(true));
  $('again-word').addEventListener('click', () => rateWord(false));
  $('listen-word').addEventListener('click', () => speak(getFilteredWords()[vocabIndex].ko));
  $('listen-example').addEventListener('click', () => speak(getFilteredWords()[vocabIndex].exampleKo));
  $('prev-word').addEventListener('click', () => moveWord(-1));
  $('next-word').addEventListener('click', () => moveWord(1));
  $('practice-topic-btn').addEventListener('click', () =>
    startTopicSession({ level: currentLevel, topic: currentTopic }, false)
  );
  $('review-topic-btn').addEventListener('click', () =>
    startTopicSession({ level: currentLevel, topic: currentTopic }, true)
  );
  onEnterScreen('vocabulary', () => {
    setupTopicFilter();
    renderWord();
  });
}
