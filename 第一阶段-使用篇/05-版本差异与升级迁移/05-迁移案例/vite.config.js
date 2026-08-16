import { defineConfig } from 'vite';

// 从 webpack / CRA / Vue CLI 迁移时，配置层面的常见对应关系（详见本节文章的映射表）：
//   webpack entry / output           → Vite 以 index.html 为入口，约定优于配置，通常无需写
//   webpack.DefinePlugin(env)        → import.meta.env + .env 文件（仅 VITE_ 前缀暴露到客户端）
//   resolve.alias                    → resolve.alias（写法几乎一致）
//   require.context                  → import.meta.glob（见 src/main.js）
//   devServer.proxy                  → server.proxy
//   publicPath                       → base
export default defineConfig({
  // CRA 的 PUBLIC_URL / webpack publicPath，对应这里的 base。
  base: '/',
  server: {
    // CRA/webpack devServer.proxy 的等价物。
    proxy: {
      // '/api': 'http://localhost:3000',
    },
  },
});
