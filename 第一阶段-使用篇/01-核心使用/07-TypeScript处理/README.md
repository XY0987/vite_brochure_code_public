# Demo 07 · TypeScript 处理（只转译不检查）

对应文章：[07 · TypeScript 处理](../../../../vite_brochure/第一阶段-使用篇/01-核心使用/07-TypeScript处理.md)。

`src/buggy.ts` 里**故意**有一个类型错误。

```bash
npm install

# Vite 仅转译：构建成功，类型错误被无视
npm run build:unsafe

# tsc 全量类型检查：报错，退出码非 0
npm run typecheck

# 标准做法：先 tsc 再 build，类型不过则中止
npm run build
```

把 `src/buggy.ts` 的 `wrong` 改成合法的 number 后，`npm run build` 才会通过。

结论：**`vite build` 成功 ≠ 类型正确，类型卡点要自己用 `tsc --noEmit` 补。**

> 需要 Node ≥ 20.19 或 ≥ 22.12。
