import { defineConfig } from 'vite';

// 【新写法】Vite 8 / Rolldown 当前推荐的等价配置，不再有 deprecation 警告。
//
// 注意 codeSplitting 的命名演进（典型「版本漂移」，别照抄旧文章）：
//   manualChunks（函数）   → Rollup / Vite 5–7 写法，靠回调逐个判断模块归属
//   advancedChunks（对象）  → 早期 Rolldown 引入的声明式写法，现已 @deprecated
//   codeSplitting（对象）   → 当前正式名，结构与 advancedChunks 同构
export default defineConfig({
  build: {
    outDir: 'dist-new',
    // rolldownOptions：Vite 8 的正式名（rollupOptions 是它的 deprecated 别名）。
    rolldownOptions: {
      output: {
        // codeSplitting：声明式分包。groups 里每条规则用 test 正则匹配模块路径，
        // 命中的模块被收进同名 chunk。比 manualChunks 回调更易读、也更利于工具静态分析。
        codeSplitting: {
          groups: [{ name: 'vendor', test: /vendor-like/ }],
        },
      },
    },
  },
});
