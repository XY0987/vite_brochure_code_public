# Demo 05-03 · 单打包器新能力（分包 + 持久缓存）

对应文章：[03 · Vite 8 单打包器解锁的新能力](../../../../vite_brochure/第一阶段-使用篇/05-版本差异与升级迁移/03-Vite8单打包器解锁的新能力.md)。
（Module Federation 能力见同级 `03b-模块联邦/`。）

## 看点

- **更灵活的分包**：`vite.config.js` 用 `codeSplitting.groups` 声明两组规则，把 `vendor-ui` 和 `vendor-utils` 拆成独立 chunk。
- **模块级持久缓存**：`scripts/cache-demo.mjs` 演示依赖预构建缓存（`node_modules/.vite/deps`）的「生成 → 跨进程命中」。

## 运行

```bash
npm install
npm run build       # 产物里出现 vendor-ui-*.js 和 vendor-utils-*.js 两个独立 chunk
npm run cache:demo  # 观察持久缓存：首次预构建生成、再次命中跳过
```

## 观察点

1. `npm run build` 产物含 `assets/vendor-ui-*.js` 与 `assets/vendor-utils-*.js`——两组 `codeSplitting` 规则各拆出独立 chunk。
2. `npm run cache:demo` 第一次输出 `Optimizing dependencies: mitt`（真在预构建），第二次输出 `Hash is consistent. Skipping.`（命中磁盘持久缓存、跳过）。
3. 试着给 `codeSplitting` 的某个 group 加上 `minSize`，把阈值调大，观察小 chunk 被合并回去——体会声明式分包的阈值控制能力。

> 需要 Node ≥ 20.19 或 ≥ 22.12。本 demo 依赖一个真实的小包 `mitt`，让依赖预构建有内容可缓存。
