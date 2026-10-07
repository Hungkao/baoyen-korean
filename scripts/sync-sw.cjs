// Đồng bộ sw.js với allowlist runtime: tự ghi danh sách ASSETS và tên cache theo hash nội dung.
// Nhờ vậy không cần nhớ tăng phiên bản cache bằng tay: đổi bất kỳ file runtime nào là có cache mới.
// Dùng: node scripts/sync-sw.cjs          (ghi lại sw.js nếu cần)
//       node scripts/sync-sw.cjs --check  (báo lỗi nếu sw.js chưa đồng bộ)
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const assets = require('./runtime-assets.cjs');

const root = path.resolve(__dirname, '..');
const swPath = path.join(root, 'sw.js');

function expectedSw(source) {
  const hash = crypto.createHash('sha256');
  for (const asset of assets.filter(a => a !== 'sw.js')) {
    hash.update(asset + '\0');
    // Bỏ khác biệt CRLF/LF để Windows và CI ra cùng một hash.
    const data = fs.readFileSync(path.join(root, asset));
    hash.update(/\.(png)$/.test(asset) ? data : data.toString('utf8').replace(/\r\n/g, '\n'));
  }
  const version = hash.digest('hex').slice(0, 10);
  const list = ['./', ...assets.filter(a => a !== 'sw.js').map(a => './' + a)].map(a => "'" + a + "'").join(', ');
  return source
    .replace(/^const CACHE = .*$/m, "const CACHE = 'bao-yen-shell-" + version + "';")
    .replace(/^const ASSETS = \[.*\];$/m, 'const ASSETS = [' + list + '];');
}

function syncSw({ check = false } = {}) {
  const current = fs.readFileSync(swPath, 'utf8');
  const next = expectedSw(current);
  if (next === current) return false;
  if (check) throw new Error('sw.js chưa đồng bộ với runtime-assets. Chạy: node scripts/sync-sw.cjs');
  fs.writeFileSync(swPath, next);
  return true;
}

module.exports = { syncSw };
if (require.main === module) {
  try {
    console.log(syncSw({ check: process.argv.includes('--check') }) ? 'Đã cập nhật sw.js' : 'sw.js đã đồng bộ');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
