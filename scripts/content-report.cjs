const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');

(async () => {
  const { LESSON_CONTENT: C } = await import(pathToFileURL(path.join(root, 'src/content/lessons.js')).href);
  const rows = [
    '# Ma trận nội dung hiện có',
    '',
    'Tạo bằng `node scripts/content-report.cjs`. Đây là danh mục để thẩm định, không phải xác nhận chất lượng tiếng Hàn.',
    '',
    '| Bài | Mục tiêu | Từ / ngữ pháp | Quiz | Trạng thái |',
    '|---|---|---|---|---|'
  ];
  const cell = value => String(value).replaceAll('|', '/').replaceAll('\n', ' ');
  for (const l of C.lessons) {
    const quiz = l.sections.find(s => s.type === 'QUIZ').exercises;
    rows.push(
      '| ' +
        [
          l.id + ' · ' + l.title,
          l.objectives.join(' '),
          l.vocabularyIds.length + ' / ' + l.grammarIds.length,
          quiz.length + ' câu · ' + [...new Set(quiz.map(e => e.type))].join(', '),
          l.contentStatus
        ]
          .map(cell)
          .join(' | ') +
        ' |'
    );
  }
  rows.push(
    '',
    '10 bài s1-* tham khảo khung chủ đề Sejong Korean 1A (2022), nội dung tự biên soạn. Nguồn và bảng đối chiếu: [CURRICULUM_REFERENCE.md](CURRICULUM_REFERENCE.md).',
    '',
    'Checkpoint Hangul cuối kiểm tra nhận diện 40 chữ qua MATCH, ghép khối, nghe/đọc thay thế, typing, batchim, nối âm và nghĩa từ đã học. Không chấm phát âm.',
    '',
    'Ước lượng 8 phút/bài tình huống mới và 10 phút/bài cũ chưa được đo qua người học thật. Chưa bao phủ đầy đủ giáo trình Sejong, khóa giao tiếp hoặc TOPIK.'
  );
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'CONTENT_MATRIX.md'), rows.join('\n') + '\n');
  console.log('Đã tạo docs/CONTENT_MATRIX.md: ' + C.lessons.length + ' bài/checkpoint.');
})();
