import { defineConfig } from 'vite';

// 这份配置故意保留了若干「老写法」，用来给 `npm run audit` 体检脚本扫出来。
// 它们在 Vite 8 里仍能跑（兼容层），但属于升级时应当一并清理的迁移项。
export default defineConfig({
  build: {
    // 迁移项 1：rollupOptions → rolldownOptions
    rollupOptions: {
      output: {
        // 迁移项 2：manualChunks → codeSplitting
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
