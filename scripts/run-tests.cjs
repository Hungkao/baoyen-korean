// Chạy toàn bộ test: tự bật server phát triển, chạy lần lượt từng file, tắt server khi xong.
// Dùng: npm test            (tất cả)
//       npm run test:unit   (chỉ test không cần trình duyệt)
// Mặc định dùng Chromium của Playwright; đặt BROWSER_CHANNEL=msedge để chạy bằng Edge.
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const unitTests = [
  'tests/progress-unit.cjs',
  'tests/legacy-words.cjs',
  'tests/sejong-content.cjs',
  'tests/release.cjs'
];
const browserTests = [
  'tests/smoke.cjs',
  'tests/topics.cjs',
  'tests/foundation.cjs',
  'tests/learning.cjs',
  'tests/free-learning.cjs',
  'tests/account-pwa.cjs'
];
const onlyUnit = process.argv.includes('--unit');
const tests = onlyUnit ? unitTests : [...unitTests, ...browserTests];

// Mọi file test trong tests/ phải được liệt kê ở trên, tránh test bị bỏ quên khỏi CI.
const listed = new Set([...unitTests, ...browserTests]);
const missing = fs
  .readdirSync(path.join(root, 'tests'))
  .filter(name => name.endsWith('.cjs'))
  .map(name => 'tests/' + name)
  .filter(name => !listed.has(name));
if (missing.length) {
  console.error('Có file test chưa được thêm vào scripts/run-tests.cjs: ' + missing.join(', '));
  process.exit(1);
}

const port = Number(process.env.PORT || 4173);
const ping = () =>
  new Promise(resolve => {
    http
      .get({ host: '127.0.0.1', port, path: '/' }, res => {
        res.resume();
        resolve(res.statusCode === 200);
      })
      .on('error', () => resolve(false));
  });

(async () => {
  let server = null;
  if (!onlyUnit && !(await ping())) {
    server = spawn(process.execPath, ['scripts/serve.cjs'], { cwd: root, stdio: 'ignore' });
    for (let i = 0; i < 50 && !(await ping()); i++) await new Promise(r => setTimeout(r, 200));
    if (!(await ping())) {
      server.kill();
      console.error('Không bật được server phát triển ở cổng ' + port);
      process.exit(1);
    }
  }
  const failed = [];
  try {
    for (const test of tests) {
      console.log('\n▶ ' + test);
      const result = spawnSync(process.execPath, [test], { cwd: root, stdio: 'inherit' });
      if (result.status !== 0) failed.push(test);
    }
  } finally {
    if (server) server.kill();
  }
  if (failed.length) {
    console.error('\n✗ Thất bại: ' + failed.join(', '));
    process.exit(1);
  }
  console.log('\n✓ Đạt ' + tests.length + ' file test.');
})();
