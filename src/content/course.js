// Nội dung độc lập với UI. ID lesson-001…053 giữ đúng thứ tự trước nâng cấp.
export const COURSE_CONTENT = {
  version: 1,
  course: { id: 'korean-vietnamese', title: 'Tiếng Hàn từ những bước đầu', language: 'ko', instructionLanguage: 'vi' },
  levels: [
    {
      id: 'hangul',
      order: 0,
      title: 'Hangul',
      status: 'partial',
      objective: 'Nhận diện chữ và đọc âm tiết cơ bản',
      targetWords: null
    },
    {
      id: 'basics',
      order: 1,
      title: 'Korean Basics',
      status: 'partial',
      objective: 'Lời chào, bản thân và những câu quen thuộc',
      targetWords: [300, 500]
    },
    {
      id: 'beginner',
      order: 2,
      title: 'Beginner Korean',
      status: 'planned',
      objective: 'Sinh hoạt, giao tiếp và ngữ pháp sơ cấp mở rộng',
      targetWords: [800, 1200]
    },
    {
      id: 'topik-one',
      order: 3,
      title: 'TOPIK I',
      status: 'planned',
      objective: 'Luyện nghe, đọc và đề có giới hạn thời gian',
      targetWords: null
    },
    {
      id: 'intermediate',
      order: 4,
      title: 'Intermediate Korean',
      status: 'planned',
      objective: 'Đọc ngữ cảnh, tìm ý chính và bày tỏ quan điểm',
      targetWords: [2000, 3000]
    },
    {
      id: 'topik-three',
      order: 5,
      title: 'Chuẩn bị TOPIK 3',
      status: 'planned',
      objective: 'Nghe, đọc, viết và phân tích kết quả thi thử',
      targetWords: null
    }
  ],
  units: [
    { id: 'hangul-start', levelId: 'hangul', order: 0, title: 'Chữ cái và ghép âm cơ bản' },
    { id: 'hangul-expanded', levelId: 'hangul', order: 1, title: 'Nguyên âm mở rộng, phụ âm căng' },
    { id: 'basics-first', levelId: 'basics', order: 0, title: '30 từ đầu tiên' },
    { id: 'basics-context', levelId: 'basics', order: 1, title: 'Từ vựng trong ngữ cảnh và ngữ pháp' }
  ],
  lessonSeeds: [
    // Tuan 1: Nguyen am & phu am
    ['Bốn nguyên âm đầu tiên', 'letter', [0, 1, 2, 3]],
    ['Thêm bốn âm nhỏ xinh', 'letter', [4, 5, 6, 7]],
    ['Năm phụ âm đầu tiên', 'letter', [8, 9, 10, 11, 12]],
    ['Thêm vài người bạn mới', 'letter', [13, 14, 15, 16, 17]],
    ['Hoàn thành bộ chữ cơ bản', 'letter', [18, 19, 20, 21]],
    ['Em ghép chữ đầu tiên', 'syllable', [0, 1, 2]],
    ['Hẹn em một buổi ôn nhẹ', 'letter', [0, 2, 4, 6, 8, 12]],
    // Tuan 2: Ghep am & loi chao
    ['Một chút phụ âm cuối', 'syllable', [3, 4, 5]],
    ['Lời chào đầu tiên của em', 'word', [0, 1, 2]],
    ['Nói không và nói không sao', 'word', [3, 4, 14]],
    ['Nước, cơm và tên của em', 'word', [9, 10, 11]],
    ['Một lời thương bằng tiếng Hàn', 'word', [5, 6, 7]],
    ['Chào em, chúc em ngủ ngon', 'word', [8, 12, 13]],
    ['Ôn những lời em đã học', 'word', [0, 1, 4, 5, 9, 13]],
    // Tuan 3: Tu vung
    ['Một quán nhỏ, vài món quen', 'word', [15, 16, 17, 18]],
    ['Bánh mì, táo và một người bạn', 'word', [19, 20, 21]],
    ['Những nơi chốn thân thương', 'word', [22, 23, 24]],
    ['Hôm nay, ngày mai, hạnh phúc', 'word', [25, 26, 27]],
    ['Em đẹp và lời cảm ơn', 'word', [28, 29]],
    ['Ghé lại những từ gần gũi', 'word', [16, 18, 20, 21, 23, 27]],
    ['30 từ, từng chút một thôi', 'word', [2, 7, 11, 15, 22, 26]],
    // Tuan 4: On tong hop
    ['Đọc lại những khối chữ', 'syllable', [0, 1, 2, 3, 4, 5]],
    ['Một cuộc chào hỏi dễ thương', 'word', [0, 1, 2, 3, 4, 14]],
    ['Kể về những điều thân quen', 'word', [11, 21, 22, 23, 24, 25]],
    ['Hẹn em ở một quán nhỏ', 'word', [7, 9, 10, 16, 17, 19]],
    ['Gửi em một lời thương', 'word', [5, 6, 13, 27, 28, 29]],
    ['Những từ em muốn nhớ lâu', 'word', [8, 12, 15, 18, 20, 26]],
    ['Bốn tuần đầu, em đã đi xa', 'word', [0, 1, 5, 6, 14, 27]],
    // Tuan 5: Hangul nang cao
    ['Bốn nguyên âm mở rộng (Y-)', 'letter', [22, 23, 24, 25], 'g1'],
    ['Nguyên âm kép nhóm W-', 'letter', [26, 27, 28, 29]],
    ['Nguyên âm kép còn lại', 'letter', [30, 31, 32, 33, 34]],
    ['Phụ âm căng — căng mà vui', 'letter', [35, 36, 37, 38, 39], 'g2'],
    // Tuan 6: Ban than & gia dinh
    ['Chào hỏi thêm', 'word', [30, 31, 32, 33], 'g3'],
    ['Giới thiệu bản thân', 'word', [34, 35, 36, 37]],
    ['Tên và quốc tịch', 'word', [38, 39, 40, 41]],
    ['Bố mẹ và anh chị', 'word', [42, 43, 44, 45], 'g4'],
    ['Em trai, em gái, người thương', 'word', [46, 47, 48, 49, 50, 51]],
    ['Ôn gia đình + bản thân', 'word', [36, 39, 42, 43, 46, 47]],
    ['Bảo Yến giới thiệu bản thân', 'word', [37, 38, 41, 48, 50, 51]],
    // Tuan 7: An uong & noi chon
    ['Ăn gì hôm nay?', 'word', [52, 53, 54, 55], 'g5'],
    ['Ngon không ngon, no chưa?', 'word', [56, 57, 58, 59]],
    ['Đây kia, ở đâu?', 'word', [60, 61, 62], 'g6'],
    ['Bệnh viện, tiện lợi, cà phê', 'word', [63, 64, 65]],
    ['Metro, xe buýt, sân bay', 'word', [66, 67, 68, 69]],
    ['Ôn ăn uống + nơi chốn', 'word', [52, 53, 57, 60, 62, 65]],
    // Tuan 8: Thoi gian, sinh hoat & on tong hop
    ['Sáng trưa tối, bây giờ', 'word', [70, 71, 72, 73, 74], 'g7'],
    ['Cuối tuần và các ngày', 'word', [75, 76, 77, 78]],
    ['Đi, đến, làm, xem', 'word', [79, 80, 81, 82]],
    ['Ngủ, dậy, tắm, học bài', 'word', [83, 84, 85, 86], 'g8'],
    ['Tình cảm mới, cố lên!', 'word', [89, 90, 91, 92, 93, 94]],
    ['Số đếm và màu sắc', 'word', [95, 96, 97, 105, 106, 107]],
    ['Câu ngữ pháp thực hành', 'word', [111, 112, 113, 114, 115]],
    ['Bảo Yến — hoàn thành chặng cơ bản ♡', 'word', [0, 5, 36, 39, 42, 52, 60, 70, 89, 95]],
    ['Ôn lại phụ âm cuối', 'syllable', [3, 4, 5]],
    ['Một ngày bằng tiếng Hàn', 'word', [70, 73, 79, 80, 83, 86], 'g4'],
    ['Những lời em đã tự nhớ', 'word', [0, 5, 9, 36, 52, 95], 'g8']
  ]
};
