# Demo 06-02 · Oxc 转译与压缩

对应文章：[01 · 五个工具各自的定位与擅长场景](../../../../vite_brochure/第一阶段-使用篇/06-打包工具横向对比/01-五个工具各自的定位与擅长场景.md)（第八节）。

## 看点

文章反复强调一句话：**Oxc 不是打包器，是工具链**。这个 demo 把它跑出来——Oxc 输入一个文件、输出一个文件，全程没有「打包/模块图」概念。

- `src/widget.tsx` 是一段 TS + JSX 混合源码（有 `interface` / `enum` / 类型注解 / JSX），浏览器无法直接运行。
- `demo.mjs` 用 **Oxc transformer** 把它转成普通 JS（去类型、JSX → 函数调用），再用 **Oxc minifier** 压缩，打印三个阶段的代码和体积对比。

Vite 8 里，这「转译 + 压缩」两步正是从 esbuild/terser 换成了 Oxc。

## 运行

```bash
npm install
npm run demo
```

会依次打印：① 原始 TS+JSX；② 转译后（类型没了、JSX 变成 `React.createElement`）；③ 压缩后；以及体积对比。产物落在 `out.transformed.js` 与 `out.min.js`。

## 观察点

1. **转译**：`interface` / `: string` 这些**纯类型**语法在输出里消失了，JSX 变成普通函数调用——这就是「只转译、不做类型检查」（呼应 01 核心使用的 07 TypeScript 处理一节）。注意 `enum` 不是类型、会被转成运行时对象（不会消失）。
2. **压缩**：变量名变短、空白被去掉，体积明显减小。
3. **没有打包**：整个过程没有解析 `import` 去合并多个文件。Oxc 只处理「单文件」——这正是「工具链 ≠ 打包器」的铁证，也是它能被 Rolldown 当作内部零件调用的原因。

> 需要 Node ≥ 20.19 或 ≥ 22.12。`oxc-transform` / `oxc-minify` 是 Rust 实现、随平台分发原生二进制。
