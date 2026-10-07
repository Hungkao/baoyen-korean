// Kiểm tra kho từ và buổi ôn theo chủ đề; Playwright chỉ dùng khi phát triển.
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const legacyWords = require('./legacy-words.cjs');
const url = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const topicsByLevel = {
  A1: ['chao_hoi', 'tinh_cam', 'gia_dinh', 'an_uong', 'do_vat', 'so_dem', 'noi_chon'],
  A2: ['nha_hang', 'giao_thong', 'mua_sam', 'thoi_tiet', 'hen_ho', 'sinh_hoat', 'suc_khoe'],
  B1: ['du_lich', 'cong_viec', 'giai_tri', 'tinh_cach', 'nau_an', 'doi_song'],
  B2: ['tam_su', 'kinh_ngu', 'quan_diem', 'xa_hoi']
};

async function openVocabulary(page, level = 'A2', topic = 'giao_thong') {
  await page.locator('[data-screen=vocabulary]').click();
  await page.locator('#level-filter').selectOption(level);
  await page.locator('#topic-select').selectOption(topic);
}

async function checkLayout(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Không tràn ngang ở 360px');
  const small = await page.locator('button:visible,select:visible').evaluateAll(nodes => nodes
    .filter(node => node.getBoundingClientRect().width < 44 || node.getBoundingClientRect().height < 44)
    .map(node => node.id || node.textContent));
  assert.deepEqual(small, [], 'Nút và bộ lọc cần vùng chạm 44px');
}

async function answerScopedQuestion(page, scope, correct) {
  const questionData = await page.evaluate(() => ({ id: question.id, item: question.item, answer: question.answer, field: question.field }));
  assert.ok(scope.some(word => 'word:' + word.ko === questionData.id), 'Câu hỏi phải thuộc chủ đề đã chọn');
  assert.ok(['meaning', 'ko'].includes(questionData.field));
  const choices = await page.locator('#answers .answer').allTextContents();
  assert.equal(choices.length, 4);
  assert.equal(new Set(choices).size, 4);
  assert.ok(choices.every(choice => scope.some(word => word[questionData.field] === choice)), 'Đáp án nhiễu phải cùng chủ đề');
  const answer = correct ? questionData.answer : choices.find(choice => choice !== questionData.answer);
  await page.getByRole('button', { name: answer, exact: true }).click();
  // Một câu đã trả lời không được nhận thêm điểm khi sự kiện được gọi lại.
  const score = await page.evaluate(() => state.score);
  await page.evaluate(() => answerQuestion(question.answer, document.querySelector('.answer')));
  assert.equal(await page.evaluate(() => state.score), score);
  await page.locator('#next-question').click();
  return questionData;
}

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 844 }, reducedMotion: 'reduce' });
    // Không cần mạng, đăng nhập hoặc gửi email thật để học từ file HTML.
    await context.route(/^https?:/, route => route.abort());
    await context.addInitScript(() => {
      window.testUtterances = [];
      Object.defineProperty(window, 'speechSynthesis', { value: {
        getVoices: () => [{ lang: 'ko-KR' }],
        addEventListener() {}, cancel() {},
        speak: utterance => window.testUtterances.push({ text: utterance.text, lang: utterance.lang, rate: utterance.rate })
      } });
      window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.waitForFunction(() => !window.tabAccess || window.tabAccess.writable());

    const vocabulary = await page.evaluate(() => words);
    assert.deepEqual(vocabulary.slice(0, legacyWords.length).map(word => word.ko), legacyWords.map(word => word.ko), 'Giữ nguyên các chỉ số từ cũ');
    assert.equal(new Set(vocabulary.map(word => word.ko)).size, vocabulary.length, 'Không trùng khóa tiến độ word:ko');
    assert.deepEqual([...new Set(vocabulary.map(word => word.topic))].sort(), Object.values(topicsByLevel).flat().sort());
    for (const [level, topics] of Object.entries(topicsByLevel)) {
      for (const topic of topics) {
        const items = vocabulary.filter(word => word.topic === topic);
        assert.ok(items.length >= 20, topic + ' cần ít nhất 20 mục');
        assert.ok(items.every(word => word.level === level), topic + ' phải giữ nhãn cấp độ nhất quán');
      }
    }
    for (const word of vocabulary) {
      for (const field of ['ko', 'roman', 'meaning', 'level', 'topic', 'exampleKo', 'exampleVi']) {
        assert.equal(typeof word[field], 'string', word.ko + ': thiếu ' + field);
        assert.ok(word[field].trim(), word.ko + ': ' + field + ' rỗng');
        assert.equal(word[field], word[field].normalize('NFC'), word.ko + ': lỗi dấu Unicode');
      }
      assert.match(word.exampleKo, /[가-힣]/u, 'Ví dụ phải có câu tiếng Hàn');
    }

    // Tiến độ phiên bản cũ vẫn đọc được trước khi học thêm từ mới.
    await page.evaluate(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ score: 70, streak: 2, learned: ['letter:ㅏ', 'word:물'], wordIndex: 119, mistakes: ['word:물'], completedDays: [], srs: {} }));
      } catch { throw new Error('Môi trường kiểm thử không cho lưu localStorage'); }
    });
    await page.reload();
    await page.waitForFunction(() => !window.tabAccess || window.tabAccess.writable());
    assert.deepEqual(await page.evaluate(() => ({ score: state.score, wordIndex: state.wordIndex, learned: state.learned, mistakes: state.mistakes })), {
      score: 70, wordIndex: 119, learned: ['letter:ㅏ', 'word:물'], mistakes: ['word:물']
    });

    // Mỗi cấp chỉ hiện chủ đề tương ứng; mọi thẻ và ví dụ đều thuộc bộ lọc.
    await page.locator('[data-screen=vocabulary]').click();
    for (const [level, topics] of Object.entries(topicsByLevel)) {
      await page.locator('#level-filter').selectOption(level);
      const options = await page.locator('#topic-select option').evaluateAll(nodes => nodes.map(node => node.value));
      assert.deepEqual(options.filter(value => value !== 'all').sort(), [...topics].sort());
      for (const topic of topics) {
        await page.locator('#topic-select').selectOption(topic);
        const ko = await page.locator('#word-ko').innerText();
        const item = vocabulary.find(word => word.ko === ko);
        assert.equal(item.topic, topic);
        assert.equal(item.level, level);
        await page.locator('#reveal-word').click();
        assert.equal(await page.locator('#word-meaning').innerText(), item.meaning);
        assert.equal(await page.locator('#word-example-ko').innerText(), item.exampleKo);
        assert.equal(await page.locator('#word-example-vi').innerText(), item.exampleVi);
        assert.equal(await page.locator('#word-ko').getAttribute('lang'), 'ko');
        assert.equal(await page.locator('#word-example-ko').getAttribute('lang'), 'ko');
        await checkLayout(page);
      }
    }
    await page.locator('#level-filter').selectOption('all');
    assert.equal(await page.locator('#topic-select option').count(), 25);
    await openVocabulary(page);
    const scope = vocabulary.filter(word => word.topic === 'giao_thong');
    const firstKo = await page.locator('#word-ko').innerText();
    assert.equal(await page.locator('#word-meaning').isVisible(), false, 'Ẩn nghĩa để gợi nhớ chủ động');
    await page.locator('#next-word').click();
    const nextKo = await page.locator('#word-ko').innerText();
    assert.ok(scope.some(word => word.ko === nextKo));
    await page.locator('#prev-word').click();
    assert.equal(await page.locator('#word-ko').innerText(), firstKo);
    await page.locator('#listen-word').click();
    await page.locator('#reveal-word').click();
    await page.locator('#listen-example').click();
    assert.deepEqual(await page.evaluate(() => window.testUtterances.slice(-2)), [
      { text: firstKo, lang: 'ko-KR', rate: 0.8 },
      { text: scope.find(word => word.ko === firstKo).exampleKo, lang: 'ko-KR', rate: 0.8 }
    ]);
    assert.equal(await page.evaluate(id => Boolean(state.srs[id]), 'word:' + firstKo), false, 'Xem thẻ không có nghĩa đã nhớ');
    await page.locator('#remember-word').click();
    const remembered = await page.evaluate(id => state.srs[id], 'word:' + firstKo);
    assert.equal(remembered.reps, 1);
    assert.equal(remembered.interval, 1);
    assert.ok(remembered.due > await page.evaluate(() => localDate()));
    await page.reload();
    await page.waitForFunction(() => !window.tabAccess || window.tabAccess.writable());
    assert.deepEqual(await page.evaluate(id => state.srs[id], 'word:' + firstKo), remembered);
    await openVocabulary(page);
    const againKo = await page.locator('#word-ko').innerText();
    await page.locator('#reveal-word').click();
    await page.locator('#again-word').click();
    assert.equal(await page.evaluate(id => state.srs[id].reps, 'word:' + againKo), 0);

    // Buổi luyện giới hạn 10 câu, có đáp án nhiễu cùng chủ đề và tổng kết chính xác.
    await page.locator('#practice-topic-btn').click();
    const scoreBefore = await page.evaluate(() => state.score);
    const asked = [];
    for (let index = 0; index < 10; index++) asked.push(await answerScopedQuestion(page, scope, index >= 2));
    assert.equal(new Set(asked.map(item => item.id)).size, 10, 'Không hỏi lặp trong một buổi');
    assert.equal(await page.locator('#session-summary').isVisible(), true);
    assert.match(await page.locator('#session-result').innerText(), /8\s*\/\s*10/);
    assert.equal(await page.evaluate(() => state.score), scoreBefore + 80);
    const mistakesText = await page.locator('#session-mistakes').innerText();
    assert.ok(asked.slice(0, 2).every(item => mistakesText.includes(item.item.ko)));
    for (const colorScheme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme });
      await checkLayout(page);
    }
    await page.locator('#repeat-topic').click();
    assert.equal(await page.locator('#session-summary').isVisible(), false);
    const repeatedKo = await page.evaluate(() => question.item.ko);
    assert.ok(scope.some(word => word.ko === repeatedKo));
    await page.locator('#free-practice').click();
    assert.equal(await page.evaluate(() => topicPracticeMode), null, 'Luyện tự do phải bỏ phạm vi buổi trước');
    assert.equal(await page.evaluate(() => dailyMode), false);
    await openVocabulary(page);
    await page.locator('#practice-topic-btn').click();
    await page.locator('[data-screen=home]').click();
    await page.locator('[data-study=syllables]').click();
    assert.equal(await page.evaluate(() => topicPracticeMode), null, 'Chọn phần học khác phải bỏ phạm vi lượt chủ đề');
    assert.equal(await page.evaluate(() => dailyMode), false);

    // Ôn chủ đề chỉ lấy mục đến hạn, không lấy từ ngoài chủ đề hoặc từ chưa đến hạn.
    await openVocabulary(page);
    const dueIds = scope.slice(0, 2).map(word => 'word:' + word.ko);
    await page.evaluate(({ dueIds, futureId, outsideId }) => {
      const due = localDate(), future = '2099-01-01';
      state.srs = {};
      for (const id of [...dueIds, outsideId]) state.srs[id] = { interval: 1, ease: 2.5, due, reps: 1, lastReviewed: dayBefore(due) };
      state.srs[futureId] = { interval: 6, ease: 2.5, due: future, reps: 2, lastReviewed: due };
      save(); renderWord();
    }, { dueIds, futureId: 'word:' + scope[2].ko, outsideId: 'word:' + vocabulary.find(word => word.topic !== 'giao_thong').ko });
    await page.locator('#review-topic-btn').click();
    const reviewed = [];
    for (let index = 0; index < dueIds.length; index++) reviewed.push((await answerScopedQuestion(page, scope, true)).id);
    assert.deepEqual(reviewed.sort(), [...dueIds].sort());
    assert.equal(await page.locator('#session-summary').isVisible(), true);
    assert.match(await page.locator('#session-result').innerText(), /2\s*\/\s*2/);
    await page.locator('#back-vocab').click();
    if (!await page.locator('#review-topic-btn').isDisabled()) {
      await page.locator('#review-topic-btn').click();
      assert.equal(await page.locator('#vocabulary').isVisible(), true, 'Không tạo câu hỏi giả khi chưa có mục đến hạn');
      assert.ok(await page.locator('#topic-action-message').innerText(), 'Giải thích thân thiện khi chưa có từ đến hạn');
    } else {
      assert.match(await page.locator('#review-topic-btn').innerText(), /0/);
    }
    for (const colorScheme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme });
      await checkLayout(page);
    }
    assert.deepEqual(errors, []);
    // File HTML vẫn học được khi trình duyệt không có Web Locks.
    const fallbackContext=await browser.newContext();
    await fallbackContext.addInitScript(()=>Object.defineProperty(navigator,'locks',{value:undefined}));
    const fallback=await fallbackContext.newPage();fallback.on('pageerror',error=>errors.push(error.message));
    await fallback.goto(url);await fallback.waitForFunction(()=>window.tabAccess?.writable());
    await fallback.locator('[data-screen=vocabulary]').click();
    await fallback.locator('#level-filter').selectOption('B2');await fallback.locator('#topic-select').selectOption('kinh_ngu');
    await fallback.locator('#practice-topic-btn').click();
    await fallback.getByRole('button',{name:await fallback.evaluate(()=>question.answer),exact:true}).click();
    assert.equal(await fallback.locator('#score').textContent(),'10');await fallbackContext.close();
    assert.deepEqual(errors, []);
    console.log('PASS: indexed migration, 24 topic schemas, filters, examples, scoped audio, recall persistence, finite sessions, due-only review, layout and scope reset.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
