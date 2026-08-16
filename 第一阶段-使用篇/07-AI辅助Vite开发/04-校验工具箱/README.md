# Demo 07-04 · 校验工具箱

对应文章：[04 · 人必须掌握的校验方法](../../../../vite_brochure/第一阶段-使用篇/07-AI辅助Vite开发/04-人必须掌握的校验方法.md)。

## 看点

文章给了校验 AI 答案的四种武器（最小复现 / 官方文档 / 源码断点 / 产物验证）。这个 demo 把其中两种「可脚本化」的武器做成工具：

- `scripts/new-min-repro.mjs`（武器一）：生成可追溯的**最小复现骨架**，含「逐步改动」清单模板，让复现过程可记录、可复用。
- `scripts/verify-build.mjs`（武器四）：对一个 `dist/` 做**客观对账**——几个 chunk、是否 vendor 分离、产物是否残留 console、资源前缀(base)是否一致。
- `示例产物/`：一份可直接对账的样本产物（已分包、已去 console、前缀一致）。

> 样本目录特意取名 `示例产物` 而非 `dist-sample`，因为仓库 `.gitignore` 忽略了 `dist-*`——叫 `dist-sample` 会进不了 git。

> 纯 Node，无需安装、无需联网。确定性来自「文件 + 内容」这些客观事实，不来自任何断言。

## 运行

```bash
# 武器四：对自带样本对账（应全部通过）
node scripts/verify-build.mjs 示例产物

# 武器一：生成一个最小复现骨架
node scripts/new-min-repro.mjs 预构建报错-某CJS包具名导入失败

# 对你的真实项目：先 vite build，再指向真实 dist
node scripts/verify-build.mjs /你的项目/dist
```

## 动手体会「产物对账抓住 AI 嘴炮」

故意把 `示例产物` 改坏，再跑 `verify-build.mjs` 看它亮红：

- 在 `示例产物/assets/index-a1b2c3.js` 里加一行 `console.log('x')` → 「生产去除 console」变 ❌。
- 删掉 `react-vendor-*.js` 只留一个 chunk → 「vendor 分离」变 ❌。
- 把 `index.html` 里某个 `/app/` 前缀改成 `/other/` → 「资源前缀一致」变 ❌。

这就是文章的核心：**AI 说「这样配会去 console / 会分包 / base 没问题」，别信，去 dist 里对账。**

## 观察点

1. 校验脚本**不依赖 AI、不联网**，全是对客观事实的检查——这正是「确定性不可外包」的落地。
2. `verify-build.mjs` 通过时也会提醒：「通过的是这几项检查，不是配置完美」——校验项要按你项目需要扩展。
3. `new-min-repro.mjs` 生成的 `STEPS.md` 把「逐步加料定位根因」固化成清单，复现成功后整目录可直接发给 AI/同事（呼应 02 节）。

> 生成的 `min-repro/` 目录是你边复现边填的工作区，可自行加进 `.gitignore` 不纳入仓库。
