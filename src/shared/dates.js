// Ngày theo giờ Việt Nam (YYYY-MM-DD). Hàm thuần, không đọc DOM hoặc storage.
export function localDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}
export function validDate(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value + 'T12:00:00Z')) &&
    new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value
  );
}
export function dayBefore(date) {
  const value = new Date(date + 'T12:00:00Z');
  value.setUTCDate(value.getUTCDate() - 1);
  return value.toISOString().slice(0, 10);
}
