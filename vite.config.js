import { defineConfig } from 'vite';
import { serviceWorkerManifest } from './scripts/vite-plugin-sw.js';

export default defineConfig({
  // Đường dẫn tương đối để app chạy được ở tên miền gốc hoặc thư mục con.
  base: './',
  plugins: [serviceWorkerManifest()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Giữ tiền tố -webkit- (vd. backdrop-filter) cho iPhone/Safari đời cũ khi nén CSS.
    cssTarget: ['safari14', 'ios14', 'chrome100', 'firefox100']
  },
  server: { port: 5173, host: '127.0.0.1' },
  preview: { port: 4173, host: '127.0.0.1', strictPort: true }
});
