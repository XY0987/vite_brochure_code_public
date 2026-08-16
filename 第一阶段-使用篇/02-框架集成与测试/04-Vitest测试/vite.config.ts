/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // 这个别名同时服务 dev、build 和 test —— 测试里直接 import '@/math' 即可生效
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,        // 直接用 describe/it/expect，无需每个文件 import
    environment: 'node',  // 默认 node；测 DOM 的文件用顶部注释切到 jsdom
  },
});
