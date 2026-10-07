const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const BASE = process.env.TEST_URL || 'http://127.0.0.1:4173';
const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
const progress = score => ({
  version: 1,
  progress: {
    score,
    streak: 0,
    learned: ['word:물'],
    wordIndex: 9,
    completedLessons: [],
    lessonIndex: 0,
    completedDays: [],
    daily: null,
    mistakes: []
  }
});

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {})
  });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' }),
      page = await context.newPage(),
      errors = [];
    const remote = new Map([
      [A, { revision: 1, payload: progress(30) }],
      [B, { revision: 1, payload: progress(7) }]
    ]);
    let refreshes = 0;
    page.on('pageerror', e => errors.push(e.message));
    // Mọi yêu cầu cloud đều giả lập; không gửi email thật.
    await context.route('https://*.supabase.co/**', async route => {
      const req = route.request(),
        url = new URL(req.url()),
        body = req.postDataJSON();
      const user = req.headers().authorization === 'Bearer access-b' ? B : A;
      let result = {};
      const auth = id => ({
        access_token: id === A ? 'access-a' : 'access-b',
        refresh_token: id === A ? 'refresh-a' : 'refresh-b',
        expires_in: 3600,
        user: { id, email: id === A ? 'a@example.test' : 'b@example.test' }
      });
      if (url.pathname.endsWith('/verify')) result = auth(body.email.startsWith('a@') ? A : B);
      else if (url.pathname.endsWith('/token')) {
        refreshes++;
        result = auth(body.refresh_token === 'refresh-b' ? B : A);
      } else if (url.pathname === '/rest/v1/learning_progress') {
        assert.equal(url.searchParams.get('user_id'), 'eq.' + user);
        result = [remote.get(user)];
      } else if (url.pathname.endsWith('/save_learning_progress')) {
        const row = remote.get(user);
        if (row.revision !== body.p_expected_revision) result = { ok: false, ...row };
        else {
          remote.set(user, { revision: row.revision + 1, payload: body.p_payload });
          result = { ok: true, revision: row.revision + 1 };
        }
      }
      await route.fulfill({ json: result });
    });
    await page.goto(BASE);
    await page.waitForFunction(() => !window.tabAccess || window.tabAccess.writable());
    await page.evaluate(() => {
      state.score = 10;
      save();
      updateStats();
    });
    await page.locator('#open-account').click();
    await page.locator('#settings [data-route=account]').click();
    async function login(email) {
      await page.waitForFunction(() => !window.tabAccess || window.tabAccess.writable());
      await page.locator('#account-email').fill(email);
      await page.locator('#email-form button').click();
      try {
        await page.locator('#code-form').waitFor({ state: 'visible' });
      } catch (error) {
        console.error(
          'Login diagnostic:',
          await page.evaluate(() => ({
            auth: document.getElementById('auth-message').textContent,
            emailValid: document.getElementById('account-email').validity.valid,
            emailHidden: document.getElementById('email-form').hidden,
            accountHidden: document.getElementById('account').hidden,
            ...accountState()
          }))
        );
        throw error;
      }
      await page.locator('#account-code').fill('123456');
      await page.locator('#code-form button[type=submit]').click();
      await page.waitForFunction(() => document.getElementById('sync-status').textContent.startsWith('Đã đồng bộ'));
    }
    await login('a@example.test');
    assert.equal(await page.locator('#score').textContent(), '30');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem(BASE_KEY)).score), 10);
    await page.evaluate(() => {
      state.score = 40;
      save();
      updateStats();
    });
    await page.waitForFunction(() => document.getElementById('sync-status').textContent.startsWith('Đã đồng bộ'));
    assert.equal(remote.get(A).payload.progress.score, 40);
    remote.set(A, { revision: 3, payload: progress(999) });
    await page.evaluate(() => {
      state.score = 50;
      save();
      updateStats();
    });
    await page.locator('#sync-conflict').waitFor({ state: 'visible' });
    assert.equal(remote.get(A).payload.progress.score, 999);
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#keep-cloud').click();
    assert.equal(await page.locator('#score').textContent(), '999');
    const savedSession = await page.evaluate(() => JSON.parse(localStorage.getItem('bao-yen-auth-v1')));
    assert.equal(savedSession.user.id, A);
    await page.evaluate(() =>
      progressStore.updatePlatform(p => {
        p.profile = {
          name: 'Bảo Yến',
          experience: 'new',
          hangul: 'no',
          goal: 'topik',
          topikGoal: '3',
          minutes: 20,
          horizonMonths: 12,
          completedAt: localDate()
        };
        p.settings.showRomanization = false;
      })
    );
    await page.waitForFunction(() => document.getElementById('sync-status').textContent.startsWith('Đã đồng bộ'));
    assert.equal(remote.get(A).payload.progress.platform.profile.minutes, 20);
    assert.equal(remote.get(A).payload.progress.platform.settings.showRomanization, false);
    await page.evaluate(() => {
      progressStore.learningAction({ type: 'start', lessonId: 'h2-a-eo' });
      progressStore.learningAction({ type: 'next' });
      progressStore.learningAction({ type: 'next' });
      progressStore.learningAction({ type: 'answer', exerciseId: 'h2-a-eo-e1', value: 'ㅏ' });
    });
    await page.waitForFunction(() => document.getElementById('sync-status').textContent.startsWith('Đã đồng bộ'));
    assert.equal(remote.get(A).payload.version, 1);
    assert.equal(remote.get(A).payload.progress.platform.learning.session.answers['h2-a-eo-e1'].value, 'ㅏ');
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('bao-yen-auth-v1'));
      s.expires_at = Math.floor(Date.now() / 1000) - 10;
      localStorage.setItem('bao-yen-auth-v1', JSON.stringify(s));
    });
    await page.reload();
    await page.locator('#open-account').click();
    await page.locator('#settings [data-route=account]').click();
    await page.waitForFunction(() => document.getElementById('sync-status').textContent.startsWith('Đã đồng bộ'));
    assert.equal(refreshes, 1);
    assert.equal(await page.evaluate(() => state.platform.profile.minutes), 20);
    assert.equal(await page.evaluate(() => state.platform.learning.session.currentSection), 2);
    const downloadEvent = page.waitForEvent('download');
    await page.locator('#export-progress').click();
    const download = await downloadEvent;
    const stream = await download.createReadStream();
    let contents = '';
    for await (const chunk of stream) contents += chunk;
    const backup = JSON.parse(contents);
    assert.equal(backup.progress.score, 999);
    assert.equal(contents.includes('access_token'), false);
    await page.locator('#sign-out').click();
    assert.equal(await page.locator('#score').textContent(), '10');
    await login('b@example.test');
    assert.equal(await page.locator('#score').textContent(), '7');
    assert.equal(await page.evaluate(() => state.platform.profile), null);
    assert.equal(await page.evaluate(() => state.platform.settings.showRomanization), true);
    assert.equal(await page.evaluate(() => state.platform.learning.session), null);
    assert.equal(await page.locator('#export-rescue').isVisible(), true); // B's empty pre-pull backup only.
    assert.equal(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem('bao-yen-rescue-v1:' + progressStore.key())).progress.score
      ),
      0
    );
    const oldScore = await page.locator('#score').textContent();
    await page
      .locator('#import-progress')
      .setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
    await page.waitForFunction(() =>
      document.getElementById('backup-message').textContent.startsWith('Chưa khôi phục')
    );
    assert.equal(await page.locator('#score').textContent(), oldScore);
    assert.deepEqual(errors, []);
    await context.close();

    const offlineContext = await browser.newContext(),
      offline = await offlineContext.newPage();
    await offline.goto(BASE);
    await offline.evaluate(() => navigator.serviceWorker.ready);
    await offline.reload();
    await offline.waitForFunction(() => !!navigator.serviceWorker.controller);
    await offlineContext.setOffline(true);
    await offline.reload();
    assert.equal(await offline.locator('h1').innerText(), 'Bảo Yến học tiếng Hàn');
    await offline.locator('[data-screen=alphabet]').click();
    await offline.locator('.letter').first().click();
    assert.equal(await offline.locator('#learned').textContent(), await offline.evaluate(() => '1/' + total));
    await offline.evaluate(() => LessonUI.open('h2-a-eo'));
    await offline.getByRole('button', { name: 'Tiếp tục →', exact: true }).click();
    await offline.getByRole('button', { name: 'Tiếp tục →', exact: true }).click();
    await offline.locator('.exercise-choice').filter({ hasText: 'ㅏ' }).click();
    await offline.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
    await offline.reload();
    await offline.waitForFunction(() => tabAccess.writable());
    assert.equal(await offline.evaluate(() => state.platform.learning.session.answers['h2-a-eo-e1'].value), 'ㅏ');
    assert.equal(await offline.locator('#lesson').isVisible(), true);
    const cached = await offline.evaluate(async () => {
      const all = [];
      for (const key of await caches.keys())
        for (const request of await (await caches.open(key)).keys()) all.push(request.url);
      return all;
    });
    assert.equal(
      cached.some(url => url.includes('supabase') || url.includes('token')),
      false
    );
    await offlineContext.close();
    const tabs = await browser.newContext({ serviceWorkers: 'block' });
    const first = await tabs.newPage();
    await first.goto(BASE);
    await first.waitForFunction(() => window.tabAccess?.writable());
    await first.evaluate(() => {
      state.score = 123;
      save();
    });
    const second = await tabs.newPage();
    await second.goto(BASE);
    await second.waitForFunction(() => document.querySelector('#tab-lock-message').textContent.includes('tab khác'));
    assert.equal(await second.evaluate(() => window.tabAccess.writable()), false);
    assert.equal(await second.evaluate(() => document.querySelector('main').inert), true);
    await first.close();
    await second.waitForFunction(() => window.tabAccess.writable());
    assert.equal(await second.locator('#score').textContent(), '123');
    await tabs.close();
    console.log(
      'PASS: mocked email sign-in, account isolation, refresh, sync, conflict, backup, invalid import, PWA offline shell. No live email sent.'
    );
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
