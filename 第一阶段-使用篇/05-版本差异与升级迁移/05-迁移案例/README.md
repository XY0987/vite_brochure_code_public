# Demo 05-05 · 迁移案例（webpack/CRA → Vite）

对应文章：[05 · 迁移案例：从 webpack / CRA / Vue CLI 迁到 Vite 8](../../../../vite_brochure/第一阶段-使用篇/05-版本差异与升级迁移/05-迁移案例-从webpack到Vite8.md)。

## 看点

把换工具时最高频、最容易翻车的两个**硬迁移点**做成可运行 demo（纯原生 JS，模拟 CRA 风格的多页面自动注册）：

- **`require.context` → `import.meta.glob`**：`src/main.js` 用 `import.meta.glob('./pages/*.js', { eager: true })` 自动收集 `src/pages/` 下所有页面模块，复刻 webpack 的目录自动收集。
- **`process.env.REACT_APP_*` → `import.meta.env.VITE_*`**：页面标题来自 `.env` 的 `VITE_APP_TITLE`，体现 Vite「只暴露 `VITE_` 前缀」的安全约定。

## 运行

```bash
npm install
npm run dev      # 页面列出被 import.meta.glob 自动收集到的所有页面
npm run build
```

## 观察点

1. `src/main.js` 顶部注释先给出 webpack `require.context` 原写法，紧接 Vite `import.meta.glob` 改写——对照即迁移 diff。
2. 在 `src/pages/` 新建一个 `xxx.js`（导出 `route`/`render`），不改注册代码，刷新页面——新页面自动出现，证明 glob 复刻了目录自动收集。
3. 把 `.env` 里 `VITE_APP_TITLE` 的 `VITE_` 前缀去掉再重启 dev——标题读不到了，验证「只有 `VITE_` 前缀才暴露到客户端」的安全约定。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
