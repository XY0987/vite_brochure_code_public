import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // build 后生成 dist/stats.html，treemap 直观显示各依赖体积。
    visualizer({ filename: 'dist/stats.html', gzipSize: true }),
  ],
  build: {
    rolldownOptions: {
      output: {
        // Vite 8（Rolldown）推荐写法：声明式分包。
        // 把第三方依赖单独拆成 vendor chunk，配合内容哈希实现长效缓存。
        codeSplitting: {
          groups: [{ name: 'vendor', test: /node_modules/ }],
        },
        // 旧写法（Vite 5–7 / Rollup）通过兼容层仍可用，等价于：
        // rollupOptions: { output: { manualChunks(id) {
        //   if (id.includes('node_modules')) return 'vendor';
        // } } }
        // 命名演进 manualChunks → advancedChunks(已弃) → codeSplitting 见 05 章。
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
