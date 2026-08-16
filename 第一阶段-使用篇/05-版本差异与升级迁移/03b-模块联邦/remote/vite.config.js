import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';

// 【远程应用 remote】
// Module Federation 是「微前端」的核心机制：把一个应用编译出一个 remoteEntry.js 清单，
// 别的应用（宿主 host）运行时按需远程加载这里暴露的模块——各自独立编译、独立部署。
//
// 过去 Vite 做 MF 要靠社区插件零敲碎打；Vite 8 用单一 Rolldown 打包器后，
// 官方推荐的 @module-federation/vite 能更顺畅地接入（dev/build 同引擎，行为一致）。
export default defineConfig({
  plugins: [
    federation({
      // name：本远程应用的全局名，宿主据此引用。
      name: 'remote',
      // filename：产出的清单入口文件名，宿主用它来发现可加载的模块。
      filename: 'remoteEntry.js',
      // exposes：对外暴露哪些模块。键是「对外名」，值是本地源文件。
      exposes: {
        './widget': './src/widget.js',
      },
      // shared：与宿主共享的依赖（避免重复加载）。本 demo 是纯原生 JS，无共享依赖。
      shared: [],
      // 纯 JS demo 不需要生成联邦类型（.d.ts），关掉它避免「找不到 tsconfig.json」的告警。
      dts: false,
    }),
  ],
  // MF 产物依赖顶层 await / 动态导入等，target 设 esnext 最稳妥。
  build: { target: 'esnext' },
  // origin：显式声明 remote 本地服务自己的来源地址。
  // 这不是所有项目都必填；本 demo 用它让跨端口加载时的资源地址更直观、稳定。
  server: { origin: 'http://localhost:5174' },
});
