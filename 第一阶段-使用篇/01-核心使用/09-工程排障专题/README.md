# Demo 09 · 工程排障专题

对应文章：[09 · 真实工程排障专题](../../../../vite_brochure/第一阶段-使用篇/01-核心使用/09-真实工程排障专题.md)。

```bash
npm install
```

## 场景 A：HMR 局部更新 vs 整页刷新

```bash
npm run dev
```
- 改 `src/counter.js` 的按钮文案（声明了 `import.meta.hot.accept`）→ 终端 **hmr update**，文案即时更新且计数不丢（状态用 `import.meta.hot.data` 传递）。
- 改 `src/global-config.js`（未声明 accept，被入口直接依赖）→ 终端 **page reload**，整页刷新。

## 场景 B：sourcemap 线上定位

```bash
npm run build && npm run preview
```
- `dist/assets/` 下生成 `.map`（`vite.config.ts` 开了 sourcemap）。
- 页面点「触发错误」按钮，devtools Console 堆栈映射回 `src/buggy-throw.js` 源码行。
- 生产实践应改用 `sourcemap: 'hidden'`，把 `.map` 上传监控平台而非部署到公网。

## 场景 C：base 路径错误复现

```bash
npm run build
npx vite preview --base /wrong/   # 资源 404，模拟 base 配错
npm run preview                   # 正确（base=/）
```

> 需要 Node ≥ 20.19 或 ≥ 22.12。
