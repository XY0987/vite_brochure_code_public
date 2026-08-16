// 服务端入口：被 server.js 的 ssrLoadModule 加载并调用。
import { renderApp } from './app.js';

export async function render(url) {
  // import.meta.env.SSR 在此处为 true，可据此隔离平台相关逻辑。
  return renderApp(url);
}
