# Kiến trúc hiện hành

Ứng dụng web tĩnh HTML/CSS/JavaScript thuần. Không framework, dependency runtime, fetch nội dung hoặc bước build để học. Mở index.html trực tiếp; HTTPS cho PWA và tài khoản tùy chọn.

## Các lớp

| Nhóm | File | Trách nhiệm |
|---|---|---|
| Khung giao diện | index.html, styles.css | Màn hình, theme, DOM và bố cục điện thoại |
| Nội dung | course-content.js, lesson-content.js, vocabulary-basic.js, vocabulary-intermediate.js | Lộ trình cũ, giáo trình chính và kho từ |
| Engine thuần | platform-engine.js, lesson-engine.js, exercise-engine.js | Chuẩn hóa, thống kê, trạng thái bài và chấm đáp án |
| UI | platform-ui.js, lesson-renderer.js | Chọn phần học, roadmap, onboarding, settings và bài học |
| Dữ liệu lõi | core-data.js | letters, 120 words cũ, ngữ pháp, âm tiết mẫu, lộ trình 56 bài, learningItems |
| Tiến độ thuần | progress-store.js, srs.js | emptyProgress, normalizeProgress (hàm thuần), ngày giờ VN, lịch ôn SRS.next |
| Giọng đọc | speech.js | Chọn giọng Hàn, ko-KR, rate 0.8, hướng dẫn khi thiếu giọng |
| Giao diện chính | app.js | state, đọc/ghi localStorage, progressStore, chữ cái, ghép âm, từ vựng, luyện tập |
| Tài khoản | account.js, tab-lock.js, config.js | Auth REST, cache riêng từng tài khoản, CAS, khóa tab |
| PWA | pwa.js, sw.js, manifest.webmanifest, icons/ | Cài đặt, offline và cập nhật |
| Công cụ phát triển | package.json, scripts/, tests/ | Server allowlist, runner test, đồng bộ sw.js, đóng gói, ma trận nội dung, Playwright, Prettier |

Script thường dùng defer, chạy theo thứ tự trong index.html; API chia sẻ qua globals/window và CustomEvent. Engine không đọc DOM/storage/mạng. Các file dùng chung phạm vi toàn cục của script thường (không dùng module) để vẫn mở được bằng file://; thứ tự thẻ script trong index.html là thứ tự phụ thuộc. progress-store.js và srs.js không đọc DOM/storage và có test thuần tests/progress-unit.cjs.

## Luồng học

UI → progressStore.learningAction → LessonEngine.transition → ExerciseEngine.grade → lưu → sự kiện progress-saved → cập nhật UI/đồng bộ.

Giáo trình chính: 23 unit, 43 bài/checkpoint (25 Hangul, 8 sơ cấp cũ và 10 tình huống mới theo khung Sejong 1A). Đi hết phần, trả lời đủ câu và quiz đạt ít nhất 70% để hoàn thành; điểm chỉ cộng lần đầu đạt. Mọi bài và checkpoint luôn mở; prerequisites chỉ ghi thứ tự tham khảo, không dùng để khóa hoặc loại phiên đang học khi chuẩn hóa.

56 bài cũ đều mở để đọc/nghe qua lesson-outline. Giao diện bài hằng ngày cũ đã được gỡ; dữ liệu completedDays/daily vẫn được chuẩn hóa và giữ nguyên để tương thích, không bị xóa hoặc tự tăng khi xem bài. Lộ trình chỉ giúp tìm nội dung, không quyết định quyền học.

Thanh dưới là điều hướng chính (Học, Chữ cái/Ghép âm, Từ vựng, Bài học, Luyện tập). Trang Học có thẻ tiếp tục khi có phiên dang dở (không thì mời mở lộ trình), ôn đến hạn khi có mục đến hạn và tiến độ. Màn bài học ẩn header và thanh dưới (body[data-view=lesson]). Không tự chọn bài kế tiếp hoặc hiển thị lịch học hôm nay. Khi chọn bài khác, xác nhận thay phiên đang học; kết quả bài đã hoàn thành vẫn giữ.

Các bài s1-* có referenceTheme, memoryCue, dialogue và recallPrompt/recallAnswer trong dữ liệu nội dung; renderer tạo DOM bằng textContent. Các trường này không mở rộng storage. Nguồn và phạm vi: docs/CURRICULUM_REFERENCE.md.

## Tiến độ và tương thích

Giữ envelope {version:1, progress:{...}}, key khách hangul-little-steps-v1, 120 từ đầu và ID word:ko. Có 577 từ/cụm từ, 24 chủ đề; nhãn A1–B2 là định hướng biên soạn.

progress.platform chứa profile, settings, activity, events và learning. learning có một session, results theo lessonId và checkpoints. Không lưu toàn bộ lịch sử hoặc bản sao nội dung. Các trường mới có mặc định cho dữ liệu cũ. Xem docs/history/PHASE2_REPORT.md để biết chi tiết schema lịch sử.

Các câu được sửa ở đợt hoàn thiện dùng hậu tố ID -r2; đáp án ID cũ bị bỏ khi chuẩn hóa, phiên dang dở quay về phần thiếu câu. Lesson ID, số câu/quiz và snapshot hoàn thành được giữ để không mất kết quả đạt cũ.

Supabase lưu JSONB payload trong learning_progress với user_id, revision, updated_at. RLS chỉ đọc tiến độ của chủ tài khoản; ghi qua save_learning_progress có khóa hàng và so revision. localStorage là nguồn tiến độ khách/cache offline; xung đột chọn cả bản và giữ dự phòng, không tự ghép hai kết quả. Các thao tác storage có try/catch. Chấm điểm ở client phục vụ tự học.

## Điều hướng, offline và phát hành

Hash routes: home, onboarding, roadmap, lesson, lesson-outline, settings, alphabet, syllables, vocabulary, practice, account. Màn bài học khôi phục từ phiên đang lưu; route không chứa ID bài.

Service worker cache shell cùng phiên bản, không cache API/tài khoản; người dùng chọn cập nhật. Giọng đọc Web Speech dùng ko-KR, rate 0.8, thiếu giọng có hướng dẫn; offline âm thanh phụ thuộc thiết bị.

scripts/runtime-assets.cjs là allowlist chung của server và gói dist. scripts/package-release.cjs đồng bộ sw.js rồi chép đúng runtime vào dist; GitHub Actions đưa dist lên VPS Vultr. Node chỉ cần ở máy phát triển/hosting lúc đóng gói, không cần để học. Danh sách cache và tên cache trong sw.js do scripts/sync-sw.cjs sinh từ allowlist và hash nội dung; tests/release.cjs kiểm tra đồng nhất.

## Giới hạn và kiểm chứng

Tất cả bài mới còn draft, cần thẩm định tiếng Hàn. Không có chấm phát âm, kiểm tra đầu vào hoặc chứng nhận TOPIK. Thời gian là ước lượng hoạt động, estimatedMinutes chưa đo với người học thật. Backend email/hai thiết bị và safe-area/âm thanh điện thoại phải nghiệm thu riêng.

Xem docs/CONTENT_MATRIX.md và docs/RELEASE_CHECKLIST.md. docs/history/ chứa báo cáo lịch sử; docs/PRODUCT_PLAN.md là phạm vi và việc còn lại hiện hành.

