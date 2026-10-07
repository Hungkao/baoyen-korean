const assert = require('node:assert/strict');
const { APP_URL, loadModules, noServiceWorker } = require('./helpers/app.cjs');
const { chromium } = require('playwright');
(async () => {
  const ctx = await loadModules();
  const engine = ctx.PlatformEngine;
  assert.equal(engine.profile({ name: '', minutes: 20 }), null);
  assert.equal(
    engine.normalize({
      profile: { minutes: 999 },
      activity: { bad: 20, '2026-10-01': 999999 },
      settings: { showRomanization: false }
    }).profile,
    null
  );
  assert.equal(Object.keys(engine.normalize({ activity: { bad: 20, '2026-10-01': 999999 } }).activity).length, 0);
  const url = APP_URL;
  await (async () => {
    const b = await chromium.launch({
      headless: true,
      ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {})
    });
    try {
      const context = await b.newContext({
          ...noServiceWorker,
          viewport: { width: 360, height: 820 },
          reducedMotion: 'reduce'
        }),
        page = await context.newPage(),
        errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => __app.tabAccess.writable());
      assert.equal(await page.evaluate(() => __app.dailyPlan.length), 56);
      assert.equal(await page.evaluate(() => __app.platformCatalog.lessons.length), 56);
      assert.equal(await page.evaluate(() => new Set(__app.platformCatalog.lessons.map(l => l.id)).size), 56);
      // Bài nối thêm không được phân lại từ vào các bài cũ đã có tiến độ.
      assert.equal(
        await page.evaluate(() => {
          const old = __app.COURSE_CONTENT.lessonSeeds.slice(0, 53).map(([, type, indexes]) => ({
            type,
            items: indexes.map(
              i => (type === 'letter' ? __app.letters : type === 'word' ? __app.words : __app.syllableLessons)[i]
            )
          }));
          const included = new Set(old.filter(p => p.type === 'word').flatMap(p => p.items.map(w => w.ko)));
          for (const word of __app.words.slice(0, 120).filter(w => !included.has(w.ko)))
            old
              .slice(28)
              .filter(p => p.type === 'word')
              .sort((a, b) => a.items.length - b.items.length)[0]
              .items.push(word);
          return old.every(
            (p, i) => JSON.stringify(p.items.map(x => x.ko)) === JSON.stringify(__app.dailyPlan[i].items.map(x => x.ko))
          );
        }),
        true
      );
      const old = await page.evaluate(() => ({
        score: __app.state.score,
        learned: __app.state.learned,
        completedDays: __app.state.completedDays
      }));
      await page.getByRole('button', { name: 'Thiết lập mục tiêu →', exact: true }).click();
      await page.locator('#profile-name').fill('Bảo Yến');
      await page.locator('#profile-minutes').selectOption('20');
      await page.locator('#profile-goal').selectOption('topik');
      await page.locator('#profile-topik').selectOption('3');
      await page.locator('#onboarding-form button[type=submit]').click();
      assert.equal(await page.locator('#roadmap').isVisible(), true);
      assert.equal(await page.evaluate(() => __app.state.platform.profile.minutes), 20);
      assert.deepEqual(
        await page.evaluate(() => ({
          score: __app.state.score,
          learned: __app.state.learned,
          completedDays: __app.state.completedDays
        })),
        old
      );
      assert.equal(await page.locator('.roadmap-level').count(), 2);
      assert.equal(await page.locator('.roadmap-lesson:enabled').count(), 56);
      await page.locator('.legacy-library').evaluate(n => (n.open = true));
      await page
        .locator('.roadmap-level details')
        .first()
        .evaluate(n => (n.open = true));
      await page.locator('.roadmap-lesson:enabled').first().click();
      assert.equal(await page.evaluate(() => __app.state.completedDays.length), 0);
      await page.getByRole('button', { name: 'Mở bảng chữ cái', exact: true }).click();
      assert.equal(await page.locator('#alphabet').isVisible(), true);
      // Tiến độ từ phiên bản cũ tiếp tục được giữ, không phát sinh ngày học khi chỉ xem bài.
      assert.equal(await page.evaluate(() => __app.state.completedDays.length), 0);
      await page.evaluate(() => {
        __app.state.completedDays.push({ day: 1, date: __app.localDate() });
        __app.save();
      });
      await page.locator('[data-route=settings]').first().click();
      await page.locator('#show-romanization').uncheck();
      await page.reload();
      await page.waitForFunction(() => __app.tabAccess.writable());
      await page.waitForFunction(() => !document.getElementById('settings').hidden);
      assert.equal(await page.locator('#show-romanization').isChecked(), false);
      assert.equal(await page.evaluate(() => __app.state.platform.profile.topikGoal), '3');
      assert.equal(await page.evaluate(() => __app.state.completedDays.length), 1);
      await page.locator('[data-screen=vocabulary]').click();
      assert.equal(await page.locator('#word-roman').isVisible(), false);
      await page.evaluate(() => {
        __app.state.platform.activity[__app.localDate()] = 120;
        __app.save();
      });
      await page.locator('[data-screen=home]').click();
      assert.equal(await page.evaluate(() => __app.state.platform.activity[__app.localDate()]), 120);
      assert.doesNotMatch(
        await page.locator('#foundation-dashboard').innerText(),
        /Hôm nay em có thể|Buổi học hôm nay/
      );
      for (const theme of ['light', 'dark']) {
        await page.emulateMedia({ colorScheme: theme });
        for (const name of ['home', 'roadmap', 'onboarding', 'settings']) {
          await page.evaluate(name => __app.showScreen(name), name);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          assert.equal(
            await page
              .locator('button:visible')
              .evaluateAll(nodes =>
                nodes.every(n => n.getBoundingClientRect().width >= 44 && n.getBoundingClientRect().height >= 44)
              ),
            true
          );
        }
      }
      // Không có quyền lưu: không báo thành công hoặc rời form.
      const blocked = await b.newContext(noServiceWorker);
      await blocked.addInitScript(() => {
        Storage.prototype.setItem = function () {
          throw new Error('blocked');
        };
      });
      const bp = await blocked.newPage();
      await bp.goto(url);
      await bp.waitForFunction(() => __app.tabAccess.writable());
      await bp.evaluate(() => __app.showScreen('onboarding'));
      await bp.locator('#onboarding-form button[type=submit]').click();
      assert.equal(await bp.locator('#onboarding').isVisible(), true);
      assert.match(await bp.locator('#profile-feedback').innerText(), /Chưa lưu/);
      await blocked.close();
      assert.deepEqual(errors, []);
      console.log(
        'PASS: onboarding, catalog56, open roadmap, legacy reading, settings/hash persistence, preserved activity, 360px themes and storage failure.'
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
