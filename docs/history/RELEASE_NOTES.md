# Đợt hoàn thiện bản nhập môn — 06/10/2026

## Hiện hành: 10 tình huống theo khung Sejong 1A

- Tham khảo mục lục công khai Sejong Korean 1A (2022); hội thoại, giải thích và bài tập tự biên soạn. Nguồn/phạm vi ở docs/CURRICULUM_REFERENCE.md.
- Thêm 10 bài, 21 từ/cụm từ; tổng 43 bài/checkpoint, 23 unit, 577 mục trong kho từ. Giữ 120 từ đầu, ID và tiến độ cũ.
- Mỗi bài có mẹo nhớ, hội thoại ngắn, tự nhớ trước khi mở câu mẫu và 7 câu luyện/quiz. Thời lượng 8 phút là ước lượng. Tất cả bài mở tự do, chưa được giáo viên thẩm định.
- Cache PWA v10; gói runtime vẫn 21 file. Thêm tests/sejong-content.cjs và hành trình bài mới trong learning.cjs.
- Đạt cả 8 bộ test: sejong-content, free-learning, release, smoke, topics, foundation, learning, account-pwa. Đã xem giao diện bài mới 360px sáng/tối; ảnh preview-sejong-light.png và preview-sejong-dark.png. Backend và âm thanh điện thoại thật chưa xác minh.

## Trước đó: học theo sở thích

- Trang chính chọn Chữ cái, Ghép âm, Từ vựng, Học theo bài hoặc Luyện tập. Không còn bảng/gợi ý “hôm nay học gì” và mục tiêu phút trên trang học.
- Tiến độ thu gọn trong mục có thể mở; chỉ hiện nút tiếp tục khi có bài dang dở, không tự đề xuất bài kế tiếp.
- 33 bài/checkpoint mới đều mở, quiz chưa đạt không khóa nội dung khác. 56 bài cũ đều đọc/nghe được, không chuyển người học vào bài hằng ngày đang được chọn tự động.
- DOM/engine ngày cũ được giữ ẩn cho tương thích; storage key, word ID, kết quả và ngày đã hoàn thành vẫn giữ.
- Khi đổi một bài dang dở, xác nhận thay phiên để tránh mất phần đang làm. Hủy xác nhận giữ nguyên bài cũ. Chỉ lưu một phiên dang dở như trước.
- Tài liệu và AGENTS.md cập nhật theo chế độ tự chọn; PWA cache v9.
- Đạt cả 7 bộ test: smoke, topics, foundation, learning, account-pwa, free-learning và release trên Edge. Bao gồm bài ngoài thứ tự, quiz chưa đạt không khóa bài khác, đổi/hủy đổi phiên, tải lại, storage lỗi, theme 360px và gói dist. Có ảnh preview-free-learning.png và preview-free-learning-dark.png.

## Đợt hoàn thiện trước

- Hôm nay ưu tiên giáo trình chính, cho học trước onboarding, hiển thị bài tiếp tục và ba bước của buổi học. Tiến độ dashboard ưu tiên bài/checkpoint mới. Lộ trình 56 ngày giữ nguyên trong khối học thêm, ghi rõ quy tắc riêng.
- Tổng kết đạt có nút về Hôm nay và ôn đến hạn. Làm lại vẫn mở và không cộng điểm lần nữa.
- Quiz sơ cấp không lặp prompt của phần luyện; bài quốc tịch dùng câu quốc tịch. Bài giới thiệu bổ sung ví dụ tên không batchim trước quiz 예요.
- Tổng kiểm tra Hangul bao phủ 40 chữ bằng bảy nhóm ghép chữ với âm tiết mẫu và bảy câu vận dụng. Mỗi bộ MATCH tính một câu; đạt quiz không đồng nghĩa thuộc mọi chữ hoặc phát âm đúng.
- Câu sửa đổi có ID -r2; phiên dang dở quay về phần chưa đủ đáp án. Phiên cũ đã hoàn tất không biến thành dang dở. Snapshot đạt, lesson ID, word ID và storage key cũ được giữ.
- Server/gói phát hành dùng chung allowlist 21 file. Netlify/Vercel cấu hình output dist; đóng gói từ chối file ngoài allowlist. Cache PWA tăng v8 và bổ sung SVG icon.
- README, ARCHITECTURE và PRODUCT_PLAN phản ánh hiện trạng. Thêm ma trận nội dung và checklist nghiệm thu.

## Kiểm chứng

Đạt: tests/smoke.cjs, tests/topics.cjs, tests/foundation.cjs, tests/learning.cjs, tests/release.cjs, tests/account-pwa.cjs; Playwright/Edge ngoài sandbox. Sau sửa normalization, chạy lại learning và release đều đạt. Syntax checks các JavaScript thay đổi đạt.

Bao gồm đúng/sai, chấm trùng, resume/tải lại, snapshot cũ, storage lỗi, account isolation/xung đột giả lập, PWA offline HTTP và 360px sáng/tối. Kiểm tra gói dist khớp từng file nguồn; thử thêm file không thuộc runtime bị từ chối.

## Chưa nghiệm thu

Chưa upload hosting hoặc gửi email thật; chưa xác minh backend hai thiết bị, âm thanh/safe-area trên iPhone/Android thật. 43 bài vẫn draft, chưa có người thẩm định tiếng Hàn. Thời lượng bài chưa đo với người học thật. Đây là bản nhập môn dùng thử, không phải khóa luyện thi hoàn chỉnh.

Mở dist/index.html để dùng gói đã chuẩn bị; dùng docs/RELEASE_CHECKLIST.md trước phát hành chính thức. PHASE2_REPORT.md và RELEASE_REVIEW.md là tài liệu lịch sử, không thay thế trạng thái nghiệm thu hiện hành.
