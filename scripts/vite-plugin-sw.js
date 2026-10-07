// Sau khi build: ghi danh sách file cần cache và tên cache theo hash nội dung vào dist/sw.js.
// Vite đã gắn hash vào tên file JS/CSS, nên HTML mới không bao giờ trộn với JS cũ.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function serviceWorkerManifest() {
  let outDir;
  return {
    name: 'service-worker-manifest',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const swFile = path.join(outDir, 'sw.js');
      const files = fs
        .readdirSync(outDir, { recursive: true })
        .map(name => name.split(path.sep).join('/'))
        .filter(name => name !== 'sw.js' && fs.statSync(path.join(outDir, name)).isFile())
        .sort();
      const hash = crypto.createHash('sha256');
      for (const name of files) hash.update(name + '\0').update(fs.readFileSync(path.join(outDir, name)));
      const version = hash.digest('hex').slice(0, 10);
      const list = ['./', ...files.map(name => './' + name)].map(name => "'" + name + "'").join(', ');
      const source = fs.readFileSync(swFile, 'utf8');
      const next = source
        .replace(/^const CACHE = .*$/m, "const CACHE = 'bao-yen-shell-" + version + "';")
        .replace(/^const ASSETS = .*$/m, 'const ASSETS = [' + list + '];');
      if (next === source || !next.includes(version)) throw new Error('Không ghi được danh sách cache vào sw.js');
      fs.writeFileSync(swFile, next);
    }
  };
}
