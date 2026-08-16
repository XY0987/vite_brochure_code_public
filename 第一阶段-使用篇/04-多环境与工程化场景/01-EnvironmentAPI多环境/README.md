# Demo 04-01 · Environment API 多环境多运行时

对应文章：[01 · Environment API 落地：从单一 client/ssr 到 client / ssr / edge](../../../../vite_brochure/第一阶段-使用篇/04-多环境与工程化场景/01-EnvironmentAPI落地多环境多运行时.md)。

## 看点

一份 `vite.config.js` 声明了三个环境（`client` / `ssr` / `edge`），并发构建出三套产物：

- 同一个共享业务文件 `src/shared/app.js` 里 `import '#platform'`，在三个环境里分别被解析到 `browser.js` / `node.js` / `edge.js`——「一份源码、多运行时」。
- 解析靠 `vite.config.js` 里的 `platformResolver` 插件，关键是它在 `resolveId` 里读 `this.environment.name` 判断当前在构建哪个环境。
- `builder.buildApp` 把三个环境改成 `Promise.all` 并发构建。

## 运行

```bash
npm install
npm run build       # 并发构建 client / ssr / edge 三个环境
npm run start:ssr   # 直接调用 ssr 产物，打印 Node 运行时渲染结果
npm run start:edge  # 用 Web 标准 Request/Response 模拟一次边缘请求
# 或一条龙：npm run show
```

## 观察点

1. `npm run build` 终端里同时出现 `building client / ssr / edge environment`，且各自输出到 `dist/client`、`dist/ssr`、`dist/edge`——这就是「多环境」。
2. `npm run start:ssr` 打印 `Hello from node vXX`，`npm run start:edge` 打印 `Hello from edge (Web/Worker runtime)`——同一份 `app.js`，运行时不同——这就是「多运行时」。
3. 打开 `dist/ssr/entry-server.js` 和 `dist/edge/entry-edge.js`，会看到打进去的平台实现确实不同（一个含 `process.version`，一个不含）。
4. 把 `vite.config.js` 里 `builder.buildApp` 的 `Promise.all` 改成顺序 `await`，对比构建日志顺序变化——验证 `buildApp` 控制的是「环境编排」。

> 需要 Node ≥ 20.19 或 ≥ 22.12。Vite 8 默认 Rolldown 打包器，首次 `npm install` 会拉取对应平台的 Rust 原生二进制。
