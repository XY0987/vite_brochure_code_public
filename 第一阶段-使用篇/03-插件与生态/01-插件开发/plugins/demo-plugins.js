// 本文件集中演示「插件开发」一节讲到的常用钩子，每个插件只聚焦一件事。
// 配套文章：第一阶段-使用篇/03-插件与生态/01-插件开发从最小插件到完整生命周期.md

// ───────────────────────────────────────────────────────────────
// 插件 1：虚拟模块（resolveId + load 配合 + \0 前缀约定）
//   让代码能 import 'virtual:build-info'，而磁盘上并不存在这个文件。
// ───────────────────────────────────────────────────────────────
export function virtualBuildInfo() {
  const virtualId = 'virtual:build-info';
  const resolvedId = '\0' + virtualId; // \0 前缀：告诉其它插件这是虚拟模块

  return {
    name: 'demo-virtual-build-info',
    resolveId(id) {
      if (id === virtualId) return resolvedId; // 认领这个 import
    },
    load(id) {
      if (id === resolvedId) {
        const info = {
          builtAt: new Date().toISOString(),
          mode: this.environment?.mode ?? 'unknown',
        };
        return `export const buildInfo = ${JSON.stringify(info)};`;
      }
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 插件 2：dev 中间件（configureServer，apply: 'serve' 只在 dev 生效）
//   起一个本地 mock 接口 /api/hello，省得为了 demo 再开后端。
// ───────────────────────────────────────────────────────────────
export function mockApi() {
  return {
    name: 'demo-mock-api',
    apply: 'serve', // 只 dev 需要，build 不挂这个中间件
    configureServer(server) {
      server.middlewares.use('/api/hello', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ msg: 'hello from mock 中间件', ts: Date.now() }));
      });
      console.log('[demo-mock-api] 已注册 /api/hello（仅 dev）');
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 插件 3：往 index.html 注入脚本（transformIndexHtml + tags 描述对象）
// ───────────────────────────────────────────────────────────────
export function injectScript() {
  return {
    name: 'demo-inject-script',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            children: `console.log('[demo-inject-script] 这段脚本由 transformIndexHtml 注入到 <head>')`,
            injectTo: 'head',
          },
        ],
      };
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 插件 4：自定义 HMR（hotUpdate，只 dev 生效）
//   改 .txt 文件时不走默认整页刷新，而是发自定义事件给客户端。
// ───────────────────────────────────────────────────────────────
export function customHmr() {
  return {
    name: 'demo-custom-hmr',
    hotUpdate({ file }) {
      if (this.environment.name !== 'client') {
        return;
      }
      if (file.endsWith('.txt')) {
        console.log('[demo-custom-hmr] 检测到 .txt 变更，发送自定义 HMR 事件：', file);
        this.environment.hot.send({
          type: 'custom',
          event: 'txt-update',
          data: { file },
        });
        return []; // 返回空数组 = 我已接管，别走默认 HMR
      }
      // 不返回 = 走 Vite 默认逻辑
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 插件 5 / 6：两个「探针」插件，演示 enforce 顺序 + build 独有钩子
// ───────────────────────────────────────────────────────────────
export function probe(label, enforce) {
  return {
    name: `demo-probe-${label}`,
    enforce, // 'pre' | undefined
    buildStart() {
      console.log(`[probe-${label}] buildStart（通用钩子，dev/build 都跑）`);
    },
    transform(code, id) {
      if (id.includes('/src/') && id.endsWith('.js')) {
        console.log(`[probe-${label}] transform: ${id.split('/src/')[1]}（enforce=${enforce ?? '默认'}）`);
      }
      return null; // 不改代码，只观察顺序
    },
    generateBundle() {
      // 只在 build 跑：dev 不会打印这行
      console.log(`[probe-${label}] generateBundle（仅 build 阶段触发）`);
    },
  };
}
