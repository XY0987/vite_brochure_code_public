# Demo 03-01 · 插件开发（钩子全家桶）

对应文章：[01 · 插件开发：从最小插件到完整生命周期与常用钩子](../../../../vite_brochure/第一阶段-使用篇/03-插件与生态/01-插件开发从最小插件到完整生命周期.md)。

## 看点

把一节里讲到的常用钩子集中到一个可跑项目里，每个插件聚焦一件事（见 `plugins/demo-plugins.js`）：

- `virtualBuildInfo`：虚拟模块（`resolveId` + `load` + `\0` 前缀）
- `mockApi`：dev 中间件（`configureServer`，`apply: 'serve'`）
- `injectScript`：HTML 注入（`transformIndexHtml`）
- `customHmr`：自定义热更新（`hotUpdate`）
- `probe`：两个探针插件，演示 `enforce` 顺序 + build 独有钩子（`generateBundle`）

## 运行

```bash
npm install
npm run dev      # 体验虚拟模块 / mock 接口 / HTML 注入 / 自定义 HMR
npm run build    # 看 build 独有钩子（generateBundle）打印的日志
```

## 观察点

1. 页面上的「构建/启动信息」来自 `import 'virtual:build-info'`——磁盘上不存在的虚拟模块。
2. 点按钮请求 `/api/hello` 拿到 mock 数据——来自 `configureServer`；`npm run build` 不会挂这个中间件。
3. 控制台有一条 `[demo-inject-script]` 日志——来自注入到 `<head>` 的脚本。
4. 改 `src/notes.txt` 保存 → 控制台打印自定义 HMR 事件，页面不整页刷新——来自 `hotUpdate`。
5. 对比两条命令的终端输出：`dev` 有 `configureServer` 日志、**没有** `generateBundle`；`build` 反之。这就是「dev 独有 vs build 独有」。
6. 终端里 `[probe-A]`（`enforce: 'pre'`）的 `transform` 早于 `[probe-B]`（默认），验证执行顺序。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
