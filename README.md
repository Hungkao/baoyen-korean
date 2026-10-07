# Bảo Yến học tiếng Hàn ♡

Góc học cá nhân cho Bảo Yến, khoảng 10–15 phút mỗi ngày. HTML/CSS/JavaScript thuần, không framework, CDN, dependency runtime hoặc bước build để học.

## Bắt đầu

Mở index.html bằng trình duyệt, giữ các file runtime cùng thư mục. Nội dung không dùng module/fetch nên học được từ file://; lưu trữ và giọng đọc phụ thuộc trình duyệt. Preview trong ứng dụng Tệp/chat có thể không chạy JavaScript.

Thanh dưới có 5 tab: Học, Chữ cái (kèm tab con Ghép âm), Từ vựng, Bài học và Luyện tập. Nút ☰ ở header mở Cài đặt, nơi có tài khoản, sao lưu và phần “Về góc học này”. Trang Học hiện lời nhắn, thẻ “Học tiếp” khi đang dở một bài (nếu không thì mời tự chọn bài), ôn đến hạn khi có mục đến hạn và tiến độ. App không tự chọn bài kế tiếp. Khi đang trong bài, header và thanh dưới ẩn; thoát bằng nút ✕. Thiết lập mục tiêu là tùy chọn. Mọi bài/checkpoint trong lộ trình đều mở, không cần đạt bài trước.

Giáo trình có 43 bài/checkpoint trong 23 unit: 25 Hangul, 8 bài/checkpoint sơ cấp cũ và 10 bài tình huống mới. Nội dung còn draft, đang chờ thẩm định; không quảng bá như khóa luyện thi hoàn chỉnh. Kho từ có 577 từ/cụm từ, 24 chủ đề; A1–B2 là nhãn định hướng nội bộ, không quy đổi TOPIK.

## Khung giáo trình tham khảo

10 bài tình huống dựa vào khung chủ đề công khai của **Sejong Korean 1A (2022)**, từ giới thiệu đến lời mời. Mỗi bài tự biên soạn có mục tiêu nhỏ, mẹo nhớ, hội thoại, câu tự nhớ rồi mở đáp án và 7 câu luyện/quiz. Thời lượng khoảng 8 phút là ước lượng chưa đo. Mọi bài mở tự do. Đây không phải bản dịch sách hoặc khóa Sejong chính thức; nội dung còn chờ thẩm định. Xem [nguồn và bảng đối chiếu](docs/CURRICULUM_REFERENCE.md).

## Quy tắc học và tiến độ

Giáo trình chính yêu cầu đi đủ phần, trả lời đủ câu và quiz đạt ít nhất 70%. XP = 10 × câu đúng, chỉ cộng lần đầu hoàn thành; làm lại không cộng thêm. Không khóa bài khác dù quiz chưa đạt; thứ tự lộ trình chỉ là gợi ý. Tổng kiểm tra Hangul có nhóm câu bao phủ 40 chữ, ghép âm, batchim và cách đọc nhập môn; không chấm phát âm.

56 bài cũ đều có thể mở để đọc và nghe. Bảng học hằng ngày không còn hiện trong giao diện; tiến độ/ngày đã hoàn thành và logic lưu dữ liệu cũ vẫn được giữ để tương thích. Xem một bài không tự đánh dấu đã hoàn thành hoặc đã thuộc.

Thẻ từ có nghĩa, ví dụ Hàn–Việt và giọng đọc; thử nhớ trước khi lật. Luyện tối đa 10 từ theo nhóm, ôn chỉ lấy mục đến hạn trong phạm vi đã chọn. Tự đánh giá không cộng điểm. Đã xem không có nghĩa là đã thuộc.

Lịch ôn lấy cảm hứng SM-2: đúng lần đầu 1 ngày, lần sau 6 ngày rồi nhân hệ số, tối đa 365 ngày; sai 1 ngày. Đúng nhiều lần trong ngày không kéo dài lịch. Không phải SM-2 chuẩn.

Giữ key khách hangul-little-steps-v1, 120 từ đầu và ID word:ko. Tài khoản dùng phạm vi riêng. Trường mới có mặc định cho dữ liệu cũ. Câu sửa ở đợt này đổi ID -r2, phiên dang dở quay về phần cần trả lời lại; kết quả hoàn thành cũ được giữ. Lượt luyện chủ đề chưa xong không lưu hàng đợi; từng kết quả đã trả lời được lưu.

localStorage có try/catch; bị chặn vẫn học được trong phiên và hiện cảnh báo. Web Locks hạn chế nhiều tab cùng sửa; không có Web Locks thì dùng một tab. Xuất JSON trước đổi trình duyệt, chuyển file:// sang hosting hoặc xóa dữ liệu. Backup không chứa token.

## Giọng đọc

Web Speech chọn giọng Hàn, ko-KR, rate 0.8. Chỉ hủy giọng khi đang đọc/còn câu chờ, tránh reset bộ đọc lúc rảnh; tiếp tục bộ đọc nếu đang tạm dừng. Đây là biện pháp hạn chế khựng khi bắt đầu, chưa xác minh hết hiện tượng mất âm đầu trên thiết bị thật. Thiếu giọng có hướng dẫn và câu nghe chuyển sang đọc; không giả vờ đã phát âm. Phiên âm là gợi ý gần đúng. Offline âm thanh phụ thuộc giọng đã tải; phải kiểm tra trên điện thoại thật.

## Phát triển và kiểm thử

Lần đầu: `npm install` rồi `npx playwright install chromium`. Node/Playwright/Prettier chỉ cần cho phát triển, không cần để học.

| Lệnh | Việc làm |
|---|---|
| `npm run serve` | Server phát triển, mở http://127.0.0.1:4173 |
| `npm test` | Chạy toàn bộ test (tự bật server nếu chưa chạy) |
| `npm run test:unit` | Chỉ test không cần trình duyệt (nhanh) |
| `npm run format` | Định dạng JS/CSS bằng Prettier; CI chạy `format:check` |
| `npm run build` | Đồng bộ `sw.js` và tạo `dist/` |
| `npm run content-report` | Tạo lại docs/CONTENT_MATRIX.md |

Mặc định test chạy bằng Chromium của Playwright. Muốn dùng Edge trong PowerShell: `$env:BROWSER_CHANNEL = 'msedge'` trước `npm test`. Thêm file test mới phải khai báo trong scripts/run-tests.cjs (runner báo lỗi nếu quên).

Test tài khoản dùng API giả lập, không gửi email thật. Bộ release kiểm tra ngữ cảnh câu hỏi, bao phủ chữ, bảo toàn snapshot đạt và asset/cache.

## Phát hành

GitHub Actions tự kiểm thử và deploy lên VPS Vultr khi push vào `main`, sau khi cài SSH key và hai secret. Xem [thiết lập CI/CD Vultr](docs/VULTR_DEPLOY.md).

`npm run build` tạo dist gồm toàn bộ file runtime/icons. Chỉ đưa nội dung dist lên hosting HTTPS; không cần Node trên thiết bị học. Script từ chối đóng gói nếu dist có file ngoài allowlist.

Nguồn allowlist duy nhất là scripts/runtime-assets.cjs, dùng chung server và gói phát hành. Thêm file runtime: thêm vào allowlist và thẻ `<script>` trong index.html, rồi chạy `npm run build`. scripts/sync-sw.cjs tự gắn `?v=<hash nội dung>` vào link JS/CSS trong index.html và ghi danh sách cache/tên cache vào sw.js. Nhờ vậy Cloudflare và trình duyệt không bao giờ trộn JS cũ với HTML mới, và không cần tăng phiên bản cache bằng tay. Sau khi sửa bất kỳ file JS/CSS nào, chạy `npm run build` rồi commit cả index.html và sw.js (test release báo lỗi nếu quên). Không đưa tests, scripts, SQL, skills hoặc docs nội bộ lên web.

PWA cache shell cùng phiên bản, không cache API/token. Sau lần tải đầu có thể mở nội dung offline; đăng nhập/đồng bộ cần mạng. Nút cập nhật áp dụng worker mới. iPhone: Chia sẻ → Thêm vào Màn hình chính.

## Tài khoản

config.js chỉ chứa URL và publishable key công khai; không đưa database password, service_role hoặc secret key vào frontend. Schema nằm ở supabase/schema.sql. RLS đọc theo chủ tài khoản, ghi qua RPC kiểm tra revision; xung đột cho chọn bản, giữ bản dự phòng trước khi thay.

Cấu hình Site URL/Redirect URLs và email trong Supabase theo URL HTTPS thực tế. Người dùng đã báo setup backend; phiên hoàn thiện chưa xác minh email hoặc hai thiết bị thật. Xem docs/RELEASE_CHECKLIST.md để nghiệm thu thay vì suy từ test giả lập.

## Tài liệu

- ARCHITECTURE.md: kiến trúc và luồng dữ liệu hiện hành.
- docs/PRODUCT_PLAN.md: phạm vi bản đầu và việc còn lại.
- docs/CURRICULUM_REFERENCE.md: giáo trình tham khảo và phạm vi tự biên soạn.
- docs/CONTENT_MATRIX.md: ma trận từng bài để thẩm định.
- docs/RELEASE_CHECKLIST.md: hosting, backend, điện thoại và phục hồi.
- docs/history/: báo cáo cũ (RELEASE_REVIEW, RELEASE_NOTES, PHASE2_REPORT), chỉ để tra cứu.

Chưa xác minh âm thanh/safe-area trên iPhone/Android thật; nội dung cần người có chuyên môn tiếng Hàn duyệt. Dashboard không suy mức thành thạo hoặc sẵn sàng TOPIK từ XP, mục đã xem hay mục tiêu tự khai.

