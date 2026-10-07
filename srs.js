'use strict';
// Ngày theo giờ Việt Nam và lịch ôn. Không đọc DOM hoặc storage.
function localDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}
function validDate(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value + 'T12:00:00Z')) &&
    new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value
  );
}
function dayBefore(date) {
  const value = new Date(date + 'T12:00:00Z');
  value.setUTCDate(value.getUTCDate() - 1);
  return value.toISOString().slice(0, 10);
}
// Lịch ôn đơn giản lấy cảm hứng từ SM-2, không phải SM-2 chuẩn.
// Hàm thuần: nhận mục cũ, trả về mục mới (hoặc null nếu không đổi). Không đọc DOM hay storage.
const SRS = {
  next(previous, correct, today) {
    const e = previous ? { ...previous } : { interval: 1, ease: 2.5, due: today, reps: 0 };
    // Đúng nhiều lần trong một ngày không kéo dài lịch.
    if (correct && e.lastReviewed === today) return null;
    if (correct) {
      e.reps = (e.reps || 0) + 1;
      e.interval = e.reps === 1 ? 1 : e.reps === 2 ? 6 : Math.round((e.interval || 1) * (e.ease || 2.5));
      e.ease = Math.min(2.5, (e.ease || 2.5) + 0.1);
    } else {
      e.reps = 0;
      e.interval = 1;
      e.ease = Math.max(1.3, (e.ease || 2.5) - 0.2);
    }
    e.interval = Math.min(365, e.interval);
    e.lastReviewed = today;
    const due = new Date(today + 'T12:00:00Z');
    due.setUTCDate(due.getUTCDate() + e.interval);
    e.due = due.toISOString().slice(0, 10);
    return e;
  }
};
