# Demo 04-04 · 部署与构建缓存

对应文章：[04 · 部署、CI 集成与构建缓存策略](../../../../vite_brochure/第一阶段-使用篇/04-多环境与工程化场景/04-部署CI集成与构建缓存策略.md)。

## 看点

把「部署 + 长效缓存」要用的几样东西放进一个最小项目：

- `base`：子路径部署前缀（`vite.config.js` 默认 `/`；`npm run build:subpath` 用 `--base=/my-app/` 覆盖）。
- `build.manifest`：生成 `.vite/manifest.json`，供后端模板按源名找带哈希的产物。
- `codeSplitting`（Vite 8 / Rolldown 分包，旧名 `advancedChunks` / `manualChunks`）：把 `vendor-like.js` 单独拆成 vendor chunk。
- 动态 `import('./big-feature.js')`：懒加载 → 独立 chunk → 按需下载。
- `build.sourcemap`：产出 `.map`，用于线上报错定位。
- `ci.example.yml`：一份可直接用的 GitHub Actions 工作流（锁 Node 版本 + 依赖缓存 + 构建产物 artifact）。

## 运行

```bash
npm install
npm run build           # 默认 base='/'
npm run build:subpath   # base='/my-app/'，对比 dist/index.html 资源前缀
npm run preview         # 本地预览构建产物
```

## 观察点

1. `dist/assets/` 里有三个 chunk：`index-*`（入口）、`vendor-*`（被 `codeSplitting` 拆出）、`big-feature-*`（动态 import 拆出）。文件名都带**内容哈希**——这是长效缓存的前提。
2. 只改 `src/main.js`、不改 `vendor-like.js`，重新 build：`vendor-*` 的哈希**不变**（缓存命中），只有 `index-*` 变。这就是「把稳定依赖拆出去」的收益。
3. `npm run build:subpath` 后看 `dist/index.html`，资源路径变成 `/my-app/assets/...`——这是子路径部署的关键，配错会 404。
4. 看 `dist/.vite/manifest.json`：记录了 `index.html`、`src/big-feature.js` 到带哈希产物的映射，含 `imports` / `dynamicImports` 依赖关系，供后端集成。
5. `dist/assets/*.js.map` 是 sourcemap；线上别公开暴露，通常只传给 Sentry 等平台。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
