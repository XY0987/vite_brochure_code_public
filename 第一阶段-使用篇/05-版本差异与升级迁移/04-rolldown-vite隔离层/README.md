# Demo 05-04 · rolldown-vite 隔离层 + 升级体检

对应文章：[04 · 企业升级实战：从 Vite 5 渐进式升级](../../../../vite_brochure/第一阶段-使用篇/05-版本差异与升级迁移/04-企业升级实战-从Vite5渐进升级.md)。

## 看点

- **升级体检脚本**：`scripts/upgrade-audit.mjs` 用一张「正则规则表」扫描 `vite.config.*`，圈出从 Vite 5/6/7 升 8 的迁移热点。可接进 CI。
- **rolldown-vite 隔离层**：`package.rolldown-vite.example.json` 给出「用 `package.json` 的 `overrides` 把 `vite` 别名到 `rolldown-vite`」的 drop-in 写法——零改代码换引擎、出问题秒回滚。（本目录的 `package.json` 保持 `vite@8` 以便直接运行，隔离层写法单独放进示例文件。）
- `vite.config.js` 故意保留 `rollupOptions + manualChunks` 两处老写法，既给体检脚本扫，又证明它们在 Vite 8 兼容层下仍能跑。

## 运行

```bash
npm install
npm run audit    # 体检：扫描本目录 vite.config，列出迁移项
npm run build    # 证明：老写法靠兼容层仍能正常构建
```

## 观察点

1. `npm run audit` 圈出 `rollupOptions` 和 `manualChunks` 两处迁移项及建议——这就是「升级前先圈热点」。
2. `npm run build` 仍然成功——验证「先靠兼容层让项目跑起来」是可行的第一步。
3. 打开 `package.rolldown-vite.example.json`，对照文章第三节的 `overrides` 写法，理解「隔离层 = 一段可增删的依赖重定向，删掉即回滚」。
4. 按 audit 建议把两处老写法改成 `rolldownOptions`/`codeSplitting`，再跑 `npm run audit`，看迁移项归零——体会「逐项消项」的迁移节奏。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
