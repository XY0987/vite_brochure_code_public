# Demo 04-02 · monorepo / workspace 下的 Vite

对应文章：[02 · monorepo / workspace 下的 Vite 组织与依赖处理](../../../../vite_brochure/第一阶段-使用篇/04-多环境与工程化场景/02-monorepo与workspace的Vite组织与依赖处理.md)。

## 结构

用 **npm workspaces** 搭的最小 monorepo（pnpm / yarn 同理）：

```
02-monorepo工作区/
├── package.json          # 根：workspaces 声明 + 转发脚本
├── packages/ui/          # 内部包 @demo/ui（exports 指向【源码】）
└── apps/web/             # 应用 @demo/web，import '@demo/ui'
```

## 看点

- `apps/web/src/main.js` 直接 `import { createButton } from '@demo/ui'`（按包名，不是相对路径）。
- 这条 import 能跑、能 HMR 的三个前提：① npm workspaces 把 `@demo/ui` 软链进 `node_modules`；② `@demo/ui` 的 `exports` 指向 `src/index.js` **源码**；③ Vite 顺软链拿到源码、按需编译。
- `apps/web/vite.config.js` 演示 monorepo 三件套配置：`server.fs.allow`（放行 workspace 根）、`resolve.dedupe`（核心依赖去重）、`optimizeDeps.exclude`（内部包不预构建、保住 HMR）。

## 运行

```bash
npm install      # 在本目录（monorepo 根）执行，自动建立软链
npm run dev      # 启动 @demo/web
npm run build
```

## 观察点

1. `npm install` 后看 `node_modules/@demo/ui` 是一个**软链**（symlink）指向 `packages/ui`——这就是 workspace 的本质。
2. 跑 `dev`，浏览器能看到来自 `@demo/ui` 的按钮。
3. **不重启**，改 `packages/ui/src/Button.js` 里的文字保存——页面里的按钮文字立刻更新（跨包 HMR）。这只有在内部包 `exports` 指向源码时才成立。
4. 把 `packages/ui/package.json` 的 `exports` 改成指向一个打包产物（模拟「内部包只发构建产物」），就会发现改源码不再热更——这正是真实项目里「内部包改了不生效」的根因。
5. `npm run build` 的 `transforming` 计数里包含了内部包的源码模块（说明它和应用源码一起被编译，而非作为外部依赖）。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
