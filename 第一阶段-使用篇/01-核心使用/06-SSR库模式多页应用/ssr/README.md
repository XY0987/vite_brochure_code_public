# Demo 06 / ssr · 最小 SSR

基于 Express + Vite middleware mode 的最小服务端渲染示例（vanilla，不依赖框架）。

```bash
npm install
npm run dev      # http://localhost:5173
```

看点：
- `server.js` 三步走：`transformIndexHtml`（处理模板）→ `ssrLoadModule('/src/entry-server.js')`（按需加载服务端入口）→ 用渲染结果替换 `<!--ssr-outlet-->`。
- 在浏览器「查看网页源代码」（View Source，不是 Elements 面板），能看到首屏 `<h1>` 文字是服务端直接返回的——这就是 SSR。
- `src/app.js` 是同构模块（服务端/客户端共用），刻意不使用 `window`/`document`。
- `src/entry-client.js` 负责客户端交互（仅浏览器运行），体现「服务端给首屏、客户端补交互」。

> 这是为讲清机制的最小实现。生产 SSR 还需 client/server 两次 `vite build`、外部化处理与水合一致性校验，实战通常直接用 Nuxt/SvelteKit/Astro。
>
> 版本提示：`ssrLoadModule` 在 Vite 8 仍可用于最小开发期 SSR 示例，但源码已把它列入 future deprecation；底层替代方向是 Environment Runner / Module Runner。这里保留它，是为了讲清传统 SSR 开发链路。
>
> 需要 Node ≥ 20.19 或 ≥ 22.12。
