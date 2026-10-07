'use strict';
// Giao diện và luồng học chính. Dữ liệu ở core-data.js, tiến độ ở progress-store.js,
// lịch ôn ở srs.js, giọng đọc ở speech.js (tải trước file này trong index.html).
const $ = id => document.getElementById(id);
const BASE_KEY = 'hangul-little-steps-v1';
let KEY = BASE_KEY;
let state = emptyProgress();
function readProgress(key) {
  try {
    const raw = localStorage.getItem(key);
    return normalizeProgress(raw ? JSON.parse(raw) : null);
  } catch (error) {
    $('storage-notice').textContent = 'Chưa đọc được tiến độ đã lưu. Bạn vẫn có thể học trong phiên này.';
    return emptyProgress();
  }
}
state = readProgress(KEY);
function save(silent = false) {
  if (window.tabAccess && !window.tabAccess.writable()) return false;
  let stored = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    $('storage-notice').textContent = '';
  } catch (error) {
    stored = false;
    $('storage-notice').textContent =
      'Trình duyệt đang chặn lưu tiến độ. Hãy cho phép dữ liệu trang web và xuất bản sao lưu trước khi đóng trang.';
  }
  if (!silent) window.dispatchEvent(new CustomEvent('progress-saved', { detail: { key: KEY } }));
  return stored;
}
function updateStats() {
  $('score').textContent = state.score;
  $('header-score').textContent = state.score;
  $('streak').textContent = state.streak;
  $('learned').textContent = state.learned.length + '/' + total;
  $('progress').max = total;
  $('progress').value = state.learned.length;
}
function markLearned(id) {
  if (!state.learned.includes(id)) {
    state.learned.push(id);
    save();
    updateStats();
  }
}
// Lịch ôn đơn giản lấy cảm hứng từ SM-2, không phải SM-2 chuẩn; logic ở srs.js.
function updateSRS(id, correct) {
  const next = SRS.next(state.srs[id], correct, localDate());
  if (next) state.srs[id] = next;
}
function activeDay() {
  return activeDayOf(state, localDate());
}
function getDueCount() {
  const today = localDate();
  return learningItems.filter(x => state.srs[x.id]?.due <= today).length;
}

function renderHome() {
  // Lời nhắn đổi theo ngày của lộ trình cũ để giữ nhịp quen thuộc.
  $('love-message').textContent = loveMessages[(activeDay() - 1) % loveMessages.length];
  if ($('back-vocab')) $('back-vocab').hidden = !topicPracticeMode;
}
$('free-practice').addEventListener('click', () => {
  resetPractice();
  newQuestion();
});
function renderLetters() {
  for (const group of ['vowels', 'extended_vowels', 'compound_vowels', 'consonants', 'tense_consonants']) {
    $(group).replaceChildren();
    letters
      .filter(x => x.group === group)
      .forEach(item => {
        const learned = state.learned.includes('letter:' + item.ko);
        const button = document.createElement('button');
        button.className = 'letter' + (learned ? ' learned' : '');
        button.setAttribute('aria-label', item.ko + ', ' + item.roman + (learned ? ', đã học' : ''));
        const ko = document.createElement('span');
        ko.className = 'ko';
        ko.lang = 'ko';
        ko.textContent = item.ko;
        const roman = document.createElement('span');
        roman.className = 'roman';
        roman.textContent = item.roman;
        button.append(ko, roman);
        if (learned) {
          const check = document.createElement('span');
          check.className = 'check';
          check.textContent = '✓';
          check.setAttribute('aria-hidden', 'true');
          button.append(check);
        }
        button.addEventListener('click', () => {
          markLearned('letter:' + item.ko);
          button.classList.add('learned');
          button.setAttribute('aria-label', item.ko + ', ' + item.roman + ', đã học');
          if (!button.querySelector('.check')) {
            const check = document.createElement('span');
            check.className = 'check';
            check.textContent = '✓';
            check.setAttribute('aria-hidden', 'true');
            button.append(check);
          }
          $('letter-detail').replaceChildren();
          const title = document.createElement('div');
          title.className = 'large-ko';
          title.lang = 'ko';
          title.textContent = item.ko;
          const romanText = document.createElement('div');
          romanText.className = 'romanization';
          romanText.textContent = item.roman;
          const hint = document.createElement('p');
          hint.textContent = item.hint;
          $('letter-detail').append(title, romanText, hint);
          speak(item.say);
        });
        $(group).append(button);
      });
  }
}
let currentTopic = state.vocabFilter.topic,
  currentLevel = state.vocabFilter.level,
  vocabIndex = 0,
  wordRated = false;
function wordsForScope(level, topic) {
  return words.filter(w => (level === 'all' || w.level === level) && (topic === 'all' || w.topic === topic));
}
function getFilteredWords() {
  return wordsForScope(currentLevel, currentTopic);
}
function topicName(id) {
  return topics.find(t => t.id === id)?.name || 'Tất cả chủ đề';
}
function scopeLabel(level, topic) {
  return topic !== 'all' ? topicName(topic) : level === 'all' ? 'Tất cả từ vựng' : 'Chặng ' + level;
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
$('level-filter').addEventListener('change', () => changeVocabularyFilter($('level-filter').value, 'all'));
$('topic-select').addEventListener('change', () => changeVocabularyFilter(currentLevel, $('topic-select').value));
function renderTopicOverview() {
  const fw = getFilteredWords(),
    seen = fw.filter(w => state.learned.includes('word:' + w.ko)).length;
  const due = fw.filter(w => state.srs['word:' + w.ko]?.due <= localDate()).length;
  $('topic-overview').textContent =
    scopeLabel(currentLevel, currentTopic) + ' · ' + fw.length + ' từ · ' + seen + ' đã xem · ' + due + ' đến hạn';
  $('review-topic-btn').textContent = 'Ôn đến hạn · ' + due + ' từ';
}
function renderWord() {
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
$('reveal-word').addEventListener('click', () => {
  $('word-details').hidden = false;
  $('reveal-word').setAttribute('aria-expanded', 'true');
});
function rateWord(correct) {
  if (wordRated || $('word-details').hidden) return;
  wordRated = true;
  const item = getFilteredWords()[vocabIndex],
    id = 'word:' + item.ko;
  updateSRS(id, correct);
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
$('remember-word').addEventListener('click', () => rateWord(true));
$('again-word').addEventListener('click', () => rateWord(false));
$('listen-word').addEventListener('click', () => speak(getFilteredWords()[vocabIndex].ko));
$('listen-example').addEventListener('click', () => speak(getFilteredWords()[vocabIndex].exampleKo));
function moveWord(step) {
  const fw = getFilteredWords();
  if (!fw.length) return;
  vocabIndex = (vocabIndex + step + fw.length) % fw.length;
  renderWord();
  save();
}
$('prev-word').addEventListener('click', () => moveWord(-1));
$('next-word').addEventListener('click', () => moveWord(1));
// Hangul = U+AC00 + (phụ âm đầu × 21 + nguyên âm) × 28 + phụ âm cuối.
// Nguồn: https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-3/
function composeSyllable(initial, vowel, final = '') {
  const l = initialOrder.indexOf(initial),
    v = vowelOrder.indexOf(vowel),
    t = finalOrder.indexOf(final);
  if (initial.length !== 1 || vowel.length !== 1 || l < 0 || v < 0 || t < 0) return '';
  return String.fromCodePoint(0xac00 + (l * 21 + v) * 28 + t);
}
function renderSyllable() {
  const initial = $('initial-select').value,
    vowel = $('vowel-select').value,
    final = $('final-select').value;
  $('syllable-result').textContent = composeSyllable(initial, vowel, final);
  $('syllable-parts').textContent = [initial, vowel, ...(final ? [final] : [])].join(' + ');
  $('syllable-hint').textContent =
    (initial === 'ㅇ' ? 'ㅇ đầu âm không phát âm. ' : '') +
    (final ? 'Phụ âm cuối nằm dưới khối chữ.' : 'Âm tiết này không có phụ âm cuối.');
}
function renderLesson() {
  const lesson = syllableLessons[state.lessonIndex];
  $('lesson-ko').textContent = lesson.ko;
  $('lesson-roman').textContent = lesson.roman;
  $('lesson-explanation').textContent = lesson.explanation;
  $('lesson-progress').textContent = state.completedLessons.length + ' / ' + syllableLessons.length + ' ví dụ đã đọc';
  $('lesson-feedback').textContent =
    state.completedLessons.length === syllableLessons.length
      ? 'Bạn đã đọc cả 6 ví dụ! Thử phần Luyện tập để nhớ lâu hơn nhé.'
      : state.completedLessons.includes(lesson.ko)
        ? '✓ Bạn đã đọc ví dụ này. Có thể ôn lại bất cứ lúc nào.'
        : '';
  document.querySelectorAll('#lesson-buttons button').forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index === state.lessonIndex));
    button.textContent =
      syllableLessons[index].ko + (state.completedLessons.includes(syllableLessons[index].ko) ? ' ✓' : '');
  });
  $('initial-select').value = lesson.initial;
  $('vowel-select').value = lesson.vowel;
  $('final-select').value = lesson.final;
  renderSyllable();
}
function setupSyllables() {
  for (const [id, items] of [
    ['initial-select', letters.filter(x => x.group === 'consonants').map(x => x.ko)],
    ['vowel-select', letters.filter(x => x.group === 'vowels').map(x => x.ko)],
    ['final-select', ['', 'ㄱ', 'ㄴ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ']]
  ]) {
    for (const value of items) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value || 'Không';
      $(id).append(option);
    }
    $(id).addEventListener('change', renderSyllable);
  }
  syllableLessons.forEach((lesson, index) => {
    const button = document.createElement('button');
    button.lang = 'ko';
    button.setAttribute('aria-label', 'Ví dụ ' + lesson.ko);
    button.addEventListener('click', () => {
      state.lessonIndex = index;
      renderLesson();
      save();
    });
    $('lesson-buttons').append(button);
  });
  renderLesson();
}
$('listen-syllable').addEventListener('click', () => speak($('syllable-result').textContent));
$('listen-lesson').addEventListener('click', () => speak(syllableLessons[state.lessonIndex].ko));
$('prev-lesson').addEventListener('click', () => {
  state.lessonIndex =
    (((state.lessonIndex - 1) % syllableLessons.length) + syllableLessons.length) % syllableLessons.length;
  renderLesson();
  save();
});
$('complete-lesson').addEventListener('click', () => {
  const lesson = syllableLessons[state.lessonIndex];
  if (!state.completedLessons.includes(lesson.ko)) state.completedLessons.push(lesson.ko);
  state.lessonIndex = (state.lessonIndex + 1) % syllableLessons.length;
  renderLesson();
  save();
});
// Trộn Fisher–Yates để đáp án và câu hỏi không có thứ tự cố định.
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
let screen = 'home',
  question = null,
  timer = null,
  previousQuestion = '',
  reviewMode = false,
  topicPracticeMode = null;
function resetPractice() {
  clearTimeout(timer);
  timer = null;
  reviewMode = false;
  topicPracticeMode = null;
  question = null;
  $('session-summary').hidden = true;
  $('question-panel').hidden = false;
  $('back-vocab').hidden = true;
  $('topic-session-status').hidden = true;
}
// Dùng chung cho nút "Ôn đến hạn" ở trang chính và cuối bài học.
function startDueReview() {
  if (!getDueCount()) return false;
  resetPractice();
  reviewMode = true;
  showScreen('practice');
  return true;
}
window.startDueReview = startDueReview;
$('listen-question').addEventListener('click', () => {
  if (question?.audio) speak(question.audio);
});
function startTopicSession(dueOnly = false) {
  const pool = getFilteredWords(),
    today = localDate();
  const available = pool.filter(w => !dueOnly || state.srs['word:' + w.ko]?.due <= today);
  if (!available.length) {
    $('topic-action-message').textContent =
      'Chưa có từ đến hạn trong nhóm này. Em có thể học thẻ mới hoặc luyện 10 câu nhé ♡';
    return;
  }
  resetPractice();
  topicPracticeMode = {
    topic: currentTopic,
    level: currentLevel,
    dueOnly,
    queue: shuffle(available)
      .slice(0, 10)
      .map(w => 'word:' + w.ko),
    index: 0,
    results: []
  };
  $('topic-action-message').textContent = '';
  showScreen('practice');
}
$('practice-topic-btn').addEventListener('click', () => startTopicSession(false));
$('review-topic-btn').addEventListener('click', () => startTopicSession(true));
$('back-vocab').addEventListener('click', () => {
  resetPractice();
  showScreen('vocabulary');
});
$('repeat-topic').addEventListener('click', () => startTopicSession(false));
function finishTopicSession() {
  const session = topicPracticeMode;
  question = null;
  $('question-panel').hidden = true;
  $('session-summary').hidden = false;
  const correct = session.results.filter(r => r.correct).length;
  $('session-result').textContent = correct + ' / ' + session.results.length + ' câu đúng';
  $('session-note').textContent =
    scopeLabel(session.level, session.topic) +
    ' · Tiến độ đã ghi nhận. Lịch ôn giúp em gặp lại từng từ vào những ngày tới.';
  $('session-mistakes').replaceChildren();
  const mistakes = session.results.filter(r => !r.correct);
  if (!mistakes.length) {
    const p = document.createElement('p');
    p.textContent = 'Em đã trả lời đúng cả lượt này ♡ Hẹn em ở buổi ôn tiếp theo.';
    $('session-mistakes').append(p);
  }
  for (const result of mistakes) {
    const item = words.find(w => 'word:' + w.ko === result.id),
      card = document.createElement('div');
    card.className = 'mistake-card';
    const ko = document.createElement('strong');
    ko.lang = 'ko';
    ko.textContent = item.ko;
    const meaning = document.createElement('p');
    meaning.textContent = item.meaning;
    const example = document.createElement('p');
    example.lang = 'ko';
    example.textContent = item.exampleKo;
    const vi = document.createElement('p');
    vi.textContent = item.exampleVi;
    const listen = document.createElement('button');
    listen.textContent = '🔊 Nghe ' + item.ko;
    listen.addEventListener('click', () => speak(item.ko));
    card.append(ko, meaning, example, vi, listen);
    $('session-mistakes').append(card);
  }
  $('topic-session-status').textContent = 'Đã hoàn thành ' + session.results.length + ' câu';
  $('session-result').focus();
}
function newQuestion() {
  clearTimeout(timer);
  timer = null;
  let available = learningItems;
  if (topicPracticeMode) {
    if (question?.answered) topicPracticeMode.index++;
    if (topicPracticeMode.index >= topicPracticeMode.queue.length) {
      finishTopicSession();
      return;
    }
    available = learningItems.filter(x => x.id === topicPracticeMode.queue[topicPracticeMode.index]);
  }
  if (reviewMode) {
    available = learningItems.filter(x => state.srs[x.id]?.due <= localDate());
    if (!available.length) {
      reviewMode = false;
      showScreen('home');
      return;
    }
  }
  const filtered = available.filter(x => x.id !== previousQuestion),
    candidates = filtered.length ? filtered : available;
  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  const { type, item, id } = selected;
  previousQuestion = id;
  loadVoices();
  const listening =
    type === 'word' && !!koreanVoice && typeof window.SpeechSynthesisUtterance === 'function' && Math.random() < 0.35;
  const pool = topicPracticeMode
    ? wordsForScope(topicPracticeMode.level, topicPracticeMode.topic)
    : type === 'letter'
      ? letters
      : type === 'word'
        ? words
        : syllableLessons;
  const field = listening ? 'ko' : type === 'word' ? 'meaning' : 'roman';
  question = {
    answer: item[field],
    answered: false,
    id,
    item,
    field
  };
  $('question-panel').hidden = false;
  $('session-summary').hidden = true;
  $('topic-session-status').hidden = !topicPracticeMode;
  if (topicPracticeMode)
    $('topic-session-status').textContent =
      scopeLabel(topicPracticeMode.level, topicPracticeMode.topic) +
      ' · ' +
      (topicPracticeMode.dueOnly ? 'Ôn đến hạn · ' : '') +
      'Câu ' +
      (topicPracticeMode.index + 1) +
      ' / ' +
      topicPracticeMode.queue.length;
  if ($('back-vocab')) $('back-vocab').hidden = !topicPracticeMode;
  $('question-type').textContent =
    type === 'letter' ? 'CHỮ CÁI • Phiên âm' : type === 'word' ? 'TỪ VỰNG • Nghĩa tiếng Việt' : 'GHÉP ÂM • Tập đọc';
  $('question-ko').textContent = item.ko;
  $('question-ko').classList.toggle('is-letter', type === 'letter');
  $('question-prompt').textContent =
    type === 'word'
      ? 'Từ này có nghĩa là gì?'
      : type === 'syllable'
        ? 'Âm tiết này đọc thế nào?'
        : 'Chữ này có phiên âm nào?';
  $('listen-question').hidden = !listening;
  question.audio = listening ? item.ko : null;
  if (listening) {
    $('question-type').textContent = 'LUYỆN NGHE';
    $('question-ko').textContent = '♪';
    $('question-prompt').textContent = 'Bấm Nghe rồi chọn từ em nghe được.';
  }
  const moveFocus = $('answers').contains(document.activeElement) || document.activeElement === $('next-question');
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('next-question').hidden = true;
  $('answers').replaceChildren();
  // Không đánh đố bài nghe bằng hai cách viết chỉ khác dấu câu/khoảng trắng.
  const spokenKey = value => value.replace(/[\s?!.,…]/g, '');
  const wrong = shuffle(
    [...new Set(pool.map(x => x[field]))].filter(
      x => x !== question.answer && (!listening || spokenKey(x) !== spokenKey(question.answer))
    )
  ).slice(0, 3);
  shuffle([question.answer, ...wrong]).forEach(answer => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.lang = listening ? 'ko' : 'vi';
    button.textContent = answer;
    button.addEventListener('click', () => answerQuestion(answer, button));
    $('answers').append(button);
  });
  if (moveFocus) $('answers').firstElementChild.focus({ preventScroll: true });
}
function answerQuestion(answer, button) {
  if (!question || question.answered) return;
  question.answered = true;
  const correct = answer === question.answer;
  document.querySelectorAll('.answer').forEach(node => {
    node.disabled = true;
    if (node.textContent === question.answer) node.classList.add('correct');
  });
  if (correct) {
    state.score = Math.min(Number.MAX_SAFE_INTEGER, state.score + 10);
    state.streak = Math.min(Number.MAX_SAFE_INTEGER, state.streak + 1);
    $('feedback').textContent = 'Đúng rồi! +10 điểm 🌷';
    celebrate(button);
  } else {
    state.streak = 0;
    button.classList.add('wrong');
    $('feedback').textContent = 'Chưa đúng. Đáp án: ' + question.answer + '. Thử tiếp nhé!';
  }
  if (correct) state.mistakes = state.mistakes.filter(id => id !== question.id);
  else if (!state.mistakes.includes(question.id)) state.mistakes.push(question.id);
  updateSRS(question.id, correct);
  if (topicPracticeMode) topicPracticeMode.results.push({ id: question.id, correct, answer });
  if ($('back-vocab')) $('back-vocab').hidden = !topicPracticeMode;
  $('feedback').className = 'feedback ' + (correct ? 'good' : 'bad');
  save();
  updateStats();
  $('next-question').hidden = false;
  $('next-question').focus({ preventScroll: true });
  // Cho thời gian đọc phản hồi; người dùng có thể chuyển ngay bằng nút.
  if (!topicPracticeMode)
    timer = setTimeout(() => {
      if (screen === 'practice' && !document.hidden) newQuestion();
    }, 2400);
}
$('next-question').addEventListener('click', newQuestion);
// Một trái tim nhỏ bay lên từ đáp án đúng; tắt khi người dùng giảm chuyển động.
function celebrate(target) {
  if (!target || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heart = document.createElement('span');
  heart.className = 'float-heart';
  heart.textContent = '♡ +10';
  heart.setAttribute('aria-hidden', 'true');
  const box = target.getBoundingClientRect();
  heart.style.left = box.left + box.width / 2 + 'px';
  heart.style.top = box.top + 'px';
  document.body.append(heart);
  heart.addEventListener('animationend', () => heart.remove());
  if (navigator.vibrate) navigator.vibrate(12);
}
function showScreen(next) {
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
  if (!screens.includes(next)) return;
  clearTimeout(timer);
  timer = null;
  screen = next;
  for (const id of screens) $(id).hidden = id !== screen;
  document.querySelector('.skip-link').href = '#' + screen + '-title';
  document.body.dataset.view = screen;
  // Ghép âm là tab con của Chữ cái; lộ trình và nội dung bài cũ thuộc tab Bài học.
  const tab = screen === 'syllables' ? 'alphabet' : screen === 'lesson-outline' ? 'roadmap' : screen;
  document.querySelectorAll('nav button, [data-subscreen]').forEach(node => {
    if ((node.dataset.screen || node.dataset.subscreen) === (node.dataset.subscreen ? screen : tab))
      node.setAttribute('aria-current', 'page');
    else node.removeAttribute('aria-current');
  });
  if (screen === 'home') renderHome();
  if (screen === 'alphabet') renderLetters();
  if (screen === 'vocabulary') {
    setupTopicFilter();
    renderWord();
  }
  if (screen === 'practice') newQuestion();
  $(screen + '-title').focus();
  window.scrollTo({ top: 0, behavior: 'instant' });
  window.dispatchEvent(new CustomEvent('screen-changed', { detail: { screen: next } }));
}
document.querySelectorAll('nav button, [data-subscreen]').forEach(button =>
  button.addEventListener('click', () => {
    resetPractice();
    showScreen(button.dataset.screen || button.dataset.subscreen);
  })
);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearTimeout(timer);
    timer = null;
    if (synth) synth.cancel();
  } else {
    renderHome();
  }
});
updateStats();
renderLetters();
setupSyllables();
renderHome();

// Cầu nối nhỏ cho tài khoản; không đưa mã xác thực vào dữ liệu học.
window.progressStore = {
  get: () => ({ version: 1, progress: JSON.parse(JSON.stringify(state)) }),
  key: () => KEY,
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
    KEY = id ? BASE_KEY + ':' + id : BASE_KEY;
    state = readProgress(KEY);
    this.refresh();
    window.dispatchEvent(new Event('progress-scope-changed'));
  },
  reload() {
    state = readProgress(KEY);
    this.refresh();
  },
  updatePlatform(update) {
    if (window.tabAccess && !window.tabAccess.writable()) return false;
    const draft = PlatformEngine.normalize(state.platform);
    update(draft);
    state.platform = PlatformEngine.normalize(draft);
    return save();
  },
  learningAction(action) {
    if (window.tabAccess && !window.tabAccess.writable()) return { error: 'Tab này chưa có quyền lưu tiến độ.' };
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
    updateStats();
    for (const e of result.events) window.dispatchEvent(new CustomEvent(e.type, { detail: { id: e.entityId } }));
    return { ...result, stored };
  },
  refresh() {
    resetPractice();
    currentLevel = state.vocabFilter.level;
    currentTopic = state.vocabFilter.topic;
    updateStats();
    renderLetters();
    renderLesson();
    renderHome();
    if (screen !== 'account') showScreen('home');
    window.dispatchEvent(new Event('progress-loaded'));
  }
};
