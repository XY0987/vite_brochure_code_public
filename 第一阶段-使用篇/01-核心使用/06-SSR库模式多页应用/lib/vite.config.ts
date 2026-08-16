import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// ESM 配置里用 import.meta.url 取路径，别用 __dirname（见 09 章排障专题）。
const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: r('./src/index.js'),
      name: 'MyLib', // UMD 下挂到 window.MyLib
      fileName: (format) => `my-lib.${format}.js`,
      formats: ['es', 'umd'],
    },
    rolldownOptions: {
      // 真实库要把 peer 依赖（如 vue/react）写进 external，避免打进产物。
      // 本 demo 是纯 vanilla 库，没有外部依赖，留空即可。
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
