// ssr 环境入口：跑在 Node.js，导出 render 供服务端调用。
import { renderHTML } from './shared/app.js';

export function render(url = '/') {
  return `<!doctype html><html><body><div id="app">${renderHTML(url)}</div></body></html>`;
}
