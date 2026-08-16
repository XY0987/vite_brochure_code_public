// edge 环境入口：导出 Web 标准的 fetch handler（Cloudflare Workers / Vercel Edge 风格）。
import { renderHTML } from './shared/app.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const body = `<!doctype html><html><body><div id="app">${renderHTML(url.pathname)}</div></body></html>`;
    return new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  },
};
