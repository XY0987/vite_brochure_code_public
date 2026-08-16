# Demo 06 / mpa · 多页应用

```bash
npm install
npm run dev       # 访问 / 、/admin.html 、/login/
npm run build     # 看 dist 下分别产出 index/admin/login 三个页面 + 共享 chunk
npm run preview
```

看点：
- `rolldownOptions.input` 登记三个 HTML 入口。
- `shared/log.js` 被三个页面共用，build 后被提取为共享 chunk（只下载一次）。
- 产物路径跟随源码目录：`login/index.html` → `dist/login/index.html`。

> 需要 Node ≥ 20.19 或 ≥ 22.12。
