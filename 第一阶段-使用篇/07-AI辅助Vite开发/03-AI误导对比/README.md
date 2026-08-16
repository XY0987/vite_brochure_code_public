# Demo 07-03 · AI 误导对比与配置体检

对应文章：[03 · AI 容易误导的场景](../../../../vite_brochure/第一阶段-使用篇/07-AI辅助Vite开发/03-AI容易误导的场景.md)。

## 看点

文章给了一张「AI 在 Vite 上最容易翻车」的风险地图（四类：版本 API 混淆 / 过时配置 / 插件兼容性误判 / SSR-edge 忽略）。这个 demo 把风险地图变成**可执行的体检脚本**：

- `examples/ai-stale.config.js`：AI 常给的过时/混搭写法样本（rolldownOptions 里套 manualChunks、terser 插件、裸 `/src` 别名、冗余 `cssCodeSplit: true` ……）。
- `examples/correct.config.js`：Vite 8 正解样本。
- `scripts/check-stale-config.mjs`：规则扫描，对每条可疑写法给「为什么可疑 + V8 正解方向」。

> 纯 Node，无需安装、无需联网。

## 运行

```bash
node scripts/check-stale-config.mjs examples/ai-stale.config.js   # 亮一串告警
node scripts/check-stale-config.mjs examples/correct.config.js    # 基本清白

# 体检你自己项目的配置：
node scripts/check-stale-config.mjs /你的项目/vite.config.js
```

## 观察点

1. 对 `ai-stale.config.js` 会逐条标出问题并给正解；对 `correct.config.js` 基本清白——直观感受「过时」和「当前」配置的差别。
2. 脚本会先剥离注释再匹配，避免「注释里提了 manualChunks」造成误报。
3. 脚本的定位是**提示、不是打分**：它降低漏检、把注意力引到高风险处，每条告警仍要你去 [04 节](../04-校验工具箱/) 用官方文档 / 产物验证逐条核实，确认是误报再保留。
