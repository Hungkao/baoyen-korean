# Phạm vi sản phẩm và kế hoạch hiện hành

## Bản đầu cho Bảo Yến

App cá nhân để bắt đầu đọc Hangul và làm quen giao tiếp tiếng Hàn, mỗi ngày khoảng 10–15 phút. Học theo sở thích: chọn chữ cái, ghép âm, chủ đề từ vựng hoặc bất kỳ bài/checkpoint nào. Ôn đến hạn và thiết lập mục tiêu đều tùy chọn; không có bảng “hôm nay học gì”. Giữ lời nhắn lãng mạn, tiếng Việt thân thiện và khả năng dừng/tiếp tục.

Kết quả đầu ra dự kiến: nhận diện 40 chữ qua âm tiết mẫu, ghép khối, biết batchim/quy tắc đọc nhập môn; luyện chào hỏi và 10 tình huống theo khung Sejong 1A: số điện thoại, vị trí, hoạt động, mua hàng, số lượng, giờ, thời tiết, quá khứ và lời mời. Đây là mục tiêu nội dung, không đảm bảo thành thạo hoặc đạt TOPIK.

## Hiện trạng

- Web tĩnh, chạy trực tiếp; PWA và Supabase tùy chọn.
- 40 chữ; 577 từ/cụm từ trong 24 chủ đề. Nhãn nội bộ A1–B2 không quy đổi TOPIK.
- Giáo trình chính 23 unit, 43 bài/checkpoint, 9 dạng bài; tất cả còn draft.
- 56 bài cũ đều mở để đọc/nghe, giữ tiến độ riêng; bảng học hằng ngày không còn hiện.
- Resume, giải thích đúng/sai, chống chấm trùng, XP lần đầu đạt. Mọi bài đều mở; quiz không giới hạn nội dung khác.
- Lịch ôn, backup/import JSON, cache offline, cách ly tài khoản và xử lý xung đột.
- Onboarding mục tiêu tự khai không phải xếp lớp; từ đã xem không phải đã thuộc.

## Đợt hoàn thiện sản phẩm

Đã triển khai: trang chọn phần học tự do, lộ trình không khóa bài/chủ đề, quiz sơ cấp khác câu luyện, bài quốc tịch đúng mục tiêu, tổng kiểm tra bao phủ 40 chữ qua nhóm câu; gói dist chỉ chứa runtime; tài liệu kiến trúc, ma trận nội dung và checklist phát hành.

Còn cần nghiệm thu:

1. Thẩm định ngôn ngữ theo docs/CONTENT_MATRIX.md; sửa và ghi người duyệt/ngày duyệt trước khi đổi trạng thái draft.
2. Quan sát Bảo Yến học trên điện thoại: hiểu cách bắt đầu, dùng bàn phím Hàn, đọc phản hồi, dừng/tiếp tục và hoàn thành trong thời gian phù hợp.
3. Kiểm tra email/backend Supabase thật, hai thiết bị, xung đột, cache cập nhật, backup và âm thanh/safe-area.
4. Chọn URL HTTPS cố định; phát hành và ghi kết quả theo docs/RELEASE_CHECKLIST.md.

## Sau bản đầu

Mở rộng giao tiếp theo tình huống sau khi các bài nhập môn đã được duyệt và sử dụng ổn định. Mỗi bài cần mục tiêu cụ thể, nội dung dạy, luyện và quiz ứng dụng; không thêm nhiều từ chỉ để tăng số lượng. Cải thiện lịch ôn theo kết quả thực tế sau khi có dữ liệu học.

Chưa cam kết giáo trình từ ZERO đến TOPIK 3, AI, chấm phát âm, bảng xếp hạng hoặc cá nhân hóa theo kỹ năng. Nếu mở cho nhiều người, bổ sung hướng dẫn dữ liệu/tài khoản, hỗ trợ và cách yêu cầu xóa dữ liệu phù hợp phạm vi phát hành.

## Điều kiện nghiệm thu

Không mất tiến độ qua nâng cấp/tải lại; không chấm trùng; câu kiểm tra thuộc kiến thức đã dạy và có đáp án rõ. 360px sáng/tối không tràn ngang, nút ít nhất 44px, bàn phím/focus hoạt động. PWA cập nhật đúng bộ asset, tài khoản cách ly và khôi phục được backup. Test giả lập không thay thế kiểm tra backend/thiết bị thật hoặc thẩm định ngôn ngữ.

