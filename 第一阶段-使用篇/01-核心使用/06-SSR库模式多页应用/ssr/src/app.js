// 同构代码：服务端与客户端共用的渲染逻辑。
// 注意：这里不要用 window/document 等仅浏览器存在的 API，否则服务端会报错。
export function renderApp(url) {
  return `
    <h1>Vite SSR demo</h1>
    <p>这段 HTML 是<strong>服务端渲染</strong>的——查看「网页源代码」能直接看到文字内容，而不是空 div。</p>
    <p>当前路径：<code>${url}</code></p>
  `;
}
