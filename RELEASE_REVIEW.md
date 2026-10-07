# Rà soát khả năng phát hành — 06/10/2026

## Kết luận

Nền kỹ thuật đủ để tiếp tục làm bản dùng thử cá nhân. Chưa đủ bằng chứng để gọi là khóa học cơ bản hoàn chỉnh hoặc sản phẩm luyện thi. Ưu tiên hoàn thiện hành trình học, nội dung và kiểm chứng vận hành; không cần chuyển framework hay tách database chỉ để phát hành.

## Kiến trúc

- HTML/CSS/JavaScript thuần, mở trực tiếp; HTTPS cho PWA và đồng bộ. Engine giáo trình tách DOM/storage/mạng, progressStore là điểm tích hợp.
- app.js còn trộn dữ liệu, state, lưu trữ, logic cũ và DOM. Phụ thuộc global và thứ tự script là chi phí bảo trì, chưa phải lý do bắt buộc viết lại.
- Hai lộ trình cùng xuất hiện: 56 ngày cũ và 33 bài/checkpoint mới, khác quy tắc hoàn thành và nhịp mở khóa. Cần chọn một hành trình chính trên trang Hôm nay; giữ luồng cũ và dữ liệu cho người đã dùng.
- Schema SQL có RLS theo user_id và RPC kiểm tra revision trong giao dịch. Đây là nhận xét source, không xác nhận cấu hình backend đang chạy. Chấm điểm ở client phù hợp tự học.
- netlify.toml publish toàn thư mục. Cần thư mục phát hành chỉ chứa runtime/icons hoặc cơ chế loại trừ được kiểm chứng; scripts/serve.cjs có allowlist nhưng không bảo vệ hosting Netlify.

## Nội dung

- 33/33 bài mới mang contentStatus=draft. Hangul có 25 bài/checkpoint; sơ cấp mới có 4 chủ đề, mỗi chủ đề một bài và một checkpoint.
- lesson-content.js tạo quiz từ cùng danh sách câu; phần sơ cấp lặp grammarExercise từ luyện vào quiz. Phù hợp ôn lại nhưng chưa chứng minh chuyển giao sang ví dụ mới.
- Bài quốc tịch vẫn dùng câu điền và xếp “Tôi là học sinh” của bài giới thiệu. Cần câu luyện đúng mục tiêu từng bài.
- Tổng kiểm tra Hangul lấy câu quiz đầu của mỗi bài, sau đó thêm nghe/typing. Cần ma trận bao phủ chữ, ghép khối, batchim, quy tắc đọc; số lượng bài không chứng minh đủ độ bao phủ.
- estimatedMinutes mặc định 10 cho mọi bài/checkpoint; cần đo phiên sử dụng thực tế trước khi dùng như thời lượng đáng tin.
- Typing yêu cầu bàn phím Hàn, mới có hướng dẫn chữ. Cần kiểm tra người mới trên điện thoại có đi qua được bài đầu không.
- 9 từ bổ sung có các nhóm như 사람/있어요/없어요 thuộc tinh_cam. Nên rà độ phù hợp chủ đề toàn kho, giữ ID và vị trí dữ liệu cũ.
- Cần người có chuyên môn tiếng Hàn thẩm định câu, nghĩa, mức lịch sự, hướng dẫn phát âm và đáp án; kiểm thử code không thay thế thẩm định ngôn ngữ.

## Tài liệu

- README gần hiện trạng nhất, ghi 556 từ và 33 bài mới; vẫn có tiêu đề Phase 1 và danh sách file mới riêng chỉ nêu ba file Phase 1.
- PRODUCT_PLAN gọi 22 chữ, 30 từ, 28 bài là hiện trạng, ghi 547 từ và backend chờ setup. Các đoạn này không còn thống nhất với README/code.
- ARCHITECTURE là snapshot Phase 1, có chú thích liên kết Phase 2 nhưng vẫn liệt kê Phase 2 là việc tương lai. Cần một tài liệu kiến trúc hiện hành; snapshot lưu rõ là lịch sử.
- Chưa có hướng dẫn phát hành/nghiệm thu thống nhất gồm asset, phiên bản cache, rollback, backup, kiểm tra email thật/hai thiết bị và thiết bị thật.
- Nếu mở cho nhiều người, cần mô tả dữ liệu tài khoản được lưu, cách yêu cầu xóa dữ liệu và đầu mối hỗ trợ trong phạm vi sản phẩm thực tế.

## Thứ tự hoàn thiện

1. Chốt bản đầu: khóa nhập môn Hangul và giao tiếp sơ cấp cho Bảo Yến; quy định kết quả đầu ra và chọn giáo trình chính.
2. Rà từng bài bằng ma trận mục tiêu → nội dung dạy → câu luyện → quiz; bổ sung ngữ cảnh mới và thẩm định.
3. Làm trang Hôm nay dẫn một buổi ngắn: tiếp tục bài, ôn đến hạn, tổng kết. Bảo toàn lộ trình cũ.
4. Đồng bộ docs với code và tạo gói phát hành chỉ có asset công khai.
5. Kiểm chứng HTTPS, email thật, hai thiết bị, xung đột/offline, cập nhật PWA, sao lưu/khôi phục, âm thanh và safe-area trên điện thoại thật.

## Kiểm tra phiên rà soát

- Đạt ngoài sandbox, Playwright/Edge: smoke, topics, foundation, learning (engine và browser).
- Đạt account-pwa khi chạy lại bằng server cùng môi trường: đăng nhập giả lập, cách ly tài khoản, refresh, sync/xung đột, backup/import lỗi và shell offline. Lần đầu không truy cập được server khác môi trường sandbox; đó là lỗi môi trường kiểm thử.
- Không gửi email, không ghi database thật, chưa kiểm tra iPhone/Android thật hoặc thẩm định toàn bộ 556 mục ngôn ngữ.

