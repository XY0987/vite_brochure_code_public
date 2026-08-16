# Demo 05-01 · 版本探针

对应文章：[01 · 两条演进主线与版本全景](../../../../vite_brochure/第一阶段-使用篇/05-版本差异与升级迁移/01-两条演进主线与版本全景.md)。

## 看点

不要相信文章里写的版本号，跑一行命令看你**本地实际安装**的引擎版本——这是「事实基线」最硬的来源。

- `scripts/print-versions.mjs` 直接从 `vite` 包读出 `version` / `rolldownVersion` / `rollupVersion` / `esbuildVersion`。
- `vite.config.js` 里的「引擎探针」插件在 `configResolved` / `buildStart` 打印当前 `command` 与打包器，证明 dev/build 都跑在 Rolldown 上。

## 运行

```bash
npm install
npm run info     # 打印各引擎真实版本号
npm run build    # 看探针确认 build 跑在 Rolldown
npm run dev      # dev 也跑在同一个 Rolldown
```

## 观察点

1. `rolldownVersion` 有值 → Rolldown 是真打包器；`rollupVersion`/`esbuildVersion` 仍有值 → 这是兼容层/兜底，不是主力。
2. `npm run build` 时探针打印 `command=build → 打包器：Rolldown` —— build 已不再是 Rollup。
3. `npm run dev` 时探针打印 `command=serve → 打包器：Rolldown` —— dev/build 同一引擎，这是「双引擎行为不一致」问题消失的根因。

> 需要 Node ≥ 20.19 或 ≥ 22.12。首次 `npm install` 会拉取 Rolldown 的平台原生二进制。
