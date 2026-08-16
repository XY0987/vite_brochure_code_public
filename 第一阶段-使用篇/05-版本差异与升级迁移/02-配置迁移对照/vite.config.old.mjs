import { defineConfig } from 'vite';

// 【旧写法】Vite 5–7 时代的典型配置，照搬到 Vite 8 仍然能跑——这正是「兼容层」的价值。
// 构建照样成功、照样产出 vendor 分包（不同小版本可能附带 deprecation 提示）。
//
// 两个迁移点（旧 → 新）：
//   1. build.rollupOptions   → build.rolldownOptions
//   2. output.manualChunks   → output.advancedChunks（早期 Rolldown） → output.codeSplitting（当前）
export default defineConfig({
  build: {
    outDir: 'dist-old',
    // rollupOptions 在 Vite 8 里是 rolldownOptions 的 @deprecated 别名，仍可用。
    rollupOptions: {
      output: {
        // manualChunks：Rollup 风格的函数式分包。Rolldown 兼容它，
        // 但若同时写了 codeSplitting，manualChunks 会被忽略。
        manualChunks(id) {
          if (id.includes('vendor-like')) return 'vendor';
        },
      },
    },
  },
});
