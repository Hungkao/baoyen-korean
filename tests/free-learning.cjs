const assert = require('node:assert/strict');
const { APP_URL, loadModules, noServiceWorker } = require('./helpers/app.cjs');
const { chromium } = require('playwright');
(async () => {
  const ctx = await loadModules();
  const { LESSON_CONTENT: C, LessonEngine: E, PlatformEngine: P } = ctx;
  assert.ok(C.lessons.every(l => E.status(l.id, E.empty()) === 'available'));
  assert.equal(P.lessonStatus({ day: 56 }, { completedDays: [] }, '2026-10-06'), 'available');
  assert.equal(
    P.lessonStatus({ day: 56 }, { completedDays: [{ day: 1, date: '2026-10-06' }] }, '2026-10-06'),
    'available'
  );
  assert.ok(!E.transition(E.empty(), { type: 'start', lessonId: 'b2-countries-lesson' }).error);
  assert.ok(E.transition(E.empty(), { type: 'start', lessonId: 'unknown' }).error);
  await (async () => {
    const b = await chromium.launch({
      headless: true,
      ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {})
    });
    try {
      const p = await b.newPage({ ...noServiceWorker, viewport: { width: 360, height: 820 }, reducedMotion: 'reduce' }),
        errors = [];
      p.on('pageerror', e => errors.push(e.message));
      await p.goto(APP_URL);
      await p.waitForFunction(() => __app.tabAccess.writable());
      assert.equal(await p.locator('.legacy-daily').isVisible(), false);
      assert.doesNotMatch(await p.locator('#home').innerText(), /Buổi học hôm nay|Hôm nay em có thể|phút\/ngày/);
      for (const name of ['alphabet', 'syllables', 'vocabulary', 'practice']) {
        if (name === 'syllables') {
          await p.locator('[data-screen=alphabet]').click();
          await p.locator('#alphabet [data-subscreen=syllables]').click();
        } else await p.locator('[data-screen=' + name + ']').click();
        assert.equal(await p.locator('#' + name).isVisible(), true);
        await p.locator('[data-screen=home]').click();
      }
      await p.locator('[data-study=roadmap]').click();
      assert.equal(await p.locator('.core-lesson[data-status=locked]').count(), 0);
      assert.equal(await p.locator('.roadmap-lesson:disabled').count(), 0);
      await p.locator('[data-unit=b2-countries] summary').click();
      await p.locator('[data-lesson=b2-countries-lesson]').click();
      assert.equal(await p.evaluate(() => __app.state.platform.learning.session.lessonId), 'b2-countries-lesson');
      await p.reload();
      await p.waitForFunction(() => __app.tabAccess.writable() && !document.getElementById('lesson').hidden);
      assert.equal(await p.evaluate(() => __app.state.platform.learning.session.lessonId), 'b2-countries-lesson');
      await p.locator('#lesson [data-route=roadmap]').click();
      p.once('dialog', d => d.dismiss());
      await p.locator('[data-lesson=h2-a-eo]').click();
      assert.equal(await p.evaluate(() => __app.state.platform.learning.session.lessonId), 'b2-countries-lesson');
      p.once('dialog', d => d.accept());
      await p.locator('[data-lesson=h2-a-eo]').click();
      assert.equal(await p.evaluate(() => __app.state.platform.learning.session.lessonId), 'h2-a-eo');
      assert.equal(await p.evaluate(() => __app.state.completedDays.length), 0);
      // Đang học thì thanh dưới ẩn; thoát bài bằng nút ✕ rồi mới về trang Học.
      assert.equal(await p.locator('nav').isVisible(), false);
      await p.locator('#lesson [data-route=roadmap]').click();
      await p.locator('[data-screen=home]').click();
      for (const theme of ['light', 'dark']) {
        await p.emulateMedia({ colorScheme: theme });
        for (const screen of ['home', 'roadmap']) {
          await p.evaluate(name => __app.showScreen(name), screen);
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
      }
      assert.deepEqual(errors, []);
      console.log(
        'PASS free learning: choose every section, arbitrary lessons, no locks, resume/switch, 360px themes.'
      );
    } finally {
      await b.close();
    }
  })().catch(e => {
    console.error(e);
    process.exitCode = 1;
  });
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
