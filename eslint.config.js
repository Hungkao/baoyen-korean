import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'node_modules/', 'docs/'] },
  js.configs.recommended,
  { rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } },
  {
    files: ['src/**/*.js', 'vite.config.js', 'eslint.config.js'],
    languageOptions: { sourceType: 'module', globals: globals.browser },
    rules: {
      // Tên dễ nhầm với biến toàn cục của trình duyệt (window.screen, window.name…).
      'no-restricted-globals': [
        'error',
        'screen',
        'name',
        'status',
        'event',
        'top',
        'parent',
        'length',
        'close',
        'open',
        'origin',
        'self'
      ]
    }
  },
  // Ranh giới lớp (ARCHITECTURE.md): lớp dưới không import lớp trên.
  {
    files: ['src/content/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../domain/**',
                '../data/**',
                '../api/**',
                '../services/**',
                '../app/**',
                '../features/**',
                '../shared/**'
              ],
              message: 'content/ chỉ chứa dữ liệu.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/shared/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../content/**',
                '../domain/**',
                '../data/**',
                '../api/**',
                '../services/**',
                '../app/**',
                '../features/**'
              ],
              message: 'shared/ không phụ thuộc lớp nào.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/domain/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../data/**', '../api/**', '../services/**', '../app/**', '../features/**'],
              message: 'domain/ là logic thuần, không chạm storage, mạng hay UI.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/data/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../api/**', '../services/**', '../app/**', '../features/**'],
              message: 'data/ không chạm UI hay backend.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['public/sw.js'],
    languageOptions: { sourceType: 'script', globals: globals.serviceworker }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser, __app: 'readonly' } }
  }
];
