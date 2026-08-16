# Demo 06-01 · 三打包器横向对比

对应文章：[01 · 五个工具各自的定位与擅长场景](../../../../vite_brochure/第一阶段-使用篇/06-打包工具横向对比/01-五个工具各自的定位与擅长场景.md)、[03 · 选型指南](../../../../vite_brochure/第一阶段-使用篇/06-打包工具横向对比/03-选型指南-什么项目用什么以及Vite的位置.md)。

## 看点

文章里说「esbuild 快、Rollup 慢、Rolldown 居中」，这里**同机同输入**跑一遍给你看，比口号直观：

- `src/` 是一份**自包含的纯 ESM 源码**（只用相对路径互相 import，不碰 node_modules），所以三个打包器都能在「零插件」前提下公平对比。
- `compare.mjs` 用三个打包器的 Node API 各打一遍同一个入口，打印**耗时 / 产物大小 / chunk 数**，并检查是否都摇掉了未使用的 `subtract`（tree-shaking）。

## 运行

```bash
npm install
npm run compare
```

输出示例（脚本已做热身 + 取最快值，数字随机器波动，但量级关系稳定）：

```
工具        耗时(ms)    产物(B)     chunk 数  tree-shaking
----------------------------------------------------------
esbuild     1.3         318         1         ✅ 已摇掉 subtract
rolldown    0.9         364         1         ✅ 已摇掉 subtract
rollup      2.5         459         1         ✅ 已摇掉 subtract
```

## 观察点

1. **耗时**：**Rollup（JS）明显最慢**；esbuild（Go）与 Rolldown（Rust）在这种小输入上都是亚毫秒级、难分高下——项目越大，原生语言对 JS 的优势越明显。
2. **tree-shaking**：三者都应把没人用的 `subtract` 摇掉，证明它们都是「会分析模块图」的真打包器。
3. **产物风格**：打开 `dist-esbuild/`、`dist-rolldown/`、`dist-rollup/` 对比生成代码，Rolldown 的产物风格刻意贴近 Rollup——这正是它「兼容 Rollup 生态」的体现。

> 需要 Node ≥ 20.19 或 ≥ 22.12。首次 `npm install` 会拉取 Rolldown 的平台原生二进制。
