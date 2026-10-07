// Một bài kiểm tra đầu-cuối; Playwright chỉ dùng khi phát triển.
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const url = pathToFileURL(path.resolve(__dirname, '../index.html')).href;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {})
  });
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    assert.equal(await page.locator('.letter').count(), 40);
    for (const width of [360, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      for (const colorScheme of ['light', 'dark']) {
        await page.emulateMedia({ colorScheme });
        for (const screen of ['home', 'alphabet', 'syllables', 'vocabulary', 'practice']) {
          await page.locator(`[data-screen=${screen}]`).click();
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          assert.equal(
            await page
              .locator('button:visible')
              .evaluateAll(nodes =>
                nodes.every(n => n.getBoundingClientRect().height >= 44 && n.getBoundingClientRect().width >= 44)
              ),
            true
          );
        }
      }
    }
    // Một mục chỉ được tính là đã học một lần.
    await page.locator('[data-screen=alphabet]').click();
    await page.locator('.letter').first().click();
    const learned = await page.locator('#learned').textContent();
    await page.locator('.letter').first().click();
    assert.equal(await page.locator('#learned').textContent(), learned);
    if (await page.evaluate(() => !koreanVoice)) assert.ok(await page.locator('#speech-notice').innerText());
    await page.locator('[data-screen=vocabulary]').click();
    const word = await page.locator('#word-ko').innerText();
    for (let i = 0; i < (await page.evaluate(() => words.length)); i++) await page.locator('#next-word').click();
    assert.equal(await page.locator('#word-ko').innerText(), word);
    await page.locator('[data-screen=practice]').click();
    for (let i = 0; i < 25; i++) {
      assert.equal(await page.locator('.answer').count(), 4);
      const answers = await page.locator('.answer').allTextContents();
      assert.equal(new Set(answers).size, 4);
      await page.locator('#answers button').first().focus();
      await page.evaluate(() => newQuestion());
    }
    const right = await page.evaluate(() => question.answer);
    await page.getByRole('button', { name: right, exact: true }).click();
    await page.evaluate(() => answerQuestion(question.answer, document.querySelector('.answer')));
    assert.equal(await page.locator('#score').textContent(), '10');
    assert.equal(await page.locator('#streak').textContent(), '1');
    await page.locator('#next-question').click();
    const wrong = await page.evaluate(
      () => [...document.querySelectorAll('.answer')].find(n => n.textContent !== question.answer).textContent
    );
    await page.getByRole('button', { name: wrong, exact: true }).click();
    assert.equal(await page.locator('#streak').textContent(), '0');
    await page.waitForFunction(() => document.getElementById('feedback').textContent === '', null, { timeout: 5000 });
    assert.equal(
      await page
        .locator('#answers button')
        .first()
        .evaluate(n => n === document.activeElement),
      true
    );
    await page.reload();
    assert.equal(await page.locator('#score').textContent(), '10');
    assert.equal(
      await page.locator('#learned').textContent(),
      await page.evaluate(() => words.length + 1 + '/' + total)
    );
    // Lỗi dữ liệu không được làm app ngừng hoạt động.
    await page.evaluate(() => localStorage.setItem(KEY, '{broken'));
    await page.reload();
    assert.ok(await page.locator('#storage-notice').innerText());
    assert.equal(await page.locator('#score').textContent(), '0');
    // Dữ liệu phiên bản cũ không có trường bài ghép âm vẫn giữ tiến độ.
    await page.evaluate(() =>
      localStorage.setItem(
        KEY,
        JSON.stringify({ score: 70, streak: 2, learned: ['letter:ㅏ', 'word:물'], wordIndex: 9 })
      )
    );
    await page.reload();
    assert.equal(await page.locator('#score').textContent(), '70');
    assert.equal(await page.locator('#learned').textContent(), await page.evaluate(() => '2/' + total));
    await page.locator('[data-screen=syllables]').click();
    assert.deepEqual(
      await page.evaluate(() => [
        composeSyllable('ㄱ', 'ㅏ'),
        composeSyllable('ㅇ', 'ㅏ'),
        composeSyllable('ㅎ', 'ㅏ', 'ㄴ'),
        composeSyllable('ㅁ', 'ㅜ', 'ㄹ'),
        composeSyllable('ㅂ', 'ㅏ', 'ㅂ'),
        composeSyllable('x', 'ㅏ')
      ]),
      ['가', '아', '한', '물', '밥', '']
    );
    await page.locator('#initial-select').selectOption('ㅁ');
    await page.locator('#vowel-select').selectOption('ㅜ');
    await page.locator('#final-select').selectOption('ㄹ');
    assert.equal(await page.locator('#syllable-result').innerText(), '물');
    await page.locator('#listen-syllable').click();
    for (let i = 0; i < 6; i++) await page.locator('#complete-lesson').click();
    assert.equal(await page.locator('#lesson-progress').innerText(), '6 / 6 ví dụ đã đọc');
    await page.locator('#complete-lesson').click();
    assert.equal(await page.locator('#lesson-progress').innerText(), '6 / 6 ví dụ đã đọc');
    await page.reload();
    await page.locator('[data-screen=syllables]').click();
    assert.equal(await page.locator('#lesson-progress').innerText(), '6 / 6 ví dụ đã đọc');
    assert.equal(await page.locator('#score').textContent(), '70');
    assert.equal(await page.locator('#learned').textContent(), await page.evaluate(() => '2/' + total));
    await page.evaluate(() =>
      localStorage.setItem(
        KEY,
        JSON.stringify({ score: -10, streak: 'bad', learned: ['letter:ㅏ', 'letter:ㅏ', 'unknown'], wordIndex: 999 })
      )
    );
    await page.reload();
    assert.equal(await page.locator('#learned').textContent(), await page.evaluate(() => '1/' + total));
    assert.equal(await page.locator('#score').textContent(), '0');
    const blockedContext = await browser.newContext();
    const blocked = await blockedContext.newPage();
    blocked.on('pageerror', error => errors.push(error.message));
    await blocked.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked');
        }
      });
    });
    await blocked.goto(url);
    await blocked.locator('[data-screen=alphabet]').click();
    await blocked.locator('.letter').first().click();
    assert.ok((await blocked.locator('#storage-notice').innerText()).includes('chặn'));
    assert.equal(await blocked.locator('#learned').textContent(), await page.evaluate(() => '1/' + total));
    // Giọng tải chậm: sau voiceschanged, bấm nghe phải dùng ko-KR/0.8.
    const voiceContext = await browser.newContext();
    const voicePage = await voiceContext.newPage();
    voicePage.on('pageerror', error => errors.push(error.message));
    await voicePage.addInitScript(() => {
      window.testVoiceReady = false;
      window.testUtterances = [];
      window.testVoiceListener = null;
      window.testCancels = 0;
      window.testResumes = 0;
      Object.defineProperty(window, 'speechSynthesis', {
        value: {
          speaking: false,
          pending: false,
          paused: false,
          getVoices: () => (window.testVoiceReady ? [{ lang: 'ko-KR' }] : []),
          addEventListener: (name, listener) => {
            window.testVoiceListener = listener;
          },
          cancel() {
            window.testCancels++;
          },
          resume() {
            window.testResumes++;
            this.paused = false;
          },
          speak: utterance => window.testUtterances.push(utterance)
        }
      });
      window.SpeechSynthesisUtterance = class {
        constructor(text) {
          this.text = text;
        }
      };
    });
    await voicePage.goto(url);
    await voicePage.locator('[data-screen=alphabet]').click();
    await voicePage.locator('.letter').first().click();
    assert.ok(await voicePage.locator('#speech-notice').innerText());
    await voicePage.evaluate(() => {
      window.testVoiceReady = true;
      window.testVoiceListener();
    });
    await voicePage.locator('[data-screen=vocabulary]').click();
    await voicePage.locator('#listen-word').click();
    assert.deepEqual(await voicePage.evaluate(() => window.testUtterances.map(x => ({ lang: x.lang, rate: x.rate }))), [
      { lang: 'ko-KR', rate: 0.8 }
    ]);
    assert.equal(await voicePage.locator('#speech-notice').innerText(), '');
    await voicePage.locator('[data-screen=syllables]').click();
    await voicePage.locator('#initial-select').selectOption('ㅂ');
    await voicePage.locator('#vowel-select').selectOption('ㅏ');
    await voicePage.locator('#final-select').selectOption('ㅂ');
    await voicePage.locator('#listen-syllable').click();
    assert.equal(await voicePage.evaluate(() => window.testUtterances.at(-1).text), '밥');
    assert.equal(await voicePage.evaluate(() => window.testCancels), 0, 'Không reset bộ đọc khi rảnh');
    for (const flag of ['speaking', 'pending']) {
      await voicePage.evaluate(flag => {
        speechSynthesis[flag] = true;
        speak('아');
        speechSynthesis[flag] = false;
      }, flag);
    }
    assert.equal(await voicePage.evaluate(() => window.testCancels), 2, 'Hủy câu đang đọc hoặc chờ khi nghe câu khác');
    await voicePage.evaluate(() => {
      speechSynthesis.paused = true;
      speak('아');
    });
    assert.equal(await voicePage.evaluate(() => window.testResumes), 1, 'Tiếp tục bộ đọc đang tạm dừng');
    // Lộ trình 56 ngày cũ: giữ dữ liệu và cách phân từ, không còn giao diện bài hằng ngày.
    const legacyContext = await browser.newContext({ viewport: { width: 390, height: 950 }, reducedMotion: 'reduce' });
    const legacyPage = await legacyContext.newPage();
    legacyPage.on('pageerror', e => errors.push(e.message));
    await legacyPage.addInitScript(() => {
      if (!sessionStorage.getItem('seeded')) {
        sessionStorage.setItem('seeded', '1');
        localStorage.setItem(
          'hangul-little-steps-v1',
          JSON.stringify({ completedDays: [{ day: 1, date: '2026-10-01' }], learned: ['word:물'], score: 20 })
        );
      }
    });
    await legacyPage.goto(url);
    assert.ok(await legacyPage.evaluate(() => words.length >= 480));
    assert.equal(
      await legacyPage.evaluate(
        () => new Set(dailyPlan.filter(p => p.type === 'word').flatMap(p => p.items.map(x => x.ko))).size
      ),
      120
    );
    assert.equal(await legacyPage.locator('#home').isVisible(), true);
    assert.equal(await legacyPage.locator('#start-daily').count(), 0, 'Không còn nút bài hằng ngày');
    assert.deepEqual(await legacyPage.evaluate(() => state.completedDays), [{ day: 1, date: '2026-10-01' }]);
    assert.equal(await legacyPage.evaluate(() => activeDay()), 2);
    // Lưu lại không làm mất ngày đã hoàn thành.
    await legacyPage.evaluate(() => save());
    await legacyPage.reload();
    assert.deepEqual(await legacyPage.evaluate(() => state.completedDays), [{ day: 1, date: '2026-10-01' }]);
    await legacyPage.evaluate(() => localStorage.clear());
    await legacyPage.reload();
    await legacyPage.evaluate(() => window.scrollTo(0, 0));
    await legacyPage.screenshot({ path: path.resolve(__dirname, '../preview-bao-yen.png') });
    await legacyPage.emulateMedia({ colorScheme: 'dark' });
    await legacyPage.screenshot({ path: path.resolve(__dirname, '../preview-bao-yen-dark.png') });
    await legacyContext.close();
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 360, height: 780 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.locator('[data-screen=syllables]').click();
    await page.screenshot({ path: path.resolve(__dirname, '../preview-mobile.png'), fullPage: true });
    const srsCheck = await page.evaluate(() => {
      const id = 'word:물';
      state.srs = {};
      updateSRS(id, true);
      const first = state.srs[id].interval;
      updateSRS(id, true);
      const repeated = state.srs[id].interval;
      state.srs[id].lastReviewed = dayBefore(localDate());
      updateSRS(id, true);
      const second = state.srs[id].interval;
      updateSRS(id, false);
      return { first, repeated, second, failed: state.srs[id].interval, empty: normalizeProgress(null).srs };
    });
    assert.deepEqual(srsCheck, { first: 1, repeated: 1, second: 6, failed: 1, empty: {} });
    console.log(
      'PASS: 40 letters, expanded vocabulary, preserved 120-word/56-day plan, SRS intervals, migration, legacy day progress, layout, storage and speech.'
    );
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
