// Kiểm tra trước khi phát hành: nội dung quiz hợp ngữ cảnh và bản build chỉ chứa đúng file runtime.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadModules } = require('./helpers/app.cjs');

const root = path.resolve(__dirname, '..');
(async () => {
  const ctx = await loadModules();
  const C = ctx.LESSON_CONTENT;
  const countries = C.lessons.find(l => l.id === 'b2-countries-lesson');
  assert.ok(
    countries.sections
      .flatMap(s => s.exercises || [])
      .every(e => !e.prompt.includes('학생') && !e.prompt.includes('học sinh'))
  );
  for (const lesson of C.lessons.filter(l => l.unitId.startsWith('b2-') && l.type === 'lesson')) {
    const practice = lesson.sections.filter(s => s.type === 'EXERCISE').flatMap(s => s.exercises);
    const quiz = lesson.sections.find(s => s.type === 'QUIZ').exercises;
    assert.ok(
      quiz.every(q => !practice.some(p => p.prompt === q.prompt)),
      lesson.id
    );
  }
  const final = C.lessons.find(l => l.id === 'h2-assessment-check');
  const quiz = final.sections.find(s => s.type === 'QUIZ').exercises;
  assert.equal(new Set(quiz.flatMap(e => e.letterIds || [])).size, 40);
  assert.ok(['MATCH', 'AUDIO_CHOICE', 'TYPING'].every(t => quiz.some(e => e.type === t)));
  // Snapshot đạt cũ vẫn mở khóa; câu mới không dùng lại đáp án cũ.
  const oldResult = {
    correct: 18,
    quizCorrect: 14,
    pass: { at: '2026-10-04T10:00:00Z', correct: 18, quizCorrect: 14 }
  };
  const migrated = ctx.LessonEngine.normalize({ results: { 'h2-assessment-check': oldResult } });
  assert.ok(migrated.results['h2-assessment-check'].completedAt);
  assert.ok(countries.sections.flatMap(s => s.exercises || []).every(e => e.id.endsWith('-r2')));
  const previousLesson = C.lessons.find(l => l.id === 'b2-greetings-lesson');
  const legacy = {
    results: {
      [previousLesson.id]: {
        correct: 7,
        quizCorrect: 3,
        pass: { at: '2026-10-04T10:00:00Z', correct: 7, quizCorrect: 3 }
      }
    },
    session: {
      lessonId: previousLesson.id,
      contentVersion: 1,
      startedAt: '2026-10-04T10:00:00Z',
      currentSection: previousLesson.sections.length - 1,
      visited: previousLesson.sections.map(s => s.id),
      answers: {},
      quizSubmitted: true,
      finished: true
    }
  };
  assert.equal(
    ctx.LessonEngine.normalize(legacy).session,
    null,
    'Finished old session must not become an unfinished lesson after content revision'
  );

  // Bản build: chạy vite build rồi kiểm tra dist/.
  const { build } = await import('vite');
  await build({ root, logLevel: 'error' });
  const dist = path.join(root, 'dist');
  const files = fs
    .readdirSync(dist, { recursive: true })
    .map(name => name.split(path.sep).join('/'))
    .filter(name => fs.statSync(path.join(dist, name)).isFile())
    .sort();
  // Chỉ file giao diện; không có test, script, SQL, tài liệu nội bộ hay biến môi trường.
  const allowed = /^(index\.html|sw\.js|manifest\.webmanifest|icons\/[\w.-]+\.(png|svg)|assets\/[\w.-]+\.(js|css))$/;
  for (const name of files) assert.match(name, allowed, 'File không được phát hành: ' + name);
  for (const required of ['index.html', 'sw.js', 'manifest.webmanifest', 'icons/icon-192.png'])
    assert.ok(files.includes(required), required);
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  assert.ok(!html.includes('/src/'), 'index.html phải trỏ tới bản build, không phải src/');
  for (const [, ref] of html.matchAll(/(?:src|href)="\.\/([^"#?]+)"/g))
    assert.ok(files.includes(ref), 'index.html trỏ tới file không có trong dist: ' + ref);
  // Service worker cache đúng toàn bộ file đã phát hành, tên cache đổi theo nội dung.
  const sw = fs.readFileSync(path.join(dist, 'sw.js'), 'utf8');
  assert.match(sw, /^const CACHE = 'bao-yen-shell-[0-9a-f]{10}';$/m);
  const cached = [...sw.match(/^const ASSETS = \[(.*)\];$/m)[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
  assert.deepEqual(
    cached,
    ['./', ...files.filter(name => name !== 'sw.js').map(name => './' + name)],
    'Danh sách cache trong sw.js phải khớp dist'
  );
  // Frontend chỉ được chứa publishable/anon key.
  const env = fs
    .readFileSync(path.join(root, '.env'), 'utf8')
    .split('\n')
    .filter(line => !line.startsWith('#'))
    .join('\n');
  assert.ok(!/sb_secret_|service_role/i.test(env), '.env chỉ được chứa khóa công khai');
  for (const name of files.filter(n => n.endsWith('.js')))
    assert.ok(!/sb_secret_[\w-]{8,}/.test(fs.readFileSync(path.join(dist, name), 'utf8')), name);
  console.log(
    'PASS release: contextual beginner quiz, 40-letter final coverage, build output allowlist and cache list.'
  );
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
