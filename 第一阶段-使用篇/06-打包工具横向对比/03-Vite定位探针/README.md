# Demo 06-03 · Vite 定位探针

对应文章：[02 · 它们的关系](../../../../vite_brochure/第一阶段-使用篇/06-打包工具横向对比/02-它们的关系-谁负责dev谁负责build谁在取代谁.md)（第七节）、[03 · 选型指南](../../../../vite_brochure/第一阶段-使用篇/06-打包工具横向对比/03-选型指南-什么项目用什么以及Vite的位置.md)。

## 看点

文章说「Vite 不是打包器，是编排层；它把 dev 和 build 都委托给同一个 Rolldown」。这个 demo 把它跑出来：

- `scripts/print-versions.mjs` 从 `vite` 包读出 `rolldownVersion` / `rollupVersion`，证明底层打包器是 Rolldown、Rollup 只剩兼容层。
- `vite.config.js` 里的「引擎探针」插件在 `configResolved` 打印当前是 `serve`(dev) 还是 `build`，两次都指向 Rolldown——这就是「单引擎」。

> 它和第 05 章的「版本探针」是同一类工具，只是换成「工具关系 / Vite 定位」的视角来读。

## 运行

```bash
npm install
npm run info     # 打印 Vite 内部各引擎真实版本
npm run build    # 探针打印 command=build → Rolldown
npm run dev      # 探针打印 command=serve → Rolldown（与 build 同一引擎）
```

## 观察点

1. `npm run info`：`rolldownVersion` 有值（真打包器），`rollupVersion` 仍在（兼容层）——印证「Rolldown 取代 Rollup，但留兼容层让旧插件可用」。
2. `npm run build` 与 `npm run dev` 都打印 `Rolldown`——dev/build 收敛到**单引擎**，历史「双引擎行为不一致」的病根被消除。
3. 结合文章理解：Vite 自己不打包，它站在 Rolldown（打包）+ Oxc（转译/压缩）之上做编排。

> 需要 Node ≥ 20.19 或 ≥ 22.12。首次 `npm install` 会拉取 Rolldown 平台原生二进制。
