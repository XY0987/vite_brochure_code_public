# Demo 02-02 · React 接入与 Fast Refresh

对应文章：[02 · React 接入与 Oxc 接管 React Refresh](../../../../vite_brochure/第一阶段-使用篇/02-框架集成与测试/02-React接入与Oxc接管ReactRefresh.md)。

## 看点

用 Vite 8 官方 `@vitejs/plugin-react`（转译已对接 Rolldown/Oxc 这套 Rust 链路）跑 React，并亲手验证 **Fast Refresh 保留状态** 以及它的失效条件。

## 运行

```bash
npm install
npm run dev
```

## 观察点

1. 先点几下按钮，让 `count` 变成非零。
2. 改 `src/Counter.jsx` 的按钮文案并保存 → **文案更新、count 不归零**（Fast Refresh 生效）。

## 关键实验：让 Fast Refresh 退化

打开 `src/Counter.jsx`，**取消 `export const EXTRA = 42;` 那行注释**（给「只导出组件」的文件加了个非组件导出），再改文案保存 →
这次 **count 归零**（退化成整页刷新）。这正是「组件文件应只导出组件」的原因。

## 切换到 SWC 版对比

编辑 `vite.config.ts`，按注释把插件换成 `@vitejs/plugin-react-swc`（需 `npm i -D @vitejs/plugin-react-swc`），可对比启动与热更速度。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
