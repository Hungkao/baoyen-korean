// Tiện ích dùng chung cho test.
// - APP_URL: bản build đang chạy bằng `vite preview` (scripts/run-tests.cjs tự bật).
// - noServiceWorker: chặn service worker để mỗi lần tải lấy đúng bản build; chỉ account-pwa kiểm PWA.
// - loadModules(): nạp module thuần (nội dung, engine) trực tiếp trong Node, không cần trình duyệt.
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_URL = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const noServiceWorker = { serviceWorkers: 'block' };
const src = file => pathToFileURL(path.join(__dirname, '../../src', file)).href;

async function loadModules() {
  const [course, lessons, vocabBasic, vocabIntermediate, exercise, lesson, platform, srs, schema, catalog] =
    await Promise.all(
      [
        'content/course.js',
        'content/lessons.js',
        'content/vocabulary-basic.js',
        'content/vocabulary-intermediate.js',
        'domain/exercise-engine.js',
        'domain/lesson-engine.js',
        'domain/platform-engine.js',
        'domain/srs.js',
        'domain/progress-schema.js',
        'content/catalog.js'
      ].map(file => import(src(file)))
    );
  return {
    ...course,
    ...lessons,
    ...vocabBasic,
    ...vocabIntermediate,
    ...exercise,
    ...lesson,
    ...platform,
    ...srs,
    ...schema,
    ...catalog
  };
}

module.exports = { APP_URL, noServiceWorker, loadModules };
