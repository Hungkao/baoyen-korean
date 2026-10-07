# Quy tắc project Tiếng hàn

## Sản phẩm và phạm vi
- App Học tiếng Hàn cùng Bảo Yến, món quà lãng mạn cho người yêu, dùng trên điện thoại 10–15 phút mỗi ngày.
- Runtime gồm index.html và các file CSS/JavaScript thuần bên cạnh; không framework, thư viện runtime ngoài hoặc bước build. Mở file trực tiếp để học; HTTPS cho PWA và tài khoản Supabase tùy chọn.
- App: 40 chữ cái, kho từ 24 chủ đề A1–B2, ghép âm, lộ trình 56 bài, luyện riêng theo chủ đề, +10 điểm/câu đúng và lịch ôn localStorage. Nhãn cấp độ là định hướng biên soạn, không phải quy đổi TOPIK chính thức.
- Đã xem không có nghĩa là đã thuộc. Người học tự chọn phần/bài/chủ đề theo sở thích; lộ trình không khóa bài hoặc checkpoint. Không hiển thị bảng “hôm nay học gì”. Giữ tiến độ hằng ngày cũ để tương thích, không tự đánh dấu hoàn thành khi chỉ xem bài; quiz ghi kết quả riêng và không khóa bài khác.

## Cách làm việc
- Đọc code và các caller liên quan trước khi sửa. Giữ thay đổi đúng yêu cầu, ưu tiên API trình duyệt sẵn có.
- Giữ dữ liệu học ở hai mảng letters và words, giữ nguyên 120 mục đầu của words; nội dung bổ sung nằm trong vocabulary-basic.js và vocabulary-intermediate.js. Không đổi storage key hoặc ID word:ko. Mở rộng state phải có giá trị mặc định cho dữ liệu cũ.
- Tiếng Việt thân thiện; lang=ko cho chữ Hàn; phiên âm gần tiếng Việt luôn được ghi là gần đúng.
- CSS variables cho màu; hỗ trợ theme hệ thống, 360px, safe-area, vùng chạm ít nhất 44px và focus bàn phím nhìn thấy được.
- Không đưa dữ liệu lưu vào innerHTML. Bọc mọi thao tác localStorage bằng try/catch.
- Giọng đọc phải chọn tiếng Hàn, lang ko-KR và rate 0.8; thiếu giọng thì hướng dẫn cài, không giả vờ đã phát âm thành công.
- Skill Ponytail trong .agents/skills giúp giảm phần thừa; không được bỏ tính năng đã yêu cầu, xử lý lỗi hoặc khả năng truy cập.

## Kiểm tra và bàn giao
- Chạy `npm test` (toàn bộ test Playwright + test thuần) và `npm run format` trước khi commit; xem README.md để cấu hình trình duyệt.
- Sau sửa logic: kiểm tra đúng/sai, chấm trùng, chuyển màn, tải lại và trường hợp storage lỗi.
- Sau sửa giao diện: kiểm tra 360px, sáng/tối, nút 44px và không tràn ngang.
- Kiểm tra âm thanh và safe-area trên iPhone/Android thật trước khi khẳng định hỗ trợ thiết bị đó.
- Cập nhật README.md khi đổi cách chạy hoặc hành vi. Thêm file runtime thì sửa scripts/runtime-assets.cjs và thẻ script trong index.html, rồi `npm run build` để sw.js tự đồng bộ.
- Báo rõ kiểm tra đã chạy và phần chưa xác minh; không khẳng định mục đã xem là đã nhớ.

