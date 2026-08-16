# Demo 02-01 · 手写框架插件（迷你框架 myx）

对应文章：[01 · 框架插件集成机制](../../../../vite_brochure/第一阶段-使用篇/02-框架集成与测试/01-框架插件集成机制.md)。

## 看点

亲手写一个 Vite 插件 `plugins/vite-plugin-myx.js`，处理自定义的 `.myx` 文件，完整体验框架插件做的三件事：**编译语法 → 注入 HMR → 只处理本框架文件**。这就是 `@vitejs/plugin-react`/`-vue` 的「迷你原理版」。

## 运行

```bash
npm install
npm run dev
```

## 观察点

1. `src/App.myx` 是「框架语法」（`<template>`/`<state>`/`<setup>` 三块），浏览器本来不认识。
2. 插件在 `transform` 钩子里把它编译成标准 JS，并在末尾注入 `import.meta.hot.accept`。
3. 先点几下按钮让 count 变大，再改 `App.myx` 里的文案（如 `<h1>` 文字）保存 → **文案更新、count 不归零**（插件注入的 HMR 在保留状态）。

## 关键实验：关掉 HMR 注入，对比整页刷新

编辑 `plugins/vite-plugin-myx.js`，把「关键开关」之间的 `hmr` 那段字符串改成空：

```js
const hmr = ``;   // 原本注入 import.meta.hot.accept 的代码
```

保存后回到浏览器（这会触发一次刷新），先点几下让 count 变大，再改 `App.myx` 文案 → 这次 **整页刷新、count 归零**。亲眼对比「有没有插件接管 HMR」的差别。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
