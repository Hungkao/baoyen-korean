// Bảng 40 chữ cái: bấm chữ để nghe, xem gợi ý và đánh dấu đã xem.
import { onEnterScreen } from '../../app/router.js';
import { letters } from '../../content/catalog.js';
import { markLearned, state } from '../../data/progress-store.js';
import { $ } from '../../shared/dom.js';
import { speak } from '../../services/speech.js';

export function renderLetters() {
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

export function initAlphabet() {
  onEnterScreen('alphabet', renderLetters);
}
