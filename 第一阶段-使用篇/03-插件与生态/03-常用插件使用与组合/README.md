# Demo 03-03 · 常用插件的使用与组合

对应文章：[03 · 常用官方 / 社区插件的使用与组合](../../../../vite_brochure/第一阶段-使用篇/03-插件与生态/03-常用插件的使用与组合.md)。

## 看点

在一个项目里组合多个真实插件 + 三个自写探针，体会「数组顺序 + `enforce` 分批 + `apply`/条件加载」如何共同决定行为：

- `resolve.alias`：内置的路径别名（`@` → `src`），最稳的别名方式（关于 `vite-tsconfig-paths` 与 Vite 8 内置 `resolve.tsconfigPaths` 的关系，见文章第 03 节）
- `rollup-plugin-visualizer`：构建产物体积可视化（Output 阶段，只 build，排后）
- `vite-plugin-compression2`：生成 `.gz`/`.br` 预压缩产物（同上）
- `orderProbe('PRE'|'NORMAL'|'POST')`：三个探针，演示 `enforce` 分批顺序

## 运行

```bash
npm install
npm run build    # 产物分析 + 压缩生效，dist/ 多出 stats.html 与 .gz
npm run dev      # 看 dev 下探针顺序；产物分析/压缩不生效
```

## 观察点

1. 终端里 `transform` 打印顺序：`[PRE]` → `[NORMAL]` → `[POST]`，验证 `enforce` 分批（pre→默认→post）。
2. 页面显示 `sum(1,2,3)=6`，源码用的是 `@/utils` 别名（由 `resolve.alias` 提供）。
3. `npm run build` 后：`dist/stats.html`（产物体积分析，浏览器打开看）、`dist/assets/*.gz` 与 `*.br`（压缩产物）都出现。
4. `npm run dev` 时这两个 build 期插件不生效（`vite.config` 里用 `command === 'build' && ...` 条件加载）。
5. 动手实验：把 `vite.config` 里三个探针顺序打乱、或去掉某个 `enforce`，重新 build，对比日志顺序——亲手验证排序规则。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
