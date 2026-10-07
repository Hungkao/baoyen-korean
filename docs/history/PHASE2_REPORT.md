# Phase 2 — Core Learning Engine

## 1. Files created

- `lesson-content.js`: nội dung mới, schema lesson/section/grammar, unit và prerequisite.
- `exercise-engine.js`: kiểm tra input và chấm 9 dạng bài tập.
- `lesson-engine.js`: state machine, chuẩn hóa phiên, kết quả và mở khóa.
- `lesson-renderer.js`: renderer dùng DOM native, form và phản hồi truy cập được.
- `tests/learning.cjs`: kiểm thử engine toàn giáo trình và các luồng trình duyệt.
- `PHASE2_REPORT.md`: báo cáo triển khai này.

## 2. Files modified

`app.js` bổ sung adapter learningAction trong progressStore và route lesson; `platform-engine.js` chuẩn hóa state/events mới; `platform-ui.js` nối dashboard, roadmap, thời gian và sửa giữ hash qua nhiều lần reload; `vocabulary-basic.js` nối 9 mục mới; `index.html`, `styles.css` bổ sung màn học. `account.js` nhận diện tiến độ khách mới và mô tả xung đột rõ hơn. `sw.js`, `scripts/serve.cjs` đưa đủ asset mới vào offline/allowlist. `tests/account-pwa.cjs` mở rộng kiểm thử session cloud/offline. `README.md`, `ARCHITECTURE.md` cập nhật hướng dẫn.

## 3. Lesson Engine architecture

Luồng: UI → progressStore.learningAction → LessonEngine.transition → ExerciseEngine.grade → save/event → đồng bộ CAS hiện có. Engine không đọc DOM, storage hoặc mạng. Không viết lại toàn bộ app.js; bài hằng ngày và luyện chủ đề cũ vẫn dùng engine cũ.

Lesson gồm `id`, `unitId`, `order`, `title`, `description`, `objectives`, `estimatedMinutes`, `type`, `contentStatus`, `vocabularyIds`, `grammarIds`, `prerequisites`, `sections`, `completionRules`.

Các section: INTRO → TEACH → VOCABULARY/GRAMMAR khi cần → luyện có hướng dẫn → tự luyện → QUIZ → SUMMARY → kết quả. Một renderer phục vụ tất cả bài. Actions chính: start/resume, answer, back/next/submitQuiz, retry. Sự kiện lesson_completed/checkpoint_completed/unit_completed chỉ phát khi đạt lần đầu.

Engine yêu cầu đi hết các phần, trả lời tất cả câu, nộp quiz và đạt ít nhất 70% câu quiz (so tỷ lệ chính xác, không làm tròn để quyết định). Câu trả lời đã nộp không được chấm hai lần trong một lượt. XP = 10 × tổng câu đúng, chỉ cộng lần đầu hoàn thành; luyện lại không farm điểm. Bài chưa đạt có lời giải và nút ôn lại. Một lần làm lại kém hơn không xóa lần hoàn thành trước.

## 4. Exercise types implemented

| Type | Control / cách chấm |
|---|---|
| MULTIPLE_CHOICE | Radio, đáp án theo giá trị |
| CHARACTER_CHOICE | Radio chữ Hangul |
| WORD_MEANING | Radio nghĩa từ |
| SENTENCE_CHOICE | Radio nghĩa/cách đọc câu |
| AUDIO_CHOICE | Nút nghe và radio; bài đọc tương đương khi không có giọng |
| MATCH | Select ghép từng vế; cả bộ đúng mới tính một câu đúng |
| ORDER | Nút chọn mảnh theo thứ tự; nút xóa để xếp lại |
| FILL_BLANK | Input điền phần thiếu |
| TYPING | Input tiếng Hàn, chuẩn hóa Unicode NFC và khoảng trắng thừa |

Exercise có ID ổn định, prompt, instruction, content thích hợp cho dạng bài, đáp án, explanation. Feedback ghi đúng/sai bằng chữ, câu trả lời của người học, đáp án và giải thích; không tự chuyển trước khi người học đọc xong. Không tự sửa lỗi chính tả để biến câu sai thành đúng.

## 5. Hangul curriculum implemented

9 unit, 25 bài/checkpoint, bao phủ 40 chữ hiện có:

1. Nguyên âm cơ bản: ㅏ/ㅓ, ㅗ/ㅜ, ㅡ/ㅣ và checkpoint.
2. Phụ âm cơ bản: 4 nhóm và checkpoint.
3. Ghép khối âm tiết và checkpoint.
4. Nguyên âm mở rộng và checkpoint.
5. Chữ ghép/phụ âm căng và checkpoint.
6. Batchim cơ bản và checkpoint.
7. Nối âm/mũi hóa mẫu và checkpoint.
8. Đọc từ ngắn và checkpoint.
9. Tổng kiểm tra Hangul nền tảng.

Không dùng các cặp thường hòa âm ㅐ/ㅔ hoặc ㅙ/ㅚ/ㅞ để đánh đố nghe. Nội dung batchim và biến âm là phần nhập môn, chưa bao phủ mọi tổ hợp/ngoại lệ. Tổng kiểm tra có nhận diện, đọc, nghe chọn và typing; kết quả không đánh giá phát âm của người học.

## 6. Beginner curriculum implemented

4 unit mẫu, mỗi unit một bài và một checkpoint: chào hỏi, giới thiệu bản thân, đất nước/quốc tịch, câu hằng ngày. Cùng engine như Hangul; mở sau checkpoint cuối Hangul.

Ba đối tượng ngữ pháp có đủ pattern/title/meaning/usage/structure/examples/notes/commonMistakes: 이에요/예요, 은/는, các mẫu 있어요/없어요 và động từ lịch sự thường gặp. Bài tập đi sau phần giải thích.

Tổng mới: 13 unit, 33 bài/checkpoint, trong đó 13 checkpoint. Bài và checkpoint dùng lại có chủ đích câu đã học để ôn; không coi số câu này là số mục kiến thức độc lập.

Từ được tham chiếu bằng `word:ko` vào kho hiện có. Chỉ thêm 9 mục còn thiếu, nối sau tất cả 547 mục cũ, tổng 556 từ/cụm từ. Khi đi qua phần từ vựng, ghi nhận đã gặp vào learned; nút thêm lịch ôn không tăng mức nhớ và không thay lịch đã có.

## 7. Persistence changes

Giữ envelope `{version:1, progress:{...}}`. Thêm `progress.platform.learning`:

```text
version: 1
session: null | {
  lessonId, contentVersion, currentSection, answers, visited,
  startedAt, seconds, attempt, quizSubmitted, finished
}
results: {lessonId: {attempts, correct, quizCorrect, total, quizTotal,
                    seconds, audioFallbacks, xpAwarded, completedAt, pass, lastAt}}
checkpoints: {lessonId: {quizCorrect, quizTotal, completedAt, lastAt}}
```

Chỉ giữ một phiên đang học, tối đa một kết quả gần nhất và một snapshot đạt cho mỗi ID trong catalog. Đáp án input tối đa 200 ký tự; số đáp án giới hạn theo bài. Events giữ 100 mục gần nhất. Không lưu toàn bộ lịch sử mọi lượt hoặc bản sao nội dung trong payload. Người học xác nhận trước khi thay một phiên chưa hoàn thành bằng bài khác.

Đồng bộ, cách ly tài khoản, xuất/nhập và giải quyết xung đột sử dụng progressStore và RPC CAS cũ. Không cần thay schema SQL vì learning nằm trong JSONB payload đã có. Không gọi API mới hoặc thay chính sách RLS. Server vẫn kiểm tra quyền sở hữu/envelope/revision/kích thước; chấm điểm chi tiết hiện ở client, phù hợp tự học, không làm chứng chỉ hay thi bảo mật.

Thời gian là số giây hoạt động ước lượng theo nhịp 15 giây hiện có; không tính trang ẩn, không phục dựng thời gian khi đóng trang. Các phần ngắn hơn nhịp đo có thể hiển thị 0 giây.

## 8. Legacy compatibility

- `lesson-001`…`lesson-056` giữ nguyên, vẫn ánh xạ trực tiếp sang `completedDays.day` 1…56.
- `completedDays`, daily, SRS, profile/settings/activity và các khóa localStorage cũ không đổi.
- 547 chỉ số từ cũ giữ nguyên; ID `word:ko` không đổi.
- Bài mới dùng `h2-*`, `b2-*`; đây là namespace nội bộ Phase 2, **không phải nhãn cấp độ B2**.
- Roadmap mới quyết định completed từ kết quả đạt của đúng ID mới. Roadmap cũ đọc completedDays như trước.
- Dữ liệu Phase 1 thiếu learning được mặc định rỗng, không xóa thành tích cũ và không giả định đã vượt checkpoint mới.
- Tăng contentVersion khi thay cấu trúc câu/section không tương thích. Khi đó phiên cũ được bỏ để bắt đầu lại; kết quả hoàn thành vẫn theo ID. Không đổi nội dung và đáp án của bài đã phát hành dưới cùng ID nếu việc đó làm sai ý nghĩa kết quả.

## 9. Tests added

`tests/learning.cjs`: integrity ID/40 chữ/ref từ/ref ngữ pháp, 9 dạng đúng/sai, chạy toàn bộ catalog bằng engine, ngưỡng hoàn thành, fail/retry, checkpoint/unit unlock, chống cộng XP trùng, normalization, payload bounded. Trình duyệt: onboarding → bài đầu → sai/giải thích → reload/resume → quiz/result → reload → bài tiếp → unit checkpoint; bài mẫu ngữ pháp có fill/order; phiên âm; theme 360px; đổi tài khoản; thiếu giọng; storage lỗi.

`tests/account-pwa.cjs`: session/answer Phase 2 đi qua mock Supabase, refresh token/reload vẫn giữ, tài khoản khác trống, reload offline vẫn giữ câu đang học. Tests Phase 1 được giữ để kiểm tra tương thích.

## 10. Test results

Kết quả: cả 5 bộ kiểm thử đạt. Các lệnh kiểm chứng trên Edge/Playwright: `tests/learning.cjs`, `tests/foundation.cjs`, `tests/topics.cjs`, `tests/smoke.cjs`, `tests/account-pwa.cjs`. Kiểm tra cú pháp bằng `node --check` cho runtime JS và test CJS. Project không có lint/build pipeline; không thêm bước build.

Ảnh kiểm tra: `preview-lesson-phase2.png`, `preview-exercise-phase2-dark.png`, `preview-roadmap-phase2.png`. Kiểm thử tài khoản dùng API giả lập, không gửi email thật. Offline dùng HTTP local + service worker thật.

## 11. Known limitations

- Nội dung là `draft` học thử, chưa được giáo viên thẩm định. Không chứng nhận CEFR/TOPIK.
- Âm thanh dùng Web Speech ko-KR rate 0.8 của thiết bị, chưa có audio người bản xứ thu riêng. Câu dùng fallback đọc được ghi riêng trong kết quả.
- Chưa kiểm tra email thật, đồng bộ hai điện thoại thật, giọng thực và safe-area trên thiết bị thật.
- Checkpoint dùng bộ câu cố định và có câu ôn lại; là bài tự kiểm tra, không phải ngân hàng đề chống học thuộc đáp án.
- Typing cần bàn phím Hàn; chưa có IME riêng. Chỉ giữ lời giải chi tiết của phiên gần nhất; kết quả những bài khác giữ số liệu tổng hợp và nội dung xem lại.
- Không hỗ trợ hai bài đang làm cùng lúc. Xung đột cloud vẫn chọn toàn bộ bản tiến độ theo cơ chế cũ, chưa merge từng câu.

## 12. Intentionally deferred to Phase 3 and later

Mastery, lịch học thích ứng, sổ lỗi xuyên bài, phân tích kỹ năng dài hạn, AI tutor/writing, speech scoring, TOPIK readiness, full mock exam, leaderboard và social. SRS cũ tiếp tục hoạt động; không triển khai mô hình mastery giả.

Nguồn đối chiếu cấu tạo Hangul: [National Institute of Korean Language](https://www.korean.go.kr/eng_hangeul/principle/001.html), [quy tắc phiên âm](https://www.korean.go.kr/front_eng/roman/roman_01.do); nền JSONB hiện có: [Supabase JSON](https://supabase.com/docs/guides/database/json). Câu luyện tập do app biên soạn.
