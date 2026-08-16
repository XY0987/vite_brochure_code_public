// ❌ 「AI 常给的过时/混搭写法」样本——专门用来喂给体检脚本，看它能不能扫出问题。
// 这份配置在 Vite 8 里很多能「跑」，但踩满了 03 节讲的四类坑。

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-oxc'; // 坑：过渡包已弃，V8 React 项目默认用 @vitejs/plugin-react v6
import { terser } from 'rollup-plugin-terser'; // 坑：压缩在 V8 由内置 Oxc/Rolldown 接管，无需此插件
import legacyEsbuildPlugin from 'esbuild-plugin-xxx'; // 坑：esbuild 系转译插件在 V8 多已无效

export default defineConfig({
  resolve: {
    alias: { '@': '/src' }, // 可疑：裸字符串绝对路径，在某些 base 下易出问题
  },
  build: {
    // 坑（版本 API 混淆）：rolldownOptions 是 V8 新名，却又套了旧的 manualChunks 函数式写法 —— 缝合怪
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'; // 还一锅端，首屏更慢
        },
      },
    },
    cssCodeSplit: true, // 冗余：这本就是默认值，写出来只是显得「专业」
  },
  esbuild: {
    // 坑：顶层 esbuild 配置在 Vite 8 已是历史兼容入口，常规转译由 Oxc 接管
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  plugins: [react(), terser(), legacyEsbuildPlugin()],
});
