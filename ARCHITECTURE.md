# Kiến trúc hiện hành

Web app một trang: frontend JavaScript thuần chia theo ES modules, đóng gói bằng Vite thành file tĩnh; backend là Supabase (Auth + Postgres với RLS). Không framework và không thư viện runtime.

```
Trình duyệt (frontend, src/)                       Supabase (backend, supabase/)
┌──────────────────────────────────────────┐       ┌───────────────────────────────┐
│ features/*  ← app/router, app/shell      │       │ Auth: mã đăng nhập qua email  │
│     │                                    │       │ Postgres: learning_progress   │
│     ▼                                    │ HTTPS │   (JSONB, revision, RLS)      │
│ data/progress-store ── localStorage      │ ◄───► │ RPC save_learning_progress    │
│ features/account ──── api/supabase.js ───┼───────┤   (khóa hàng, so revision)    │
│     │                                    │       └───────────────────────────────┘
│     ▼                                    │
│ domain/* (thuần) ── content/* (dữ liệu)  │
└──────────────────────────────────────────┘
```

## Các lớp

| Lớp      | Thư mục                   | Trách nhiệm                                                                                                  | Được import                        |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| Nội dung | src/content/              | Chữ cái, 120 từ cũ + kho 577 từ, ngữ pháp, âm tiết mẫu, lộ trình 56 bài, giáo trình 43 bài                   | Không import lớp nào khác          |
| Domain   | src/domain/               | Chấm đáp án, state machine bài học, nền tảng (profile/settings), SRS, chuẩn hóa tiến độ, ghép Hangul, lọc từ | content, shared                    |
| Shared   | src/shared/               | Ngày giờ VN, `$`, trộn Fisher–Yates                                                                          | Không import lớp nào khác          |
| Dữ liệu  | src/data/                 | `state` hiện tại, đọc/ghi localStorage theo khách/tài khoản, `progressStore`, khóa nhiều tab                 | domain, shared                     |
| API      | src/api/                  | Client REST Supabase: auth (mã email) và tiến độ (đọc, ghi qua RPC)                                          | config                             |
| Dịch vụ  | src/services/             | Giọng đọc Web Speech (ko-KR, rate 0.8), cài đặt PWA và service worker                                        | —                                  |
| App      | src/app/                  | Router màn hình, thanh trạng thái, nút điều hướng, vẽ lại khi thay tiến độ, `window.__app`                   | mọi lớp                            |
| Feature  | src/features/&lt;tên&gt;/ | Mỗi màn hình: home, alphabet, syllables, vocabulary, practice, lessons, platform, account                    | app/router, data, domain, services |
| Điểm vào | src/main.js               | Gọi `init*()` theo thứ tự cố định                                                                            | —                                  |
| Backend  | supabase/                 | schema.sql (bảng, RLS, RPC) và setup-database.py                                                             | —                                  |

Quy tắc:

- **domain/ và content/ là hàm/dữ liệu thuần**: không đọc DOM, localStorage hay mạng. Test thuần import thẳng các module này trong Node (tests/helpers/app.cjs).
- **Chỉ data/ chạm localStorage tiến độ, chỉ api/ gọi backend.** UI không gọi `fetch` hoặc Supabase trực tiếp; đổi backend chỉ cần sửa api/ và features/account.
- **data/ không chạm DOM.** Nó phát sự kiện trên `window`; UI tự cập nhật:
  `storage-status`, `progress-saved`, `progress-loaded`, `progress-scope-changed`. Khi toàn bộ tiến độ bị thay (khôi phục, đổi tài khoản), app/shell.js vẽ lại qua `onProgressReplaced`.
- **Module không chạy side effect lúc import.** Mỗi feature xuất `init…()`; src/main.js gọi theo thứ tự: speech → thanh trạng thái → đọc tiến độ → khung/feature → khóa tab → tài khoản → nền tảng → bài học → PWA. Thứ tự này giữ nguyên thứ tự thẻ script cũ.
- Feature đăng ký việc khi vào/rời màn hình bằng `onEnterScreen` / `onLeaveScreen` trong app/router.js thay vì router gọi từng feature.
- Không có biến toàn cục. Test trình duyệt đọc trạng thái qua `window.__app` (app/debug-bridge.js); app không tự dùng object này. ESLint chặn biến chưa khai báo và các tên dễ nhầm với biến toàn cục của trình duyệt (`screen`, `name`, `event`…).

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

Build bằng Vite (`base: './'`): index.html nạp src/main.js; JS/CSS ra dist/assets/ với hash trong tên file. public/ (manifest, icons, sw.js) được chép nguyên; scripts/vite-plugin-sw.js ghi danh sách mọi file trong dist và tên cache theo hash nội dung vào dist/sw.js. Service worker chỉ đăng ký ở bản build. tests/release.cjs build lại và kiểm tra dist chỉ có file runtime, index.html trỏ đúng file, sw.js cache đủ và không có secret key. GitHub Actions đưa dist lên VPS Vultr.

Cấu hình công khai (URL, publishable key) đọc từ `.env` qua `import.meta.env`; `.env.local` để ghi đè trên máy.

## Giới hạn và kiểm chứng

Tất cả bài mới còn draft, cần thẩm định tiếng Hàn. Không có chấm phát âm, kiểm tra đầu vào hoặc chứng nhận TOPIK. Thời gian là ước lượng hoạt động, estimatedMinutes chưa đo với người học thật. Backend email/hai thiết bị và safe-area/âm thanh điện thoại phải nghiệm thu riêng.

Xem docs/CONTENT_MATRIX.md và docs/RELEASE_CHECKLIST.md. docs/history/ chứa báo cáo lịch sử; docs/PRODUCT_PLAN.md là phạm vi và việc còn lại hiện hành.
