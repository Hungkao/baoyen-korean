# Kiến trúc hiện hành

Ứng dụng web tĩnh HTML/CSS/JavaScript thuần. Không framework, dependency runtime, fetch nội dung hoặc bước build để học. Mở index.html trực tiếp; HTTPS cho PWA và tài khoản tùy chọn.

## Các lớp

| Nhóm | File | Trách nhiệm |
|---|---|---|
| Khung giao diện | index.html, styles.css | Màn hình, theme, DOM và bố cục điện thoại |
| Nội dung | course-content.js, lesson-content.js, vocabulary-basic.js, vocabulary-intermediate.js | Lộ trình cũ, giáo trình chính và kho từ |
| Engine thuần | platform-engine.js, lesson-engine.js, exercise-engine.js | Chuẩn hóa, thống kê, trạng thái bài và chấm đáp án |
| UI | platform-ui.js, lesson-renderer.js | Chọn phần học, roadmap, onboarding, settings và bài học |
| Lõi kế thừa | app.js | letters/words, state, progressStore, bài hằng ngày, luyện từ, lịch ôn, giọng đọc |
| Tài khoản | account.js, tab-lock.js, config.js | Auth REST, cache riêng từng tài khoản, CAS, khóa tab |
| PWA | pwa.js, sw.js, manifest.webmanifest, icons/ | Cài đặt, offline và cập nhật |
| Công cụ phát triển | scripts/, tests/ | Server allowlist, đóng gói, ma trận nội dung và Playwright |

Script thường dùng defer, chạy theo thứ tự trong index.html; API chia sẻ qua globals/window và CustomEvent. Engine không đọc DOM/storage/mạng. app.js còn lớn nhưng không cần viết lại để phát hành bản cá nhân.

## Luồng học

UI → progressStore.learningAction → LessonEngine.transition → ExerciseEngine.grade → lưu → sự kiện progress-saved → cập nhật UI/đồng bộ.

Giáo trình chính: 23 unit, 43 bài/checkpoint (25 Hangul, 8 sơ cấp cũ và 10 tình huống mới theo khung Sejong 1A). Đi hết phần, trả lời đủ câu và quiz đạt ít nhất 70% để hoàn thành; điểm chỉ cộng lần đầu đạt. Mọi bài và checkpoint luôn mở; prerequisites chỉ ghi thứ tự tham khảo, không dùng để khóa hoặc loại phiên đang học khi chuẩn hóa.

56 bài cũ đều mở để đọc/nghe qua lesson-outline, không còn nút bắt đầu bài hằng ngày. DOM và engine hằng ngày cũ được giữ ẩn để tương thích; completedDays không bị xóa hoặc tự tăng khi xem bài. Lộ trình chỉ giúp tìm nội dung, không quyết định quyền học.

Trang chính có năm nút chọn phần học, nút tiếp tục khi có phiên dang dở và ôn đến hạn tùy chọn. Không tự chọn bài kế tiếp hoặc hiển thị lịch học hôm nay. Khi chọn bài khác, xác nhận thay phiên đang học; kết quả bài đã hoàn thành vẫn giữ.

Các bài s1-* có referenceTheme, memoryCue, dialogue và recallPrompt/recallAnswer trong dữ liệu nội dung; renderer tạo DOM bằng textContent. Các trường này không mở rộng storage. Nguồn và phạm vi: docs/CURRICULUM_REFERENCE.md.

## Tiến độ và tương thích

Giữ envelope {version:1, progress:{...}}, key khách hangul-little-steps-v1, 120 từ đầu và ID word:ko. Có 577 từ/cụm từ, 24 chủ đề; nhãn A1–B2 là định hướng biên soạn.

progress.platform chứa profile, settings, activity, events và learning. learning có một session, results theo lessonId và checkpoints. Không lưu toàn bộ lịch sử hoặc bản sao nội dung. Các trường mới có mặc định cho dữ liệu cũ. Xem PHASE2_REPORT.md để biết chi tiết schema lịch sử.

Các câu được sửa ở đợt hoàn thiện dùng hậu tố ID -r2; đáp án ID cũ bị bỏ khi chuẩn hóa, phiên dang dở quay về phần thiếu câu. Lesson ID, số câu/quiz và snapshot hoàn thành được giữ để không mất kết quả đạt cũ.

Supabase lưu JSONB payload trong learning_progress với user_id, revision, updated_at. RLS chỉ đọc tiến độ của chủ tài khoản; ghi qua save_learning_progress có khóa hàng và so revision. localStorage là nguồn tiến độ khách/cache offline; xung đột chọn cả bản và giữ dự phòng, không tự ghép hai kết quả. Các thao tác storage có try/catch. Chấm điểm ở client phục vụ tự học.

## Điều hướng, offline và phát hành

Hash routes: home, onboarding, roadmap, lesson, lesson-outline, settings, alphabet, syllables, vocabulary, practice, account. Màn bài học khôi phục từ phiên đang lưu; route không chứa ID bài.

Service worker cache shell cùng phiên bản, không cache API/tài khoản; người dùng chọn cập nhật. Giọng đọc Web Speech dùng ko-KR, rate 0.8, thiếu giọng có hướng dẫn; offline âm thanh phụ thuộc thiết bị.

scripts/runtime-assets.cjs là allowlist chung của server và gói dist. scripts/package-release.cjs chép đúng runtime; Netlify/Vercel phát hành dist. Node chỉ cần ở máy phát triển/hosting lúc đóng gói, không cần để học. sw.js giữ danh sách cache riêng, tests/release.cjs kiểm tra đồng nhất.

## Giới hạn và kiểm chứng

Tất cả bài mới còn draft, cần thẩm định tiếng Hàn. Không có chấm phát âm, kiểm tra đầu vào hoặc chứng nhận TOPIK. Thời gian là ước lượng hoạt động, estimatedMinutes chưa đo với người học thật. Backend email/hai thiết bị và safe-area/âm thanh điện thoại phải nghiệm thu riêng.

Xem docs/CONTENT_MATRIX.md, docs/RELEASE_CHECKLIST.md và RELEASE_REVIEW.md. PHASE2_REPORT.md là báo cáo lịch sử triển khai; PRODUCT_PLAN.md là phạm vi và việc còn lại hiện hành.

