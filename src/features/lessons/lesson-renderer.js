// Màn học theo bài: vẽ từng phần (dạy, từ vựng, ngữ pháp, bài tập, quiz, kết quả).
// UI chỉ tạo control; mọi chấm điểm/hoàn thành nằm trong domain/lesson-engine.js.
import { currentScreen, showScreen } from '../../app/router.js';
import { LESSON_CONTENT } from '../../content/lessons.js';
import { letters, words } from '../../content/catalog.js';
import { progressStore, save, state } from '../../data/progress-store.js';
import { tabAccess } from '../../data/tab-lock.js';
import { ExerciseEngine } from '../../domain/exercise-engine.js';
import { LessonEngine } from '../../domain/lesson-engine.js';
import { localDate } from '../../shared/dates.js';
import { shuffle } from '../../shared/random.js';
import { koreanVoice, loadVoices, speak, synth } from '../../services/speech.js';
import { resetPractice, startDueReview } from '../practice/practice.js';

// Được điền khi initLessonRenderer() chạy: { open, continueLearning, renderRoadmap, render }.
export const LessonUI = {};

export function initLessonRenderer() {
  const E = LessonEngine,
    C = LESSON_CONTENT,
    host = document.getElementById('lesson-body');
  const learning = () => progressStore.get().progress.platform.learning;
  let viewing = null,
    exerciseIndex = null,
    sectionKey = '';
  const node = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const ko = text => {
    const n = node('p', text, 'lesson-ko');
    n.lang = 'ko';
    return n;
  };
  const button = (text, action, cls = '') => {
    const b = node('button', text, cls);
    b.type = 'button';
    b.addEventListener('click', action);
    return b;
  };
  function audio(text) {
    const b = button('🔊 Nghe', () => speak(text));
    b.setAttribute('aria-label', 'Nghe tiếng Hàn: ' + text);
    return b;
  }
  function message(text) {
    document.getElementById('lesson-storage').textContent = text;
  }
  function act(action) {
    const result = progressStore.learningAction(action);
    if (result.error) {
      message(result.error);
      return false;
    }
    // Chỉ báo khi có vấn đề; lưu thành công là mặc định, không cần nhắc ở mỗi bước.
    message(
      result.stored ? '' : 'Chưa lưu được trên máy. Xuất bản sao trước khi đóng; thay đổi hiện chỉ còn trong phiên này.'
    );
    return true;
  }
  function open(id) {
    const data = learning(),
      status = E.status(id, data);
    if (status === 'available') {
      if (data.session && !data.session.finished && data.session.lessonId !== id) {
        if (!confirm('Bắt đầu bài này sẽ thay phiên đang học; các kết quả đã hoàn thành vẫn được giữ.')) return;
      }
      if (!act({ type: 'start', lessonId: id, replace: true })) return;
    }
    viewing = status === 'completed' ? id : null;
    exerciseIndex = null;
    sectionKey = '';
    resetPractice();
    showScreen('lesson');
    render();
  }
  function continueLearning() {
    const s = learning().session;
    if (s && !s.finished) open(s.lessonId);
    else showScreen('roadmap');
  }
  function renderRoadmap(target) {
    const d = learning();
    let current = null;
    // Thứ tự gợi ý: chữ trước, rồi giao tiếp; mọi bài vẫn mở.
    const groups = [
      ['hangul', 'Hangul', 'Từ chữ cái đến đọc trọn từ.'],
      ['basics', 'Giao tiếp nhập môn', 'Chào hỏi, giới thiệu và những câu đầu tiên.'],
      ['sejong1a', 'Tình huống hằng ngày', '10 tình huống ngắn, nhớ bằng ví dụ.']
    ];
    for (const [level, title, description] of groups) {
      const group = node('section', undefined, 'roadmap-group');
      group.append(node('h3', title), node('p', description, 'note'));
      for (const u of C.units.filter(u => u.levelId === level)) {
        const progress = E.unitProgress(u.id, d),
          box = node('details', undefined, 'panel core-unit');
        box.dataset.unit = u.id;
        box.open = u.lessonIds.includes(d.session?.lessonId) || u === C.units.find(x => x.levelId === level);
        const summary = node('summary');
        summary.append(
          node('span', u.title, 'unit-title'),
          node('span', progress.complete ? '✓ Xong' : progress.completed + '/' + progress.total, 'unit-count')
        );
        box.append(summary);
        for (const id of u.lessonIds) {
          const l = E.get(id),
            status = E.status(id, d),
            active = d.session?.lessonId === id && !d.session.finished;
          const b = button('', () => open(id), 'core-lesson');
          b.append(
            node('span', status === 'completed' ? '✓' : active ? '●' : '', 'lesson-mark'),
            node('span', l.title, 'lesson-name'),
            node('span', status === 'completed' ? 'Xem lại' : active ? 'Đang học' : '', 'lesson-state')
          );
          b.setAttribute(
            'aria-label',
            l.title +
              (status === 'completed' ? ', đã xong, xem lại' : active ? ', đang học, tiếp tục' : ', học bài này')
          );
          b.dataset.lesson = id;
          b.dataset.status = status;
          if (active) {
            b.classList.add('is-current');
            current = b;
          }
          box.append(b);
        }
        group.append(box);
      }
      target.append(group);
    }
    const sources = node('details', undefined, 'curriculum-source');
    sources.append(node('summary', 'Về nội dung bài học'));
    const link = node('a', C.reference.title);
    link.href = C.reference.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    sources.append(
      node(
        'p',
        'Nội dung tự biên soạn, đang chờ giáo viên thẩm định. 10 tình huống tham khảo khung chủ đề của giáo trình dưới đây; đây không phải bản dịch sách.'
      ),
      link
    );
    target.append(sources);
    // Đưa bài đang học vào tầm mắt khi mở lộ trình.
    if (current) requestAnimationFrame(() => current.scrollIntoView({ block: 'center', behavior: 'instant' }));
  }
  function vocabulary(l, container) {
    for (const id of l.vocabularyIds) {
      const w = words.find(w => 'word:' + w.ko === id);
      if (!w) continue;
      const card = node('article', undefined, 'panel');
      card.append(ko(w.ko), node('p', w.roman, 'romanization'), audio(w.ko));
      const detail = node('details');
      detail.append(
        node('summary', 'Mở nghĩa và ví dụ'),
        node('p', w.meaning),
        ko(w.exampleKo),
        node('p', w.exampleVi),
        audio(w.exampleKo)
      );
      card.append(detail);
      const status = node('p', undefined, 'note');
      card.append(
        button('Thêm vào lịch ôn', () => {
          if (!tabAccess.writable()) return;
          if (!state.srs[id]) {
            state.srs[id] = { interval: 1, ease: 2.5, due: localDate(), reps: 0, lastReviewed: null };
            const saved = save();
            status.textContent = saved ? 'Đã thêm để ôn; chưa coi là đã nhớ.' : 'Chưa lưu được lịch ôn.';
          } else status.textContent = 'Từ đã có lịch ôn; giữ nguyên lịch hiện tại.';
        }),
        status
      );
      container.append(card);
    }
  }
  function grammar(l, container) {
    for (const id of l.grammarIds) {
      const g = C.grammar.find(g => g.id === id),
        card = node('article', undefined, 'panel');
      card.append(node('h3', g.title), ko(g.pattern), node('p', g.meaning), node('p', g.usage), node('p', g.structure));
      for (const ex of g.examples) card.append(ko(ex.ko), node('p', ex.vi), audio(ex.ko));
      for (const note of [...g.notes, ...g.commonMistakes]) card.append(node('p', note, 'note'));
      container.append(card);
    }
  }
  function teaching(l, container) {
    if (l.memoryCue) {
      const cue = node('aside', undefined, 'panel memory-cue');
      cue.append(node('h3', 'Một mẹo để nhớ'), node('p', l.memoryCue));
      container.append(cue);
    }
    for (const card of l.sections.find(s => s.type === 'TEACH').cards) {
      const box = node('article', undefined, 'panel');
      if (card.ko) box.append(ko(card.ko));
      if (card.audio) box.append(audio(card.audio));
      if (card.letterId) {
        const letter = letters.find(x => 'letter:' + x.ko === card.letterId);
        if (letter) box.append(node('p', letter.roman, 'romanization'));
      }
      box.append(node('p', card.vi));
      container.append(box);
    }
    if (l.dialogue) {
      const scene = node('article', undefined, 'panel lesson-dialogue');
      scene.append(node('h3', 'Một cuộc trò chuyện nhỏ'));
      for (const [i, line] of l.dialogue.entries()) {
        const row = node('div');
        row.append(node('span', i % 2 ? 'Bạn B' : 'Bạn A', 'eyebrow'), ko(line.ko), node('p', line.vi), audio(line.ko));
        scene.append(row);
      }
      container.append(scene);
    }
    if (l.recallPrompt) {
      const recall = node('article', undefined, 'panel recall-card');
      recall.append(node('h3', 'Thử nhớ trước khi mở'), node('p', l.recallPrompt));
      const reveal = node('details');
      reveal.append(node('summary', 'Mở một câu mẫu'), ko(l.recallAnswer), audio(l.recallAnswer));
      recall.append(
        reveal,
        node('p', 'Thử nói hoặc viết ra giấy trước. Câu mẫu chỉ để đối chiếu, không tự ghi là đã thuộc.', 'note')
      );
      container.append(recall);
    }
  }
  function result(l, data, container, review = false) {
    const s = data.session?.lessonId === l.id ? data.session : null,
      r = data.results[l.id];
    if (!r) return;
    const current = s?.finished ? E.summarize(l, s) : null,
      passed = review ? !!r.completedAt : current?.passed;
    container.append(
      node('h3', passed ? '✓ Bài hoàn thành ♡' : 'Ôn lại bài — em đang tiến bộ từng chút'),
      node(
        'p',
        `${r.correct}/${r.total} đúng · ${r.total - r.correct} sai · Độ chính xác ${Math.round((r.correct * 100) / r.total)}%`
      ),
      node('p', `Quiz: ${r.quizCorrect}/${r.quizTotal} đúng · Cần ${l.completionRules.quizThreshold}% để đạt.`),
      node(
        'p',
        `${l.vocabularyIds.length} từ đã gặp · ${l.grammarIds.length} điểm ngữ pháp · ${Math.floor(r.seconds / 60)} phút ${r.seconds % 60} giây hoạt động · Lượt ${r.attempts}`
      )
    );
    container.append(
      node('p', `XP lượt này: +${r.xpAwarded || 0}`),
      node(
        'p',
        `Có ${r.audioFallbacks} câu nghe dùng chế độ đọc thay thế. Kết quả không đánh giá phát âm hay chứng nhận trình độ. Điểm chỉ cộng cho lần đầu hoàn thành bài; xem lại/làm lại không cộng thêm.`,
        'note'
      )
    );
    if (current) {
      const mistakes = E.exercises(l).filter(
        e => s.answers[e.id] && !ExerciseEngine.grade(e, s.answers[e.id].value).correct
      );
      for (const e of mistakes) {
        const g = ExerciseEngine.grade(e, s.answers[e.id].value);
        const card = node('div', undefined, 'panel');
        card.append(
          node('strong', e.prompt),
          node('p', 'Em trả lời: ' + g.userAnswer),
          node('p', 'Đáp án: ' + g.answer),
          node('p', g.explanation)
        );
        container.append(card);
      }
    }
    if (!review && passed) {
      container.append(
        button('Về trang Học', () => showScreen('home'), 'primary'),
        button('Ôn từ đến hạn', () => startDueReview())
      );
    }
    if (!review)
      container.append(
        button(
          passed ? 'Làm lại để luyện thêm' : 'Ôn lại và thử lần nữa',
          () => {
            if (act({ type: 'retry', lessonId: l.id })) {
              viewing = null;
              exerciseIndex = null;
              render();
            }
          },
          passed ? '' : 'primary'
        )
      );
    container.append(
      button('Xem lại nội dung', () => {
        viewing = l.id;
        renderReview(l, data);
      }),
      button('Về lộ trình', () => showScreen('roadmap'))
    );
  }
  function renderReview(l, data) {
    host.replaceChildren();
    host.append(
      node(
        'p',
        data.results[l.id]?.completedAt
          ? 'Xem lại nội dung đã hoàn thành; không cộng điểm.'
          : 'Ôn nội dung trước khi thử lại.'
      )
    );
    result(l, data, host, true);
    teaching(l, host);
    vocabulary(l, host);
    grammar(l, host);
    host.append(
      button(
        'Học lại bài từ đầu',
        () => {
          const s = learning().session;
          if (s && !s.finished && !confirm('Bắt đầu lại sẽ thay phiên bài đang học. Tiếp tục?')) return;
          if (act({ type: 'start', lessonId: l.id, replace: true })) {
            viewing = null;
            exerciseIndex = null;
            render();
          }
        },
        'primary'
      )
    );
  }
  function renderExercise(l, s, section) {
    const list = section.exercises;
    if (exerciseIndex === null)
      exerciseIndex = Math.max(
        0,
        list.findIndex(e => !s.answers[e.id])
      );
    exerciseIndex = Math.min(exerciseIndex, list.length - 1);
    const e = list[exerciseIndex],
      answer = s.answers[e.id];
    host.append(node('p', `Câu ${exerciseIndex + 1}/${list.length}`, 'eyebrow'));
    const prompt = node('h4', e.prompt);
    host.append(prompt);
    let fallback = answer?.fallback || false;
    if (e.type === 'AUDIO_CHOICE') {
      loadVoices();
      const unavailable = !koreanVoice || typeof window.SpeechSynthesisUtterance !== 'function';
      fallback = fallback || unavailable;
      host.append(audio(e.audio));
      const fallbackText = node(
        'p',
        fallback ? e.fallbackPrompt : 'Bấm nghe. Nếu không phát được, em có thể chuyển sang bài đọc tương đương.',
        'notice'
      );
      fallbackText.setAttribute('role', 'status');
      host.append(fallbackText);
      if (!answer)
        host.append(
          button('Không nghe được · dùng bài đọc', () => {
            fallback = true;
            fallbackText.textContent = e.fallbackPrompt;
            if (synth) synth.cancel();
          })
        );
      if (unavailable)
        host.append(
          node(
            'p',
            'Thiết bị chưa có giọng Hàn. Bấm Nghe để xem hướng dẫn cài giọng; câu này ghi nhận là luyện đọc.',
            'note'
          )
        );
    }
    const form = node('form', undefined, 'exercise-form'),
      controls = node('fieldset');
    controls.append(node('legend', e.instruction || 'Hoàn thành câu trả lời rồi bấm Kiểm tra.'));
    let value = () => null;
    if (['TYPING', 'FILL_BLANK'].includes(e.type)) {
      const label = node('label', 'Câu trả lời tiếng Hàn'),
        input = document.createElement('input');
      input.lang = 'ko';
      input.id = 'exercise-input';
      input.maxLength = 200;
      input.required = true;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.value = answer?.value || '';
      label.htmlFor = input.id;
      controls.append(
        label,
        input,
        node('p', 'Dùng bàn phím tiếng Hàn của thiết bị. Có thể thêm bàn phím Hàn trong cài đặt bàn phím.', 'note')
      );
      value = () => input.value;
    } else if (e.type === 'MATCH') {
      const selects = [];
      const options = shuffle(e.pairs.map(p => p.right));
      e.pairs.forEach((pair, i) => {
        const label = node('label', pair.left);
        const select = document.createElement('select');
        select.id = 'match-' + i;
        select.required = true;
        select.setAttribute('aria-label', 'Ghép với ' + pair.left);
        const blank = node('option', 'Chọn cặp');
        blank.value = '';
        select.append(blank);
        for (const right of options) {
          const op = node('option', right);
          op.value = right;
          select.append(op);
        }
        select.value = answer?.value[i] || '';
        label.htmlFor = select.id;
        controls.append(label, select);
        selects.push(select);
      });
      value = () => selects.map(s => s.value);
    } else if (e.type === 'ORDER') {
      let order = answer ? [...answer.value] : [];
      const output = node('p', undefined, 'order-output');
      output.setAttribute('aria-live', 'polite');
      const tiles = node('div', undefined, 'word-tiles');
      const repaint = () => {
        output.textContent = order.map(i => e.tokens[i]).join(' ') || 'Chạm các mảnh theo thứ tự.';
        tiles.replaceChildren();
        e.tokens.forEach((token, i) => {
          const b = button(token, () => {
            order.push(i);
            repaint();
          });
          b.disabled = order.includes(i);
          b.dataset.token = i;
          tiles.append(b);
        });
      };
      repaint();
      controls.append(
        output,
        tiles,
        button('Xóa thứ tự', () => {
          order = [];
          repaint();
        })
      );
      value = () => order;
    } else {
      const list = shuffle(e.choices);
      for (const option of list) {
        const label = node('label', undefined, 'exercise-choice');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = option;
        input.required = true;
        input.checked = answer?.value === option;
        label.append(input, node('span', option));
        controls.append(label);
      }
      value = () => form.querySelector('input[name=answer]:checked')?.value || '';
    }
    controls.disabled = !!answer;
    form.append(controls);
    if (!answer) {
      const submit = node('button', 'Kiểm tra', 'primary');
      submit.type = 'submit';
      form.append(submit);
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (act({ type: 'answer', exerciseId: e.id, value: value(), fallback })) {
          render();
          document.getElementById('exercise-feedback')?.focus();
        }
      });
    }
    host.append(form);
    if (answer) {
      const g = ExerciseEngine.grade(e, answer.value);
      const feedback = node('div', undefined, 'panel exercise-feedback ' + (g.correct ? 'good' : 'bad'));
      feedback.id = 'exercise-feedback';
      feedback.tabIndex = -1;
      feedback.setAttribute('role', 'status');
      feedback.append(
        node('strong', g.correct ? '✓ Chính xác' : '↻ Chưa đúng, em xem lại nhé'),
        node('p', 'Em trả lời: ' + g.userAnswer),
        node('p', 'Đáp án: ' + g.answer),
        node('p', g.explanation)
      );
      host.append(feedback);
      if (exerciseIndex < list.length - 1)
        host.append(
          button(
            'Câu tiếp →',
            () => {
              exerciseIndex++;
              render();
            },
            'primary'
          )
        );
      else nextButton(section);
    }
  }
  function nextButton(section) {
    const label = section.type === 'QUIZ' ? 'Nộp quiz' : section.type === 'SUMMARY' ? 'Xem kết quả' : 'Tiếp tục →';
    host.append(
      button(
        label,
        () => {
          if (act({ type: 'next', submitQuiz: section.type === 'QUIZ' })) {
            exerciseIndex = null;
            render();
            document.getElementById('lesson-title').focus();
          }
        },
        'primary'
      )
    );
  }
  function render() {
    if (currentScreen() !== 'lesson') return;
    const data = learning(),
      s = data.session,
      l = E.get(viewing || s?.lessonId);
    host.replaceChildren();
    if (!l) {
      host.append(
        node('p', 'Em chọn một bài từ lộ trình để bắt đầu nhé.'),
        button('Mở lộ trình', () => showScreen('roadmap'))
      );
      return;
    }
    document.getElementById('lesson-title').textContent = l.title;
    const step = document.getElementById('lesson-step');
    step.max = l.sections.length;
    step.value = s?.lessonId === l.id && !s.finished ? s.currentSection + 1 : l.sections.length;
    const status = E.status(l.id, data);
    if (viewing && status === 'completed') {
      renderReview(l, data);
      return;
    }
    if (!s || s.lessonId !== l.id) return;
    if (s.finished) {
      result(l, data, host);
      return;
    }
    const section = l.sections[s.currentSection],
      key = l.id + ':' + section.id;
    if (sectionKey !== key) {
      sectionKey = key;
      exerciseIndex = null;
    }
    const head = node('div', undefined, 'lesson-step-head');
    head.append(node('span', `Phần ${s.currentSection + 1}/${l.sections.length} · ${section.title}`, 'note'));
    if (s.currentSection > 0)
      head.append(
        button(
          '← Phần trước',
          () => {
            if (act({ type: 'back' })) {
              exerciseIndex = null;
              render();
            }
          },
          'back-link'
        )
      );
    host.append(head);
    if (section.type === 'INTRO') {
      host.append(node('p', l.description), node('h3', 'Sau bài này em có thể'));
      const list = node('ul');
      l.objectives.forEach(o => list.append(node('li', o)));
      host.append(
        list,
        node(
          'p',
          `Khoảng ${l.estimatedMinutes} phút. Bài hoàn thành khi em đi hết các phần và đạt quiz từ ${l.completionRules.quizThreshold}%.`,
          'note'
        ),
        node('p', 'Nội dung học thử, chưa được giáo viên thẩm định.', 'note')
      );
      if (l.referenceTheme)
        host.append(
          node(
            'p',
            'Tình huống: ' + l.referenceTheme + ' (tham khảo ' + C.reference.title + ', nội dung tự biên soạn).',
            'note'
          )
        );
    }
    if (section.type === 'TEACH') teaching(l, host);
    if (section.type === 'VOCABULARY') vocabulary(l, host);
    if (section.type === 'GRAMMAR') grammar(l, host);
    if (section.exercises) {
      renderExercise(l, s, section);
      return;
    }
    if (section.type === 'SUMMARY')
      host.append(
        node('h3', 'Em vừa học'),
        node('p', l.objectives.join(' ')),
        node('p', 'Em có thể quay lại ôn bài này bất cứ lúc nào.', 'note')
      );
    nextButton(section);
  }
  Object.assign(LessonUI, { open, continueLearning, renderRoadmap, render });
  window.addEventListener('screen-changed', () => {
    if (currentScreen() === 'lesson') render();
  });
  window.addEventListener('progress-loaded', () => {
    viewing = null;
    exerciseIndex = null;
    sectionKey = '';
    message('');
    render();
  });
  window.addEventListener('progress-scope-changed', () => {
    viewing = null;
    exerciseIndex = null;
    sectionKey = '';
    message('');
  });
  // Renderer nạp sau router; khôi phục màn học bằng session của đúng tài khoản.
  if (currentScreen() === 'lesson') render();
  if (currentScreen() === 'roadmap') showScreen('roadmap');
}
