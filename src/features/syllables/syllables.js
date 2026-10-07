// Ghép âm: chọn phụ âm đầu/nguyên âm/phụ âm cuối và 6 ví dụ đọc mẫu.
import { letters, syllableLessons } from '../../content/catalog.js';
import { save, state } from '../../data/progress-store.js';
import { composeSyllable } from '../../domain/hangul.js';
import { $ } from '../../shared/dom.js';
import { speak } from '../../services/speech.js';

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
export function renderLesson() {
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
export function initSyllables() {
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
  renderLesson();
}
