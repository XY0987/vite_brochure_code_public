import { defineConfig } from 'vite';

export default defineConfig({
  // monorepo 下 dev server 经常要访问 workspace 根、或其它包的文件。
  // server.fs.allow 把允许访问的范围放宽到 workspace 根（默认只允许项目根）。
  server: {
    fs: {
      // 往上两级到 monorepo 根（apps/web -> apps -> monorepo 根）。
      allow: ['../..'],
    },
  },

  resolve: {
    // dedupe：强制下列依赖在整个应用里只解析成「同一份」。
    // monorepo 里最常见的坑：多个包各自装了一份 react，导致
    // 「Invalid hook call / 两个 React 实例」。把易冲突的核心依赖列在这里去重。
    // 本 demo 没装 react，这里仅作演示写法。
    dedupe: ['react', 'react-dom'],
  },

  optimizeDeps: {
    // 内部 workspace 包要用「源码 + HMR」，不能被预构建成不可热更的产物。
    // Vite 默认会把软链的 workspace 包排除出预构建，这里显式声明、表明意图、防止误配。
    exclude: ['@demo/ui'],
  },
});
