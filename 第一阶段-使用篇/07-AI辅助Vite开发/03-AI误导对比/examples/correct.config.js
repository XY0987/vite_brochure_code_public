// ✅ Vite 8 正解样本——体检脚本扫它应基本清白。
// 对照 ai-stale.config.js：用对了 plugin-react、codeSplitting，去掉了被内置取代的插件和冗余默认值。

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/app/',
  plugins: [react()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
  build: {
    // V8 推荐的分包入口：放在 rolldownOptions.output.codeSplitting 下，按分组声明而非手写 manualChunks 函数。
    // 命名演进 manualChunks → advancedChunks(已弃) → codeSplitting 见 05 章。
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'react-vendor', test: /node_modules\/(react|react-dom)\// }],
        },
      },
    },
  },
});
