# Demo 02 · vite.config 逐项注释范本

对应文章：[02 · 项目搭建与 vite.config 完整配置详解](../../../../vite_brochure/第一阶段-使用篇/01-核心使用/02-项目搭建与vite.config配置详解.md)。

## 看点

`vite.config.ts` 里每一项都有注释，说明它「管什么、默认值、什么时候改」。重点演示：
- `resolve.alias` 的 `@` 别名（同时在 `tsconfig.json` 的 `paths` 配了一份）。
- `base` 对资源路径的影响。
- `server.proxy`、`envPrefix` 等高频项。

## 运行

```bash
npm install
npm run dev
npm run build && npm run preview
```

## 建议实验

1. 把 `vite.config.ts` 的 `base` 改成 `/sub/`，重新 `build` 后看 `dist/index.html` 里资源路径变成 `/sub/assets/...`。
2. 删掉 `resolve.alias` 里的 `@`，`npm run dev` 看 `import '@/ui.js'` 如何解析失败——理解别名解决的问题。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
