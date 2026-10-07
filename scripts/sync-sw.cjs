// Đồng bộ phiên bản tài nguyên sau mỗi lần sửa code:
// 1. index.html: gắn ?v=<hash nội dung> vào mọi thẻ <script>/<link> trỏ tới file JS/CSS trong allowlist.
//    Nhờ vậy CDN (Cloudflare) và trình duyệt luôn tải file mới, không trộn JS cũ với HTML mới.
// 2. sw.js: ghi danh sách ASSETS (cùng ?v=) và tên cache theo hash toàn bộ runtime.
// Dùng: node scripts/sync-sw.cjs          (ghi lại nếu cần)
//       node scripts/sync-sw.cjs --check  (báo lỗi nếu chưa đồng bộ)
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const assets = require('./runtime-assets.cjs');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name));
const versioned = name => /\.(js|css)$/.test(name) && name !== 'sw.js';

// Bỏ khác biệt CRLF/LF để Windows và CI ra cùng một hash.
function normalized(name) {
  const data = read(name);
  return /\.png$/.test(name) ? data : data.toString('utf8').replace(/\r\n/g, '\n');
}
function fileHash(name) {
  return crypto.createHash('sha256').update(normalized(name)).digest('hex').slice(0, 10);
}

function expectedIndex(html) {
  return html.replace(
    /(<(?:script|link)\b[^>]*?\b(?:src|href)=")([^"?#]+)(?:\?v=[0-9a-f]+)?"/g,
    (match, start, name) =>
      assets.includes(name) && versioned(name) ? start + name + '?v=' + fileHash(name) + '"' : match
  );
}

function expectedSw(source) {
  // index.html phải được đồng bộ trước để hash cache phản ánh đúng HTML sẽ phát hành.
  const hash = crypto.createHash('sha256');
  for (const asset of assets.filter(a => a !== 'sw.js')) hash.update(asset + '\0').update(normalized(asset));
  const version = hash.digest('hex').slice(0, 10);
  const list = [
    './',
    ...assets.filter(a => a !== 'sw.js').map(a => './' + a + (versioned(a) ? '?v=' + fileHash(a) : ''))
  ]
    .map(a => "'" + a + "'")
    .join(', ');
  return source
    .replace(/^const CACHE = .*$/m, "const CACHE = 'bao-yen-shell-" + version + "';")
    .replace(/^const ASSETS = \[.*\];$/m, 'const ASSETS = [' + list + '];');
}

function syncFile(name, transform, check) {
  const file = path.join(root, name);
  const current = fs.readFileSync(file, 'utf8');
  const next = transform(current);
  if (next === current) return false;
  if (check) throw new Error(name + ' chưa đồng bộ phiên bản tài nguyên. Chạy: npm run build');
  fs.writeFileSync(file, next);
  return true;
}

function syncSw({ check = false } = {}) {
  const index = syncFile('index.html', expectedIndex, check);
  const sw = syncFile('sw.js', expectedSw, check);
  return index || sw;
}

module.exports = { syncSw };
if (require.main === module) {
  try {
    console.log(
      syncSw({ check: process.argv.includes('--check') })
        ? 'Đã cập nhật index.html/sw.js'
        : 'Phiên bản tài nguyên đã đồng bộ'
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
