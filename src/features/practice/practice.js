// Luyện tập trắc nghiệm: ôn tự do, ôn đến hạn và lượt 10 câu theo chủ đề.
import { currentScreen, onEnterScreen, onLeaveScreen, showScreen } from '../../app/router.js';
import { updateStats } from '../../app/status-bar.js';
import { learningItems, letters, syllableLessons, words } from '../../content/catalog.js';
import { recordReview, save, state } from '../../data/progress-store.js';
import { scopeLabel, wordsForScope } from '../../domain/vocabulary-scope.js';
import { localDate } from '../../shared/dates.js';
import { $ } from '../../shared/dom.js';
import { shuffle } from '../../shared/random.js';
import { koreanVoice, loadVoices, speak } from '../../services/speech.js';

let question = null,
  timer = null,
  previousQuestion = '',
  reviewMode = false,
  topicPracticeMode = null;

function stopTimer() {
  clearTimeout(timer);
  timer = null;
}
export const isTopicPractice = () => !!topicPracticeMode;
// Chỉ để kiểm thử/gỡ lỗi qua window.__app.
export const inspectPractice = () => ({ question, topicPracticeMode });

export function resetPractice() {
  stopTimer();
  reviewMode = false;
  topicPracticeMode = null;
  question = null;
  $('session-summary').hidden = true;
  $('question-panel').hidden = false;
  $('back-vocab').hidden = true;
  $('topic-session-status').hidden = true;
}
export function getDueCount() {
  const today = localDate();
  return learningItems.filter(x => state.srs[x.id]?.due <= today).length;
}
// Dùng chung cho nút "Ôn đến hạn" ở trang chính và cuối bài học.
export function startDueReview() {
  if (!getDueCount()) return false;
  resetPractice();
  reviewMode = true;
  showScreen('practice');
  return true;
}
// Lượt tối đa 10 từ trong một chặng/chủ đề; dueOnly chỉ lấy từ đến hạn ôn.
export function startTopicSession({ level, topic }, dueOnly = false) {
  const pool = wordsForScope(level, topic),
    today = localDate();
  const available = pool.filter(w => !dueOnly || state.srs['word:' + w.ko]?.due <= today);
  if (!available.length) {
    $('topic-action-message').textContent =
      'Chưa có từ đến hạn trong nhóm này. Em có thể học thẻ mới hoặc luyện 10 câu nhé ♡';
    return;
  }
  resetPractice();
  topicPracticeMode = {
    topic,
    level,
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
export function newQuestion() {
  stopTimer();
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
export function answerQuestion(answer, button) {
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
  recordReview(question.id, correct);
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
      if (currentScreen() === 'practice' && !document.hidden) newQuestion();
    }, 2400);
}
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

export function initPractice() {
  $('free-practice').addEventListener('click', () => {
    resetPractice();
    newQuestion();
  });
  $('listen-question').addEventListener('click', () => {
    if (question?.audio) speak(question.audio);
  });
  $('back-vocab').addEventListener('click', () => {
    resetPractice();
    showScreen('vocabulary');
  });
  // Lượt mới cùng chặng/chủ đề vừa luyện (bộ lọc không đổi được khi đang ở màn luyện).
  $('repeat-topic').addEventListener('click', () => {
    if (topicPracticeMode) startTopicSession(topicPracticeMode, false);
  });
  $('next-question').addEventListener('click', newQuestion);
  onLeaveScreen(stopTimer);
  onEnterScreen('practice', newQuestion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
  });
}
