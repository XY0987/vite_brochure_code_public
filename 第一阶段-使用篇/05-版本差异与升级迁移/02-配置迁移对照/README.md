# Demo 05-02 · 配置迁移对照

对应文章：[02 · 各版本升级要点与配置迁移](../../../../vite_brochure/第一阶段-使用篇/05-版本差异与升级迁移/02-各版本升级要点与配置迁移.md)。

## 看点

同一份源码、两份配置各构建一次，证明「旧写法靠兼容层仍能跑、新写法是当前推荐、两者产物等价」：

- `vite.config.old.mjs`：旧写法 `build.rollupOptions` + `output.manualChunks`（函数式）→ `dist-old/`
- `vite.config.new.mjs`：新写法 `build.rolldownOptions` + `output.codeSplitting`（声明式）→ `dist-new/`

两个配置文件的差异，就是一份最小的「Vite 8 配置迁移 diff」。

## 运行

```bash
npm install
npm run compare   # 各构建一次，再对比两份产物的分包结果
# 或分开跑：npm run build:old / npm run build:new
```

## 观察点

1. `dist-old` 与 `dist-new` 都拆出了 `vendor-*.js`，且内容哈希一致——新旧写法**功能等价**。
2. 对照两个 config 文件，记住改名链条：`rollupOptions→rolldownOptions`、`manualChunks(函数)→codeSplitting(声明式)`。
3. 把 `vite.config.new.mjs` 里的 `codeSplitting` 改回 `advancedChunks` 再构建——会看到 deprecation 告警，亲手验证「`advancedChunks` 已过时，正式名是 `codeSplitting`」。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
