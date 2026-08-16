// SSR 开发服务器：Express + Vite 中间件模式。
// 流程：读模板 → transformIndexHtml → ssrLoadModule 加载服务端入口 → 注入渲染结果 + state。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function start() {
  // 服务端密钥来自 process.env，而不是 import.meta.env。
  // 真实项目里这一步通常由 dotenv / 进程管理器（pm2、systemd、容器环境变量）完成；
  // 这里用 Vite 的 loadEnv（第三个参数 '' 表示「不限前缀、全部加载」）把 .env 里
  // 不带 VITE_ 前缀的变量也注入 process.env，模拟生产环境注入密钥。
  const env = loadEnv('development', __dirname, '');
  process.env.SECRET_API_KEY = env.SECRET_API_KEY;

  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);

      // 加载服务端入口（带编译/HMR）。
      const { render } = await vite.ssrLoadModule('/src/entry-server.js');
      const { html: appHtml, state } = await render(url);

      const html = template
        .replace('<!--ssr-outlet-->', appHtml)
        // 把 state 序列化进 HTML，客户端 window.__SSR_STATE__ 复用，避免水合不一致。
        .replace('<!--ssr-state-->', JSON.stringify(state));

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(5173, () => {
    console.log('SSR dev server: http://localhost:5173');
  });
}

start();
