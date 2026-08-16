# Demo 07-01 · AI 配置上下文包

对应文章：[01 · 让 AI 生成可维护的 Vite 配置](../../../../vite_brochure/第一阶段-使用篇/07-AI辅助Vite开发/01-让AI生成可维护的Vite配置.md)。

## 看点

文章说「AI 配置的质量上限由你给的上下文决定」。这个 demo 把「给上下文」变成一条命令：

- `scripts/collect-context.mjs`：扫描项目，输出可直接粘贴给 AI 的上下文块——OS / Node / 包管理器 / **Vite 与插件的真实安装版本** / 项目类型 / 现有 `vite.config` 摘要。
- `vite.config.annotated.js`：一份「可维护配置」范例，每个非默认选项都标注「解决什么 / 默认行为 / 代价」——对照文章第一节那份「能跑但是黑洞」的配置看差别。

> 纯 Node 脚本，无需 `npm install`、无需联网，直接 `node` 跑。

## 运行

```bash
node scripts/collect-context.mjs            # 采集当前 demo 目录
node scripts/collect-context.mjs /你的项目   # 采集你自己的真实项目（推荐）
```

把输出整块粘进下面的提问模板。

## 可复制的提问模板

```
我在配置一个 Vite 项目，请帮我写/改 vite.config。

【环境与版本】
（粘 collect-context.mjs 输出的「环境与版本」段）

【现有配置】
（粘 collect-context.mjs 输出的「现有配置」段）

【我想达成的目标】
1. ……
2. ……

【约束】
- 必须用 Vite 8 官方推荐 API，旧写法请改新名并标注（如 rollupOptions→rolldownOptions、manualChunks→codeSplitting）
- 每个非默认选项加一行注释：解决什么问题、默认行为、代价
- 只写和默认不同的选项，默认够用的不要写
- 不确定的地方请明说「不确定，请查官方文档」，不要编
```

## 观察点

1. 脚本读的是 `node_modules/.../package.json` 的**真实版本**，而非 `package.json` 里的 `^8.1.0` 范围——AI 需要知道你实际装了什么。
2. 对一个空目录跑，它会提示「未找到 vite.config，可能是新项目」——说明它对新老项目都能用。
3. 对照 `vite.config.annotated.js`：好配置的标准不是代码漂亮，而是**每行都能读懂为什么在**。
