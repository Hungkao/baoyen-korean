const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync, spawnSync } = require('node:child_process');
const vm = require('node:vm');
const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
for (const file of ['exercise-engine.js', 'lesson-content.js', 'lesson-engine.js'])
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx);
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
const oldResult = { correct: 18, quizCorrect: 14, pass: { at: '2026-10-04T10:00:00Z', correct: 18, quizCorrect: 14 } };
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
const assets = require('../scripts/runtime-assets.cjs');
const html = fs.readFileSync('index.html', 'utf8');
for (const [, src] of html.matchAll(/<script src="([^"?]+)(\?v=[0-9a-f]{10})?"/g)) assert.ok(assets.includes(src), src);
// JS/CSS phải có ?v= để CDN không trộn file cũ với HTML mới.
for (const [, src, v] of html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"?]+)(\?v=[0-9a-f]{10})?"/g))
  assert.ok(v, 'Thiếu ?v= cho ' + src);
assert.ok(!assets.some(p => p.startsWith('tests/') || p.endsWith('.sql') || p.endsWith('.py')));
for (const asset of assets) assert.ok(fs.existsSync(asset), asset);
const sw = fs.readFileSync('sw.js', 'utf8');
for (const asset of assets.filter(a => a !== 'sw.js'))
  assert.ok(new RegExp("'\\./" + asset.replace(/[.]/g, '\\.') + "(\\?v=[0-9a-f]{10})?'").test(sw), asset);
require('../scripts/sync-sw.cjs').syncSw({ check: true });
execFileSync(process.execPath, ['scripts/package-release.cjs']);
for (const asset of assets) assert.deepEqual(fs.readFileSync('dist/' + asset), fs.readFileSync(asset), asset);
const probe = 'dist/release-test-internal-' + process.pid + '.txt';
fs.writeFileSync(probe, 'Not a runtime asset', { flag: 'wx' });
try {
  assert.notEqual(
    spawnSync(process.execPath, ['scripts/package-release.cjs']).status,
    0,
    'Do not publish unexpected files'
  );
} finally {
  fs.unlinkSync(probe);
}
console.log('PASS release: contextual beginner quiz, 40-letter final coverage, runtime allowlist/cache consistency.');
