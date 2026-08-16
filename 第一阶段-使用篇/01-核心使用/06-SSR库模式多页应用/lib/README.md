# Demo 06 / lib · 库模式

```bash
npm install
npm run build
ls dist        # my-lib.es.js（ESM） + my-lib.umd.js（UMD）
```

看点：
- `build.lib` 一次产出 ESM + UMD 两种格式。
- `package.json` 的 `exports`/`main`/`module` 声明入口，决定 `import`/`require` 各拿哪个文件。
- 真实库需把 peer 依赖放进 `rolldownOptions.external`（旧名 `rollupOptions.external` 仍有兼容层），并用 `vite-plugin-dts` 生成 `.d.ts`（本 demo 为纯 vanilla，未引入）。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
