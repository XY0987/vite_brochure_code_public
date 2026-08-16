// import.meta.env 里有 Vite 注入的环境信息。
// 这里只是给页面一点内容，方便 build 时产出真实的 chunk，观察 Rolldown 构建日志。
const out = document.querySelector('#out');
out.textContent = [
  `MODE        = ${import.meta.env.MODE}`,
  `DEV         = ${import.meta.env.DEV}`,
  `PROD        = ${import.meta.env.PROD}`,
  `BASE_URL    = ${import.meta.env.BASE_URL}`,
].join('\n');
