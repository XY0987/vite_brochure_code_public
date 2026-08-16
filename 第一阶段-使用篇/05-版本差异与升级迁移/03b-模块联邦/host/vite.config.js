import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';

// 【宿主应用 host】
// 宿主自己不打包 remote 的代码，而是在运行时通过 remoteEntry.js 远程加载。
// 这样 remote 团队可以独立发版，宿主无需重新构建就能用上最新的远程模块。
export default defineConfig({
  plugins: [
    federation({
      name: 'host',
      // remotes：声明要消费哪些远程应用。
      remotes: {
        remote: {
          // type 'module'：用原生 ESM 方式加载（Vite 远程推荐）。
          type: 'module',
          name: 'remote',
          // entry：remote 部署后 remoteEntry.js 的可访问地址。
          // 本 demo 里 remote 跑在 5174 端口（见 remote/package.json 的 preview 脚本）。
          entry: 'http://localhost:5174/remoteEntry.js',
          // entryGlobalName：远程容器的全局名，要和 remote 侧的 name: 'remote' 对上。
          // 对 ESM remote 来说通常不需要手动操作它，但插件运行时会用它识别远程容器。
          entryGlobalName: 'remote',
          // shareScope：共享依赖的命名空间。React/Vue 等 shared 依赖会在这个作用域里协商复用。
          // 本 demo 没有 shared 依赖，所以它只是保留默认配置。
          shareScope: 'default',
        },
      },
      shared: [],
      dts: false,
    }),
  ],
  build: { target: 'esnext' },
  // origin：显式声明 host 本地服务自己的来源地址，供 Vite 在 dev/preview 里生成绝对资源地址。
  // 它不是“要加载的 remote 地址”；remote 的入口地址由上面的 remotes.remote.entry 决定。
  server: { origin: 'http://localhost:5173' },
});
