// 一个【只用 Rollup 通用钩子】的插件，在每个钩子里打印日志，
// 用来对比 dev（Vite 插件容器模拟）与 build（Rolldown）下钩子的触发差异。
// 配套文章：第一阶段-使用篇/03-插件与生态/02-Rollup基础钩子模型与Vite的关系.md

function log(stage, hook, extra = '') {
  console.log(`  [${stage}] ${hook}${extra ? ' · ' + extra : ''}`);
}

export function hookTracer() {
  return {
    name: 'demo-hook-tracer',

    // ── Build 阶段（dev + build 都会跑）──────────────────────
    buildStart() {
      log('Build', 'buildStart');
    },
    resolveId(source, importer) {
      // 只打印项目内的源码模块，过滤掉海量内部/依赖模块
      if (source.startsWith('/src') || source.startsWith('./') || source.startsWith('/@')) {
        log('Build', 'resolveId', source);
      }
    },
    load(id) {
      if (id.includes('/src/')) log('Build', 'load', id.split('/src/')[1]);
    },
    transform(code, id) {
      if (id.includes('/src/')) log('Build', 'transform', id.split('/src/')[1]);
      return null;
    },

    // ── Output 阶段（只有 build 才会跑）──────────────────────
    renderStart() {
      log('Output', 'renderStart  ← 只在 build 出现');
    },
    renderChunk(code, chunk) {
      log('Output', 'renderChunk', chunk.fileName);
      return null;
    },
    generateBundle(_options, bundle) {
      log('Output', 'generateBundle', `产物数量=${Object.keys(bundle).length}`);
      // Output 阶段能力之一：往产物里再加一个文件（dev 做不到）
      this.emitFile({
        type: 'asset',
        fileName: 'build-manifest.json',
        source: JSON.stringify(
          { files: Object.keys(bundle), generatedAt: new Date().toISOString() },
          null,
          2,
        ),
      });
      log('Output', 'generateBundle', '已通过 emitFile 生成 build-manifest.json');
    },
    writeBundle() {
      log('Output', 'writeBundle  ← 产物已落盘');
    },
  };
}
