// ============ 迁移点 A：require.context → import.meta.glob ============
// webpack 里自动批量引入一个目录下所有模块，常这么写：
//   const ctx = require.context('./pages', false, /\.js$/);
//   ctx.keys().forEach(k => { const mod = ctx(k); ... });
// 这是 webpack 专有 API，迁到 Vite 必须改写。Vite 的等价物是编译期的 import.meta.glob：
const pageModules = import.meta.glob('./pages/*.js', { eager: true });
// eager: true → 直接同步拿到模块对象（相当于一组静态 import）。
// 不加 eager 则每个值是一个返回 Promise 的懒加载函数，用于路由级代码分割。

const routes = Object.entries(pageModules).map(([file, mod]) => ({
  file,
  route: mod.route,
  render: mod.render,
}));

// ============ 迁移点 B：process.env.REACT_APP_* → import.meta.env.VITE_* ============
// CRA：process.env.REACT_APP_TITLE
// Vite：import.meta.env.VITE_APP_TITLE（定义在 .env，仅 VITE_ 前缀会暴露到客户端）
const title = import.meta.env.VITE_APP_TITLE ?? '(未设置 VITE_APP_TITLE)';

const app = document.querySelector('#app');
app.innerHTML = `
  <h1>${title}</h1>
  <p>import.meta.glob 自动收集到 ${routes.length} 个页面模块：</p>
  <ul>${routes.map((r) => `<li>${r.route} ← ${r.file}</li>`).join('')}</ul>
  <hr/>
  ${routes.map((r) => r.render()).join('')}
`;

// 控制台也打印一份，方便 dev 时核对自动收集是否生效。
console.log(
  '[迁移案例] 通过 import.meta.glob 收集到的路由：',
  routes.map((r) => r.route),
);
