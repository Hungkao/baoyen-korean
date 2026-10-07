const assert = require('node:assert/strict');
const fs = require('node:fs'),
  path = require('node:path'),
  vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['exercise-engine.js', 'lesson-content.js', 'lesson-engine.js'])
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx);
const { LessonEngine: E, ExerciseEngine: X, LESSON_CONTENT: C } = ctx;
const right = e => (e.type === 'MATCH' ? e.pairs.map(p => p.right) : e.correctAnswer);
const wrong = e =>
  e.type === 'MATCH'
    ? e.pairs.map((p, i) => e.pairs[(i + 1) % e.pairs.length].right)
    : e.type === 'ORDER'
      ? [...e.correctAnswer].reverse()
      : ['TYPING', 'FILL_BLANK'].includes(e.type)
        ? '오답'
        : e.choices.find(v => v !== e.correctAnswer);
let d = E.empty(),
  xp = 0;
const allTypes = new Set(),
  ids = new Set();
function run(action) {
  const r = E.transition(d, action, '2026-10-04T10:00:00Z');
  assert.ok(!r.error, r.error);
  d = r.data;
  xp += r.xp;
  return r;
}
function finish(l, correct = true) {
  for (const section of l.sections) {
    for (const e of section.exercises || [])
      run({
        type: 'answer',
        exerciseId: e.id,
        value: correct ? right(e) : wrong(e),
        fallback: e.type === 'AUDIO_CHOICE'
      });
    run({ type: 'next', submitQuiz: section.type === 'QUIZ' });
  }
}
assert.equal(E.status(C.lessons[1].id, d), 'available');
assert.ok(!E.transition(d, { type: 'start', lessonId: C.lessons[1].id }).error);
for (const l of C.lessons) {
  assert.ok(!ids.has(l.id));
  ids.add(l.id);
  assert.ok(l.id.startsWith('h2-') || l.id.startsWith('b2-') || l.id.startsWith('s1-'));
  assert.ok(l.sections.find(s => s.type === 'QUIZ').exercises.length >= 3);
  assert.ok(l.objectives.length);
  assert.equal(l.contentStatus, 'draft');
  for (const e of E.exercises(l)) {
    assert.ok(!ids.has(e.id));
    ids.add(e.id);
    allTypes.add(e.type);
    assert.ok(e.explanation);
    assert.equal(X.grade(e, right(e)).correct, true, e.id);
    assert.equal(X.grade(e, wrong(e)).correct, false, e.id);
  }
}
assert.deepEqual([...allTypes].sort(), [...X.types].sort());
const first = C.lessons[0];
run({ type: 'start', lessonId: first.id });
assert.equal(d.results[first.id], undefined);
assert.ok(
  E.transition(d, { type: 'answer', exerciseId: E.exercises(first)[0].id, value: right(E.exercises(first)[0]) }).error
);
finish(first, false);
assert.equal(d.results[first.id].completedAt, null);
assert.equal(E.status(C.lessons[1].id, d), 'available');
assert.equal(xp, 0);
run({ type: 'retry', lessonId: first.id });
finish(first);
assert.ok(d.results[first.id].completedAt);
const once = xp;
run({ type: 'retry', lessonId: first.id });
finish(first);
assert.equal(xp, once, 'No repeated XP');
for (const l of C.lessons.slice(1)) {
  assert.equal(E.status(l.id, d), 'available');
  run({ type: 'start', lessonId: l.id });
  finish(l);
  d = E.normalize(JSON.parse(JSON.stringify(d)));
  assert.ok(d.results[l.id].completedAt);
}
assert.ok(C.units.every(u => E.unitProgress(u.id, d).complete));
assert.equal(Object.keys(d.checkpoints).length, C.lessons.filter(l => l.type === 'checkpoint').length);
assert.ok(JSON.stringify(d).length < 100000, 'Bounded completed curriculum');
const evil = E.normalize({
  session: { lessonId: 'h2-a-eo', startedAt: 'bad' },
  results: { unknown: { completedAt: '2026-10-04' } }
});
assert.equal(evil.session, null);
assert.equal(Object.keys(evil.results).length, 0);
console.log(
  'PASS pure engines: all 9 exercise types, entire curriculum, fail/retry, free lesson choice, checkpoint, no duplicate XP, bounded validation.'
);

(async () => {
  const b = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {})
  });
  try {
    const context = await b.newContext({ viewport: { width: 360, height: 820 }, reducedMotion: 'reduce' });
    // Giọng giả chỉ kiểm tra API; không tuyên bố kiểm thử chất lượng âm thanh.
    await context.addInitScript(() => {
      window.spoken = [];
      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          getVoices: () => [{ lang: 'ko-KR' }],
          addEventListener() {},
          cancel() {},
          speak(u) {
            window.spoken.push({ text: u.text, lang: u.lang, rate: u.rate });
          }
        }
      });
      window.SpeechSynthesisUtterance = class {
        constructor(text) {
          this.text = text;
        }
      };
    });
    const p = await context.newPage(),
      errors = [];
    p.on('pageerror', e => errors.push(e.message));
    await p.goto(pathToFileURL(path.join(__dirname, '../index.html')).href);
    await p.waitForFunction(() => tabAccess.writable());
    // Trang chính chỉ chọn nội dung; không tự khởi tạo bài hoặc buộc onboarding.
    await p.locator('[data-study=roadmap]').click();
    assert.equal(await p.locator('.core-lesson[data-status=available]').count(), C.lessons.length);
    await p.locator('[data-screen=home]').click();
    assert.equal(await p.locator('[data-study]').count(), 1);
    const integrity = await p.evaluate(() => ({
      missing: LESSON_CONTENT.lessons
        .flatMap(l => l.vocabularyIds)
        .filter(id => !words.some(w => 'word:' + w.ko === id)),
      grammar: LESSON_CONTENT.lessons
        .flatMap(l => l.grammarIds)
        .filter(id => !LESSON_CONTENT.grammar.some(g => g.id === id)),
      letters: [
        ...new Set(
          LESSON_CONTENT.lessons
            .flatMap(l => l.sections.flatMap(s => (s.cards || []).map(c => c.letterId)))
            .filter(Boolean)
        )
      ],
      catalogLetters: letters.map(l => 'letter:' + l.ko)
    }));
    assert.deepEqual(integrity.missing, []);
    assert.deepEqual(integrity.grammar, []);
    assert.deepEqual(integrity.letters.sort(), integrity.catalogLetters.sort());
    await p.getByRole('button', { name: 'Thiết lập mục tiêu →', exact: true }).click();
    await p.locator('#onboarding-form button[type=submit]').click();
    assert.equal(await p.locator('[data-lesson=h2-o-u]').getAttribute('data-status'), 'available');
    await p.locator('[data-lesson=h2-a-eo]').click();
    assert.match(await p.locator('#lesson-body').innerText(), /Sau bài này/);
    assert.equal(await p.evaluate(() => state.completedDays.length), 0);
    await p.getByRole('button', { name: 'Tiếp tục →', exact: true }).click();
    await p.locator('#lesson-body button').filter({ hasText: '🔊 Nghe' }).first().click();
    assert.deepEqual(await p.evaluate(() => window.spoken.at(-1)), { text: '아', lang: 'ko-KR', rate: 0.8 });
    assert.equal(await p.locator('#lesson-body .romanization').first().isVisible(), true);
    await p.evaluate(() => progressStore.updatePlatform(s => (s.settings.showRomanization = false)));
    assert.equal(await p.locator('#lesson-body .romanization').first().isVisible(), false);
    await p.getByRole('button', { name: 'Tiếp tục →', exact: true }).click();
    // Première réponse incorrecte, explanation persists, no duplicate submission.
    await p.locator('.exercise-choice').filter({ hasText: 'ㅓ' }).click();
    await p.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    assert.match(await p.locator('#exercise-feedback').innerText(), /Chưa đúng/);
    assert.match(await p.locator('#exercise-feedback').innerText(), /Đáp án: ㅏ/);
    const answered = await p.evaluate(() => Object.keys(state.platform.learning.session.answers).length);
    await p.getByRole('button', { name: '← Phần trước', exact: true }).click();
    assert.equal(await p.evaluate(() => state.platform.learning.session.currentSection), 1);
    await p.getByRole('button', { name: 'Tiếp tục →', exact: true }).click();
    assert.equal(await p.evaluate(() => Object.keys(state.platform.learning.session.answers).length), answered);
    await p.reload();
    await p.waitForFunction(() => tabAccess.writable() && !document.getElementById('lesson').hidden);
    assert.equal(await p.evaluate(() => Object.keys(state.platform.learning.session.answers).length), answered);
    async function completeUI(correct = true) {
      for (let guard = 0; guard < 180; guard++) {
        if (await p.evaluate(() => state.platform.learning.session.finished)) return;
        const info = await p.evaluate(() => {
          const s = state.platform.learning.session,
            l = LessonEngine.get(s.lessonId),
            section = l.sections[s.currentSection];
          return { section: section.type, e: section.exercises?.find(e => !s.answers[e.id]) };
        });
        const feedback = await p.locator('#exercise-feedback').count();
        if (feedback) {
          const next = p.getByRole('button', { name: 'Câu tiếp →', exact: true });
          if (await next.count()) {
            await next.click();
            continue;
          }
        }
        if (!feedback && info.e) {
          const e = info.e,
            answer = correct ? right(e) : wrong(e);
          assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          if (e.type === 'MATCH') {
            for (let i = 0; i < answer.length; i++) await p.locator('#match-' + i).selectOption(answer[i]);
          } else if (e.type === 'ORDER') {
            for (const i of answer) await p.locator('[data-token="' + i + '"]').click();
          } else if (['TYPING', 'FILL_BLANK'].includes(e.type)) await p.locator('#exercise-input').fill(answer);
          else
            await p
              .locator('.exercise-choice')
              .filter({ has: p.locator('input[value="' + answer + '"]') })
              .click();
          await p.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
          continue;
        }
        const label = info.section === 'QUIZ' ? 'Nộp quiz' : info.section === 'SUMMARY' ? 'Xem kết quả' : 'Tiếp tục →';
        await p.getByRole('button', { name: label, exact: true }).click();
      }
      throw Error('Lesson UI did not finish');
    }
    await completeUI();
    assert.match(await p.locator('#lesson-body').innerText(), /Bài hoàn thành/);
    assert.equal(await p.evaluate(() => state.platform.learning.results['h2-a-eo'].correct), 6);
    const score = await p.evaluate(() => state.score);
    await p.reload();
    await p.waitForFunction(() => tabAccess.writable());
    assert.equal(await p.evaluate(() => state.score), score);
    await p.locator('#lesson [data-route=roadmap]').click();
    assert.equal(await p.locator('[data-lesson=h2-o-u]').getAttribute('data-status'), 'available');
    await p.locator('[data-lesson=h2-a-eo]').click();
    assert.match(await p.locator('#lesson-body').innerText(), /Xem lại nội dung đã hoàn thành/);
    assert.equal(await p.evaluate(() => state.score), score);
    await p.evaluate(() => LessonUI.open('h2-o-u'));
    await completeUI(false);
    assert.match(await p.locator('#lesson-body').innerText(), /Ôn lại bài/);
    assert.equal(await p.evaluate(() => LessonEngine.status('h2-eu-i', state.platform.learning)), 'available');
    await p.getByRole('button', { name: 'Ôn lại và thử lần nữa', exact: true }).click();
    await p.emulateMedia({ colorScheme: 'dark' });
    await completeUI();
    for (const id of ['h2-eu-i', 'h2-vowels-check']) {
      await p.evaluate(id => LessonUI.open(id), id);
      await completeUI();
    }
    assert.equal(
      await p.evaluate(() => LessonEngine.unitProgress('h2-vowels', state.platform.learning).complete),
      true
    );
    assert.ok(await p.evaluate(() => state.platform.learning.checkpoints['h2-vowels-check'].completedAt));
    // Mở các bài còn lại bằng engine đã kiểm tra để thử UI của ORDER/FILL và Beginner.
    await p.evaluate(() => {
      for (const l of LESSON_CONTENT.lessons) {
        if (LessonEngine.status(l.id, state.platform.learning) === 'completed') continue;
        if (l.id === 'b2-identity-lesson') break;
        progressStore.learningAction({ type: 'start', lessonId: l.id });
        for (const s of l.sections) {
          for (const e of s.exercises || [])
            progressStore.learningAction({
              type: 'answer',
              exerciseId: e.id,
              value: e.type === 'MATCH' ? e.pairs.map(p => p.right) : e.correctAnswer,
              fallback: e.type === 'AUDIO_CHOICE'
            });
          progressStore.learningAction({ type: 'next', submitQuiz: s.type === 'QUIZ' });
        }
      }
      LessonUI.open('b2-identity-lesson');
    });
    await completeUI();
    assert.ok(await p.evaluate(() => state.learned.includes('word:학생')));
    assert.ok(await p.evaluate(() => state.platform.events.some(e => e.type === 'grammar_seen')));
    for (const theme of ['light', 'dark']) {
      await p.emulateMedia({ colorScheme: theme });
      await p.evaluate(() => LessonUI.open('b2-identity-lesson'));
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(
        await p
          .locator('button:visible')
          .evaluateAll(ns =>
            ns.every(n => n.getBoundingClientRect().width >= 44 && n.getBoundingClientRect().height >= 44)
          ),
        true
      );
    }
    await p.evaluate(() => LessonUI.open('s1-invite-lesson'));
    assert.match(await p.locator('#lesson-body').innerText(), /Sejong Korean 1A/);
    await p.getByRole('button', { name: 'Tiếp tục →', exact: true }).click();
    assert.equal(await p.locator('.memory-cue').count(), 1);
    assert.equal(await p.locator('.lesson-dialogue [lang=ko]').count(), 3);
    assert.equal(await p.locator('.recall-card details').getAttribute('open'), null);
    const recallScore = await p.evaluate(() => state.score);
    await p.locator('.recall-card summary').click();
    assert.equal(await p.locator('.recall-card [lang=ko]').isVisible(), true);
    assert.equal(await p.evaluate(() => state.score), recallScore);
    for (const theme of ['light', 'dark']) {
      await p.emulateMedia({ colorScheme: theme });
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    await completeUI();
    assert.ok(await p.evaluate(() => state.platform.learning.results['s1-invite-lesson'].completedAt));
    await p.reload();
    await p.waitForFunction(() => tabAccess.writable());
    assert.ok(await p.evaluate(() => state.platform.learning.results['s1-invite-lesson'].completedAt));
    // Dữ liệu học mới vẫn nằm trong envelope v1; chuyển tài khoản không mang phiên theo.
    const backup = await p.evaluate(() => progressStore.get());
    assert.equal(backup.version, 1);
    assert.ok(Buffer.byteLength(JSON.stringify(backup)) < 524288);
    await p.evaluate(() => progressStore.switchAccount('11111111-1111-4111-8111-111111111111'));
    await p.waitForFunction(() => tabAccess.writable());
    assert.equal(await p.evaluate(() => state.platform.learning.session), null);
    await p.evaluate(() => progressStore.switchAccount(null));
    await p.waitForFunction(() => tabAccess.writable());
    assert.ok(await p.evaluate(() => state.platform.learning.results['h2-a-eo'].completedAt));
    assert.deepEqual(errors, []);
    await context.close();
    const fallbackContext = await b.newContext({ viewport: { width: 360, height: 820 }, reducedMotion: 'reduce' });
    await fallbackContext.addInitScript(() => {
      Object.defineProperty(window, 'speechSynthesis', {
        value: { getVoices: () => [], addEventListener() {}, cancel() {} }
      });
    });
    const fp = await fallbackContext.newPage();
    await fp.goto(pathToFileURL(path.join(__dirname, '../index.html')).href);
    await fp.waitForFunction(() => tabAccess.writable());
    await fp.evaluate(() => {
      LessonUI.open('h2-a-eo');
      progressStore.learningAction({ type: 'next' });
      progressStore.learningAction({ type: 'next' });
      const l = LessonEngine.get('h2-a-eo');
      for (const e of l.sections[2].exercises)
        progressStore.learningAction({
          type: 'answer',
          exerciseId: e.id,
          value: e.type === 'MATCH' ? e.pairs.map(p => p.right) : e.correctAnswer
        });
      progressStore.learningAction({ type: 'next' });
      const e = l.sections[3].exercises[0];
      progressStore.learningAction({ type: 'answer', exerciseId: e.id, value: e.correctAnswer });
      LessonUI.render();
    });
    assert.match(await fp.locator('#lesson-body').innerText(), /Chế độ đọc/);
    await fp.locator('.exercise-choice').filter({ hasText: 'ㅏ' }).click();
    await fp.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    assert.equal(await fp.evaluate(() => state.platform.learning.session.answers['h2-a-eo-e4'].fallback), true);
    await fp.evaluate(() => {
      Storage.prototype.setItem = function () {
        throw Error('blocked');
      };
    });
    await fp.getByRole('button', { name: 'Tiếp tục →', exact: true }).click();
    assert.match(await fp.locator('#lesson-storage').innerText(), /Chưa lưu được/);
    await fallbackContext.close();
    console.log(
      'PASS Phase 2 browser: onboarding, free lesson choice, audio config, wrong feedback, resume, quiz/result, unit checkpoint, beginner grammar/order/fill, romanization, mobile themes, account isolation.'
    );
  } finally {
    await b.close();
  }
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
