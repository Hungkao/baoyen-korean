// Chỉ chép allowlist; không xóa đệ quy thư mục hoặc đụng tiến độ người học.
const fs = require('node:fs');
const path = require('node:path');
const assets = require('./runtime-assets.cjs');
const { syncSw } = require('./sync-sw.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
if (fs.existsSync(output)) {
  const actual = fs.readdirSync(output, { recursive: true }).filter(p => fs.statSync(path.join(output, p)).isFile());
  for (const name of actual)
    if (!assets.includes(name.replaceAll('\\', '/')))
      throw new Error('File ngoài allowlist trong dist: ' + name + '. Hãy di chuyển file đó trước khi đóng gói.');
}
// Cập nhật danh sách cache và tên cache trong sw.js trước khi chép.
if (syncSw()) console.log('Đã cập nhật danh sách/phiên bản cache trong sw.js');
for (const asset of assets) {
  const destination = path.join(output, asset);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, asset), destination);
}
console.log('Đã đóng gói ' + assets.length + ' file runtime vào ' + output);
