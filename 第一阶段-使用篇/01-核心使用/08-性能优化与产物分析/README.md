# Demo 08 · 性能优化与产物分析

对应文章：[08 · 性能优化、产物分析与报错排查手册](../../../../vite_brochure/第一阶段-使用篇/01-核心使用/08-性能优化产物分析与报错排查手册.md)。

```bash
npm install
npm run build
```

观察：
- 终端打印各 chunk 大小：`vendor`（第三方依赖）、动态 import 的 `heavy` chunk 各自独立。
- 打开 `dist/stats.html`（visualizer 生成的 treemap）看体积大头。
- 改 `vite.config.ts` 的 `codeSplitting.groups`（或切到注释里的旧 `rollupOptions.output.manualChunks` 写法），对比 chunk 划分。

`src/main.js` 用动态 `import('./heavy.js')` 演示按需加载——`heavy` chunk 只在点击按钮时下载。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
