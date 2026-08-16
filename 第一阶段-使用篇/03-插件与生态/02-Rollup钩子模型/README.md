# Demo 03-02 · Rollup 钩子模型（dev vs build）

对应文章：[02 · Rollup 基础：插件钩子模型与 rollup / Vite 的关系](../../../../vite_brochure/第一阶段-使用篇/03-插件与生态/02-Rollup基础钩子模型与Vite的关系.md)。

## 看点

`plugins/hook-tracer.js` 是一个**只用 Rollup 通用钩子**的插件，在每个钩子里打印日志。同一份插件不改动，分别在 dev 和 build 跑，亲眼看到：

- **Build 阶段**钩子（`buildStart` / `resolveId` / `load` / `transform`）dev、build 都触发；
- **Output 阶段**钩子（`renderStart` / `renderChunk` / `generateBundle` / `writeBundle`）**只有 build 触发**。

## 运行

```bash
npm install
npm run build    # 看完整两阶段钩子，并在 dist/ 里多出 build-manifest.json
npm run dev      # 看 dev：只有 Build 阶段钩子，没有任何 Output 阶段钩子
```

## 观察点

1. `build` 终端日志顺序：`buildStart` → 多次 `resolveId/load/transform` → `renderStart` → `renderChunk` → `generateBundle` → `writeBundle`。
2. `generateBundle` 里用 `this.emitFile` 生成了 `dist/build-manifest.json`——Output 阶段「可增删产物」的能力，dev 做不到。
3. `dev` 终端日志里**只有** `buildStart` 和按浏览器请求触发的 `resolveId/load/transform`，`renderStart` 等一个都不出现。
4. 结论印证：dev 由 Vite 插件容器模拟 Rollup 的 Build 钩子（无 Output 阶段）；build 才把插件交给 Rolldown 跑完整两阶段。

> 提示：钩子日志打在**运行命令的终端**，不是浏览器控制台。
> 需要 Node ≥ 20.19 或 ≥ 22.12。
