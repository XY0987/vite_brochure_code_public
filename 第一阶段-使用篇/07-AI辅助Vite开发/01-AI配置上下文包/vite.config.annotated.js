// 「可维护配置」范例：和「能跑就行」的区别不在代码多漂亮，
// 而在每一行你都能读懂、判断、修改。每个非默认选项都标注：解决什么 / 默认行为 / 代价。
// 对应文章：01-让AI生成可维护的Vite配置.md（第四节）。
//
// 注意：这是「带说明的草稿范例」，不是可直接抄走的终稿——
// base、分包分组、是否去 console 都要结合你项目的部署方式与产物分析来定。

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 解决：部署到 CDN 子路径时，产物里的资源 URL 需要带前缀。
  // 默认：'/'（站点挂在根路径）。
  // 代价：忘了改 base 会导致线上资源 404，是上线最常见的低级错；本地 dev 不受影响，所以容易漏。
  base: '/app/',

  plugins: [react()],

  resolve: {
    // 解决：用 @ 指向 src，避免 ../../../ 这种相对路径地狱。
    // 默认：无别名。
    // 代价：必须和 tsconfig 的 paths 保持一致，否则 IDE 跳转与构建解析会各行其是。
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },

  build: {
    // 解决：把 React 运行时单独成块，利用浏览器缓存（业务代码变了，vendor 不必重下）。
    // 默认：Vite 8 / Rolldown 有自己的默认分包；不配也能跑。
    // 代价：分组太细会增加请求数；该怎么分要结合产物分析（见 08 章），不是拍脑袋。
    // 注意：Vite 8 推荐入口在 rolldownOptions.output.codeSplitting，取代了旧的 rollupOptions.output.manualChunks。
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'react-vendor', test: /node_modules\/(react|react-dom)\// }],
        },
      },
    },
  },

  esbuild: {
    // 解决：生产去掉 console/debugger，减小体积、避免泄露调试信息。
    // 默认：不丢弃。
    // 代价：dev 要保留方便调试，所以用环境判断；Vite 8 转译已由 Oxc 接管，但此选项语义仍兼容。
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
