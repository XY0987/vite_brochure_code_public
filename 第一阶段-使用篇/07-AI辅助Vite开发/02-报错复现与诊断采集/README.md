# Demo 07-02 · 报错复现与诊断采集

对应文章：[02 · 借助 AI 排查报错](../../../../vite_brochure/第一阶段-使用篇/07-AI辅助Vite开发/02-借助AI排查报错.md)。

## 看点

文章说「排错本质是缩小可能性空间，信息越全 AI 越准」，并给出 **SCROL** 五要素提问法。这个 demo 让你练手：

- `scripts/reproduce.mjs`：**确定性复现**一个 CJS/ESM 互操作报错（Vite 依赖预构建报错最常见的病根之一），给你一个真实的报错栈练手。
- `scripts/collect-diagnostics.mjs`：一键生成 SCROL 提问骨架，自动填好 **Overview**（OS/Node/包管理器/Vite 实际版本），你只补 Stack 和 List。
- `bad-cjs-pkg/index.cjs` + `try-named-import.mjs`：复现现场的「病人」，演示动态导出的 CJS 包为什么会让具名导入失败。

> 纯 Node，无需 `npm install`、无需联网。

## 运行

```bash
node scripts/reproduce.mjs          # 复现报错，拿到真实 Stack
node scripts/collect-diagnostics.mjs # 生成提问骨架（已填好环境）
```

然后把第一步的报错栈粘进第二步骨架的【Stack】处，补上【List】，就是一条完整的 SCROL 提问。

## 观察点

1. 同一个报错，带上「CJS 包 + Node 版本 + 触发阶段」时根因（CJS/ESM 互操作）几乎一眼可辨；只贴报错那一行时像十几种问题中的任意一种——**这就是信息组织带来的定位效率差**。
2. `collect-diagnostics.mjs` 读的是 Vite 的**实际安装版本**，不是 `package.json` 的范围。
3. 骨架最后一句要求 AI「先判根因 + 给确认方法，再给修法」——把 AI 从「方案喷射器」拨回「诊断助手」。

> 想看 Vite 里的真实版本？在一个装了 Vite 的项目里跑 `node scripts/collect-diagnostics.mjs`，或对本仓库其他章节的 demo 目录跑。
