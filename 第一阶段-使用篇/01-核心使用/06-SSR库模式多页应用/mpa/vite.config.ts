import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// ESM 配置里用 import.meta.url 取路径，别用 __dirname（见 09 章排障专题）。
const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  build: {
    rolldownOptions: {
      // 每个 HTML 是一个独立入口；公共依赖会被自动提取为共享 chunk。
      input: {
        main: r('./index.html'),
        admin: r('./admin.html'),
        login: r('./login/index.html'),
      },
    },
  },
});
