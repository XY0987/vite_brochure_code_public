import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// 把 './src/xxx' 解析成绝对路径。
const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// 每个环境对应一份平台实现。
const PLATFORM_BY_ENV = {
  client: r('./src/platform/browser.js'),
  ssr: r('./src/platform/node.js'),
  edge: r('./src/platform/edge.js'),
};

// 这是 Environment API 的精髓之一：插件钩子里能通过 this.environment 拿到「当前正在构建哪个环境」。
// 同一个 import '#platform'，在 client/ssr/edge 三个环境里被解析到不同文件，
// 从而实现「一份源码、多运行时」。这比写死 alias 更贴近真实多环境插件的写法。
function platformResolver() {
  return {
    name: 'platform-resolver',
    resolveId(id) {
      if (id === '#platform') {
        const envName = this.environment?.name ?? 'client';
        return PLATFORM_BY_ENV[envName] ?? PLATFORM_BY_ENV.client;
      }
    },
  };
}

// 关键认知：Vite 6+ 把「构建目标」抽象成一个个「环境（Environment）」。
// client / ssr 是内置默认环境，edge 是我们自定义新增的环境。
// 每个环境有自己独立的：模块图、resolve（conditions 等）、build 输出。
export default defineConfig({
  plugins: [platformResolver()],

  environments: {
    // 浏览器环境：从 index.html 出发，产出可在浏览器跑的现代 ESM 包。
    client: {
      build: {
        outDir: 'dist/client',
        rolldownOptions: { input: r('./index.html') },
      },
    },

    // Node SSR 环境：产出在 Node.js 服务端调用的渲染模块。
    ssr: {
      build: {
        outDir: 'dist/ssr',
        ssr: true,
        rolldownOptions: { input: r('./src/entry-server.js') },
      },
    },

    // 边缘环境：跑在 Cloudflare Workers / Deno / Vercel Edge 这类 Web 标准运行时。
    edge: {
      resolve: {
        // 边缘运行时优先用 worker / edge 这两个导出条件来解析第三方包（package.json exports）。
        conditions: ['worker', 'edge'],
        // 边缘产物通常要求自包含，不做 externalize。
        noExternal: true,
      },
      build: {
        outDir: 'dist/edge',
        ssr: true,
        rolldownOptions: { input: r('./src/entry-edge.js') },
      },
    },
  },

  // builder.buildApp 决定「vite build 时怎么编排各环境」。
  // 默认是顺序构建；这里改成并发，演示「多环境并发构建」。
  builder: {
    async buildApp(builder) {
      await Promise.all([
        builder.build(builder.environments.client),
        builder.build(builder.environments.ssr),
        builder.build(builder.environments.edge),
      ]);
    },
  },
});
