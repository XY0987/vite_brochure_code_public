import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // 'hidden'：生成 .map 但产物里不写 sourceMappingURL，适合上传监控平台。
    // 本 demo 用 true 方便你在 preview 的 devtools 里直接看到源码映射。
    sourcemap: true,
  },
});
