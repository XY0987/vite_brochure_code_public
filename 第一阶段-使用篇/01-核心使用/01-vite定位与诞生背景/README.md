# Demo 01 · 按需编译 vs 打包

对应文章：[01 · Vite 的定位与诞生背景](../../../../vite_brochure/第一阶段-使用篇/01-核心使用/01-Vite定位与诞生背景.md) 第六节。

## 这个 demo 演示什么

用一个被拆成多个小模块的页面，直观对比：
- **dev 模式**：每个模块一条独立网络请求，dev server 按需编译返回（不打包）。
- **build 模式**：所有模块被打进少数带哈希的 chunk（打包）。

## 运行

```bash
npm install
npm run dev
```

打开浏览器开发者工具 → Network → 按 JS 过滤 → 刷新页面，观察：
1. `index.html` → `/src/main.js` → 逐个 `modules/feature-*.js` 的独立请求。
2. 注释掉 `src/main.js` 里任意一行 `import` 再刷新，对应模块的请求消失（按需 = 没用到就不编译）。

再对比生产构建：

```bash
npm run build
npm run preview
```

此时 `modules/*.js` 不再单独出现，已被打包进 `dist/assets/*.js`。`dist` 目录里可以看到带 hash 的产物文件。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
