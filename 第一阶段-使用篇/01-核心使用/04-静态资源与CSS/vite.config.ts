import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 每个 .scss 文件自动注入全局变量，无需手动 @use。
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
    // PostCSS 也可在此内联配置；本 demo 用根目录 postcss.config.js 演示自动接管。
  },
  build: {
    // 小于该阈值（字节）的资源内联为 base64，省一次请求。默认 4096。
    assetsInlineLimit: 4096,
  },
});
