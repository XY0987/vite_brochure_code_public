import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// defineConfig 只是类型包裹，让下面每个配置项都有类型提示与文档。
// 也支持传函数：({ command, mode }) => ({ ... })，按命令/模式返回不同配置（见第 03 节）。
export default defineConfig({
  // 项目根：index.html 所在目录。默认当前工作目录。
  root: process.cwd(),

  // 部署的公共基础路径。子路径部署（如 https://x.com/sub/）时必须改成 '/sub/'，
  // 否则产物里引用的 /assets/*.js 会指向域名根而 404。
  base: '/',

  // 静态资源原样拷贝目录。里面的文件不被处理、不加 hash，用 /xxx 绝对路径引用。
  publicDir: 'public',

  // 插件入口。当前 demo 不依赖框架插件；如果是 Vue/React 项目，就在这里放对应插件。
  plugins: [
    // vue(),
    // react(),
  ],

  resolve: {
    alias: {
      // 让 import x from '@/util' 指向 src/util。
      // 注意：类型解析需在 tsconfig.json 的 paths 里同步配置一份。
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  css: {
    // CSS Modules、预处理器、PostCSS 等 CSS 相关能力都在这里配置。
    // modules: {},
    // preprocessorOptions: {},
  },

  // 只有以该前缀开头的环境变量会被注入到客户端代码（防止密钥泄露）。默认即 'VITE_'。
  envPrefix: 'VITE_',

  optimizeDeps: {
    // 依赖预构建配置。需要强制包含或排除某些依赖时，再配置 include / exclude。
    // include: [],
    // exclude: [],
  },

  server: {
    port: 5173,
    open: false, // 设 true 可启动时自动打开浏览器
    host: false, // 设 true 监听 0.0.0.0，方便局域网/手机访问
    proxy: {
      // 开发期反向代理，解决跨域。仅 dev/preview 生效，生产需真实网关。
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false, // 线上排错时设 true 或 'hidden'（见第 09 节）
    // target 控制产物语法基线，baseline-widely-available 是 Vite 8 的现代默认。
    target: 'baseline-widely-available',
    // Vite 8 底层使用 Rolldown；需要控制分包时，可在这里配置 codeSplitting。
    rolldownOptions: {
      output: {
        // codeSplitting: {},
      },
    },
  },
});
