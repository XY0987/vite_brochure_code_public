# Demo 02-04 · Vitest 复用 vite.config

对应文章：[04 · Vitest：与 Vite 共享配置与转换管线](../../../../vite_brochure/第一阶段-使用篇/02-框架集成与测试/04-Vitest原生测试.md)。

## 看点

证明 Vitest **复用 `vite.config`**：路径别名 `@`、TypeScript 转译都不用再为测试单独配。

## 运行

```bash
npm install
npm run test:run   # 单次跑全部测试（CI 用）
npm run test       # watch 模式，改源码自动重跑
```

## 观察点

1. `src/math.test.ts` 用 `import { add } from '@/math'` —— 别名 `@` 来自 `vite.config.ts` 的 `resolve.alias`，**测试里零额外配置就生效**。
2. `src/dom.test.ts` 顶部 `// @vitest-environment jsdom` 把该文件切到 jsdom，于是能 `document.createElement`。
3. 跑 watch 模式时改 `src/math.ts`（比如让 `add` 返回 `a - b`），看测试秒级变红；改回即恢复。
4. 对比：若用 Jest，上面的别名、TS 都得另配一套；这里一行都没多写——这就是「与 Vite 共享转换管线」。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
