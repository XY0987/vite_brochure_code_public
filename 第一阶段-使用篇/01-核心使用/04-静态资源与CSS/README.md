# Demo 04 · 静态资源与 CSS

对应文章：[04 · 静态资源、CSS、别名与路径解析](../../../../vite_brochure/第一阶段-使用篇/01-核心使用/04-静态资源CSS别名与路径解析.md)。

## 看点

- **资源两通道**：`import` 进来的 `logo.svg`（build 后带哈希）vs `public/banner.svg`（原样拷贝、无哈希）。
- **Sass**：装了 `sass` 即可，`additionalData` 自动注入全局变量。
- **CSS Modules**：`button.module.css` 类名被局部哈希化。
- **PostCSS**：根目录 `postcss.config.js` + autoprefixer 自动加前缀。
- **别名**：`@` 同时配在 `vite.config.ts` 和 `tsconfig.json`。
- **import.meta.glob**：`icons/*.svg` 演示静态资源转 URL，`modules/*.js` 演示 JS 模块懒加载。

## 运行

```bash
npm install
npm run dev
npm run build && npm run preview
```

## 建议实验

```bash
npm run build
ls dist/assets        # 看 import 进来的 logo 带哈希
ls dist               # 看 banner.svg 在根目录、无哈希
```

构建后打开产物 JS，可以对比两种 `import.meta.glob` 的结果：`?url + eager` 的 SVG 会变成资源 URL 映射；普通 JS 模块 glob 会保留成按需加载的动态 import。

删掉 `tsconfig.json` 里的 `paths`，运行 `npx tsc --noEmit`，观察 `@/...` 报类型错（但 `npm run dev` 仍正常）——验证「别名两边都要配」。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
