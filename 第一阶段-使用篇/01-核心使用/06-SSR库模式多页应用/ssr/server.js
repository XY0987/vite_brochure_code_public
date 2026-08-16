// 最小 SSR 开发服务器：Express + Vite 中间件模式。
// 核心三步：transformIndexHtml 处理模板 → ssrLoadModule 加载服务端入口 → 注入渲染结果。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function start() {
  const app = express();

  // middlewareMode：不让 Vite 起自己的 server，作为中间件嵌入 Express。
  // appType: 'custom'：不接管 index.html，由我们自己拼装 HTML。
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      // 1. 读模板，交给 Vite 注入 HMR client 等开发期处理。
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);

      // 2. 按需加载服务端入口（带编译/HMR）。
      const { render } = await vite.ssrLoadModule('/src/entry-server.js');

      // 3. 执行渲染并注入。
      const appHtml = await render(url);
      const html = template.replace('<!--ssr-outlet-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      // 让 Vite 修正错误堆栈，定位到源码位置。
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(5173, () => {
    console.log('SSR dev server: http://localhost:5173');
  });
}

start();
