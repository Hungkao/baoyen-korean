// Kiểm tra thuần (không cần trình duyệt) cho lịch ôn và chuẩn hóa tiến độ.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
for (const file of [
  'course-content.js',
  'platform-engine.js',
  'vocabulary-basic.js',
  'vocabulary-intermediate.js',
  'core-data.js',
  'srs.js',
  'progress-store.js'
])
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file });
// Đưa kết quả về realm hiện tại để so sánh deepEqual.
const plain = value => JSON.parse(JSON.stringify(value));
const run = code => vm.runInContext(code, ctx);
const SRS = run('SRS');
const normalizeProgress = (saved, today) => plain(run('normalizeProgress')(saved, today));

// Lịch ôn: 1 ngày, 6 ngày, rồi nhân hệ số; sai về 1 ngày; đúng lần hai trong ngày không đổi.
const next = (...args) => plain(SRS.next(...args));
let e = next(undefined, true, '2026-10-01');
assert.deepEqual([e.interval, e.due, e.reps], [1, '2026-10-02', 1]);
assert.equal(SRS.next(e, true, '2026-10-01'), null);
e = next(e, true, '2026-10-02');
assert.deepEqual([e.interval, e.due], [6, '2026-10-08']);
e = next(e, true, '2026-10-08');
assert.equal(e.interval, 15);
const wrong = next(e, false, '2026-10-08');
assert.deepEqual([wrong.interval, wrong.reps, wrong.due], [1, 0, '2026-10-09']);
const original = run("({ interval: 6, ease: 2.5, due: '2026-10-08', reps: 2 })");
const snapshot = JSON.stringify(original);
SRS.next(original, false, '2026-10-08');
assert.equal(JSON.stringify(original), snapshot, 'SRS.next không sửa mục cũ');
assert.equal(next({ interval: 300, ease: 2.5, reps: 5, due: '2026-01-01' }, true, '2026-10-01').interval, 365);

// Chuẩn hóa: bỏ ID lạ, giữ ngày hợp lệ theo thứ tự, không cho ngày tương lai.
const p = normalizeProgress(
  {
    score: 30,
    learned: ['word:물', 'word:khong-co', 'letter:ㅏ'],
    mistakes: ['word:물', 'x'],
    completedDays: [
      { day: 1, date: '2026-10-01' },
      { day: 2, date: '2026-10-01' },
      { day: 2, date: '2026-10-03' },
      { day: 3, date: '2026-12-01' }
    ],
    srs: { 'word:물': { interval: 999, ease: 9, due: '2026-10-05', reps: 2 }, bad: { interval: 1, ease: 2, due: 'x' } }
  },
  '2026-10-07'
);
assert.equal(p.score, 30);
assert.deepEqual(p.learned, ['word:물', 'letter:ㅏ']);
assert.deepEqual(p.mistakes, ['word:물']);
assert.deepEqual(p.completedDays, [
  { day: 1, date: '2026-10-01' },
  { day: 2, date: '2026-10-03' }
]);
assert.deepEqual(Object.keys(p.srs), ['word:물']);
assert.equal(p.srs['word:물'].interval, 365);
assert.equal(p.srs['word:물'].ease, 2.5);
assert.equal(run('activeDayOf')(p, '2026-10-07'), 3);
assert.equal(run('activeDayOf')(p, '2026-10-03'), 2);
for (const bad of [null, [], 'x', 42])
  assert.deepEqual(normalizeProgress(bad, '2026-10-07'), plain(run('emptyProgress()')));
console.log('PASS progress unit: SRS intervals, same-day guard, normalize IDs/days/SRS bounds, pure functions.');
