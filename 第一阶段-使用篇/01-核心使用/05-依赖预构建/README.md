# Demo 05 · 依赖预构建

对应文章：[05 · 依赖预构建](../../../../vite_brochure/第一阶段-使用篇/01-核心使用/05-依赖预构建.md)。

## 看点

用 `lodash-es`（内部 600+ 模块）直观感受预构建的「请求合并」。

## 运行

```bash
npm install
npm run dev
```

观察：
1. 首次启动终端打印预构建信息。`ls node_modules/.vite/deps` 看产物。
2. 浏览器 Network（JS 过滤）里 lodash-es 是**一个** `deps/lodash-es.js?v=...` 请求。

## 关键实验：关掉预构建对比

编辑 `vite.config.ts`，取消 `exclude: ['lodash-es']` 的注释，然后：

```bash
rm -rf node_modules/.vite   # 清缓存
npm run dev
```

再看 Network——lodash-es 变成**几百个**内部小文件请求，dev 明显变慢。这就是预构建的价值。

强制重建：

```bash
npm run dev -- --force
```

> 需要 Node ≥ 20.19 或 ≥ 22.12。
