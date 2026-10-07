// Máy chủ phát triển, chỉ phục vụ file công khai của app.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const allowed = new Set(require('./runtime-assets.cjs'));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};
http
  .createServer((request, response) => {
    const name = new URL(request.url, 'http://localhost').pathname.slice(1) || 'index.html';
    if (!allowed.has(name) || request.method !== 'GET') {
      response.writeHead(404);
      return response.end();
    }
    fs.readFile(path.join(root, name), (error, data) => {
      if (error) {
        response.writeHead(404);
        return response.end();
      }
      response.writeHead(200, {
        'Content-Type': types[path.extname(name)] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      response.end(data);
    });
  })
  .listen(Number(process.env.PORT || 4173), '127.0.0.1', () =>
    console.log('App: http://127.0.0.1:' + (process.env.PORT || 4173))
  );
