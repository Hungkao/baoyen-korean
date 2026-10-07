# Nghiệm thu bản nhập môn

## Trước khi đưa lên hosting

- [x] Chạy smoke, topics, foundation, learning, release, account-pwa và free-learning bằng Playwright/Edge ngày 06/10/2026; xem docs/history/RELEASE_NOTES.md.
- [ ] Chạy `node scripts/content-report.cjs`; người có chuyên môn thẩm định nội dung, đánh dấu bài đã duyệt sau khi có bằng chứng.
- [x] Chạy `npm run build`; dist chỉ gồm index.html, sw.js, manifest, icons và assets/ có hash (tests/release.cjs kiểm tra).
- [ ] Kiểm tra config.js đúng Supabase project và chỉ chứa publishable key.
- [ ] Giữ bản gói phát hành trước và phiên bản cache tương ứng để phục hồi.

## Trên HTTPS và backend thật

- [ ] Email nhận mã và đăng nhập thành công; không dùng email giả lập để nghiệm thu bước này.
- [ ] Hai tài khoản không đọc được tiến độ của nhau; RPC không cho người chưa đăng nhập ghi dữ liệu.
- [ ] Hai thiết bị: học → đồng bộ → mở thiết bị kia → thấy cùng tiến độ.
- [ ] Hai thiết bị cùng sửa: hiện xung đột, chọn bản rõ ràng, có bản dự phòng.
- [ ] Offline rồi online: tiến độ được lưu và đồng bộ; cập nhật PWA không mất kết quả.
- [ ] Xuất JSON, khôi phục trên thiết bị khác; JSON sai không xóa dữ liệu đang có.

## Trên điện thoại thật

- [ ] iPhone và Android: cài lên màn hình chính, đóng/mở lại và học offline sau lần tải đầu.
- [ ] Chữ, nút, bàn phím Hàn, vùng safe-area và sáng/tối đọc được; không tràn ngang.
- [ ] Giọng Hàn phát đúng, tốc độ 0.8; thiếu giọng có hướng dẫn và chuyển bài nghe sang đọc.
- [ ] Người mới hoàn thành bài đầu, dừng giữa bài, quay lại đúng chỗ và hiểu tổng kết.
- [ ] Đo thời gian phiên học; chỉnh ước lượng dựa trên sử dụng thực tế.

## Cập nhật và phục hồi

1. Sao lưu JSON tiến độ trên thiết bị trước thử nâng cấp.
2. Tăng tên cache sw.js khi thay runtime; đóng gói lại và phát hành nguyên bộ.
3. Mở app đã cài, chọn cập nhật; kiểm tra phiên học và kết quả cũ.
4. Nếu có lỗi, phục hồi nguyên gói runtime trước với tên cache mới để worker nhận bản phục hồi; không sửa/xóa storage để chữa lỗi giao diện.

Không đánh dấu các mục thiết bị/backend/ngôn ngữ là đạt từ test giả lập. Bản hiện tại là khóa nhập môn dùng thử, không chứng nhận TOPIK hoặc đánh giá phát âm.
