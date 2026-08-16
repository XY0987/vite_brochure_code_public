# Demo 02-03 · Vue 与 Svelte 接入

对应文章：[03 · Vue 与 Svelte 接入](../../../../vite_brochure/第一阶段-使用篇/02-框架集成与测试/03-Vue与Svelte接入.md)。

本目录有两个**互相独立**的子项目，演示「同一套集成机制、不同编译器」：

- [`vue/`](./vue/)：`@vitejs/plugin-vue` + Vue 3.5（SFC 三块 + `<style scoped>` 隔离）。
- [`svelte/`](./svelte/)：`@sveltejs/vite-plugin-svelte` + Svelte 5（编译期框架、几乎无运行时）。

## 运行

分别进入子目录安装运行：

```bash
cd vue && npm install && npm run dev
# 另开一个终端
cd svelte && npm install && npm run dev
```

## 对比观察点

1. 两个项目都有计数器：点几下后改组件文案保存 → 局部更新、计数保留（各自插件的 HMR）。
2. 分别 `npm run build`，对比 `dist/` 里 JS 体积：Svelte 通常**明显更小**（无运行时）。
3. 改 `<style scoped>`（Vue）/ `<style>`（Svelte）的颜色，观察样式被 Vite 注入并作用域隔离。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
