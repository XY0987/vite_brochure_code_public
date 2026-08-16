# Demo 04-03 · SSR 四大工程坑位现场

对应文章：[03 · SSR 工程坑位排查手册](../../../../vite_brochure/第一阶段-使用篇/04-多环境与工程化场景/03-SSR工程坑位排查手册.md)。

一个 Express + Vite 中间件模式的最小 SSR，把四个最常见的 SSR 坑位做成「可观察现场」：

| 坑位 | 现场 | 涉及文件 |
|---|---|---|
| ① 水合不一致 | `buggy` 块红框、`stable` 块绿框 | `src/app.js`、`src/entry-client.js` |
| ② / ③ 条件导入 | `import.meta.env.SSR` 隔离 Node 专有代码 | `src/platform.js` |
| ④ 环境变量泄露 | `VITE_` 前缀可见、密钥只在服务端 | `.env`、`src/state.js`、`server.js` |
| 服务端外部化 | `ssr.noExternal` / `ssr.external` 注释说明 | `vite.config.js` |

## 运行

```bash
npm install
npm run dev      # http://localhost:5173
```

打开页面后**务必打开浏览器控制台**。

## 观察点

1. **水合不一致**：`#buggy` 块在客户端会被画红框，控制台打印 `[hydration mismatch]`——因为它服务端/客户端各算各的 `new Date()`。`#stable` 块绿框、`[hydration ok]`——因为时间由服务端经 `window.__SSR_STATE__` 下发、客户端复用。这就是「水合不一致」的根因与解法。
2. **条件导入**：`#platform` 块服务端显示 `服务端渲染（Node vXX）`。`src/platform.js` 里引用了 Node 专有的 `process`，但客户端**不会**报 `process is not defined`——因为该分支被 `import.meta.env.SSR` 包住，客户端构建时被裁掉了。
3. **环境变量泄露**：控制台里 `VITE_PUBLIC_TITLE` 有值，`SECRET_API_KEY` 是 `undefined`——带 `VITE_` 前缀的才会进客户端。服务端能读到密钥（页面显示「读到密钥 = true」），但 `state` 里只下发布尔值、绝不下发密钥本身。
4. **服务端外部化**：看 `vite.config.js` 里 `ssr.noExternal` / `ssr.external` 的注释——当 SSR 报 `ERR_REQUIRE_ESM` 或 `Unexpected token 'export'` 时，多半是某依赖该 `noExternal` 却被外部化了。

> 版本提示：本 demo 使用 `ssrLoadModule` 展示传统开发期 SSR 链路；它在 Vite 8 仍可运行，但源码已列入 future deprecation，底层替代方向是 Environment Runner / Module Runner。
>
> 需要 Node ≥ 20.19 或 ≥ 22.12。`.env` 里的密钥仅为演示，真实项目密钥应由进程环境注入、且不入库。
