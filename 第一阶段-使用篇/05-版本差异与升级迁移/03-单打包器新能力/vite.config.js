import { defineConfig } from 'vite';

// 【Vite 8 单打包器解锁的新能力之一：更灵活的分包】
// 过去 manualChunks 是「一个回调函数里写一堆 if」；现在 codeSplitting 是「声明式的多组规则」，
// 每组可以用 test 正则匹配，还能配 minSize / maxSize / minShareCount 等阈值做精细控制。
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // 全局兜底阈值（不写则用 Rolldown 默认）：小于 minSize 的组会被合并回去，避免碎片化。
          minSize: 0,
          groups: [
            // 第一组：UI 相关「库」拆成 vendor-ui
            { name: 'vendor-ui', test: /vendor-ui/ },
            // 第二组：工具「库」拆成 vendor-utils
            { name: 'vendor-utils', test: /vendor-utils/ },
          ],
        },
      },
    },
  },

  // 【单打包器解锁的另一项能力：bundled dev（实验性）】
  // Vite 5 时代 dev 用 esbuild 预构建、不打包业务代码，build 才用 Rollup 打包，
  // 两套引擎导致「dev 正常、build 出问题」。Vite 8 dev/build 都是 Rolldown，
  // 于是可以让 dev 也走「整包模式」，让开发期行为更贴近生产。默认关闭，按需开启：
  // experimental: { bundledDev: true },
});
