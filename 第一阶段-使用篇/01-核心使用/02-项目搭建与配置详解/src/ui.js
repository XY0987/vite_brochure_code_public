export function render(el) {
  // import.meta.env.BASE_URL 来自配置里的 base，便于直观感受 base 的作用。
  el.innerHTML = `
    <h1>配置详解 demo</h1>
    <p>当前 base：<code>${import.meta.env.BASE_URL}</code></p>
    <p>当前模式：<code>${import.meta.env.MODE}</code></p>
    <p>试试把 vite.config.ts 的 base 改成 /sub/ 后 build + preview，观察资源路径变化。</p>
  `;
}
