import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    // 默认情况下 Vite 自动发现并预构建 lodash-es，把它内部 600+ 个模块合并成一个请求。
    include: ['lodash-es'],

    // === 实验：取消下面这行注释并重启 `npm run dev`，再看浏览器 Network ===
    // 排除后 lodash-es 不再预构建，浏览器会瀑布式请求它内部的大量小文件，dev 明显变慢。
    // exclude: ['lodash-es'],
  },
});
