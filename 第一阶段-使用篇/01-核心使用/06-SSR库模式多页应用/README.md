# Demo 01-06 · SSR / 库模式 / 多页应用

对应文章：[06 · SSR、库模式、多页应用](../../../../../vite_brochure/第一阶段-使用篇/01-核心使用/06-SSR库模式多页应用.md)。

这一节不是一个单项目，而是三个并列的最小 demo。它们共用同一个主题：同一个 Vite 工具链，如何面向不同产出形态工作。

| 子目录 | 场景 | 运行方式 | 观察点 |
|---|---|---|---|
| [`ssr/`](./ssr/README.md) | 最小 SSR 应用 | `npm install && npm run dev`；生产链路跑 `npm run build && npm run serve` | dev 下 `middlewareMode` + `ssrLoadModule`，生产下 client/server 分开构建 |
| [`lib/`](./lib/README.md) | npm 库模式 | `npm install && npm run build` | `build.lib`、外部化 peer 依赖、产物格式与 `package.json` 导出 |
| [`mpa/`](./mpa/README.md) | 多页应用 | `npm install && npm run dev/build` | 多 HTML 入口、`rolldownOptions.input`、多入口产物结构 |

## 建议顺序

先看 `ssr/`，理解 Vite 如何嵌入 Node 服务；再看 `lib/`，理解 Vite 如何产出给别人消费的包；最后看 `mpa/`，理解多个 HTML 入口如何进入同一套构建流程。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
