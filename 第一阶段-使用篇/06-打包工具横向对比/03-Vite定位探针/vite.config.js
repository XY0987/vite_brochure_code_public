import { defineConfig, rolldownVersion, rollupVersion } from 'vite';

// 引擎探针插件：在配置解析后打印当前是 dev(serve) 还是 build，并从 vite 导出的
// rolldownVersion 真实读出打包器（而非写死），证明 dev 与 build 都跑在 Rolldown 上。
function enginePositionProbe() {
  return {
    name: 'engine-position-probe',
    configResolved(config) {
      const cmd = config.command; // 'serve'(dev) | 'build'
      const scene = cmd === 'serve' ? 'dev 开发服务器' : 'build 生产构建';
      const bundler = rolldownVersion
        ? `Rolldown v${rolldownVersion}（Vite 8 单引擎）`
        : `非 Rolldown（rollupVersion=${rollupVersion ?? '未知'}，可能是 Vite ≤7）`;
      console.log(`\n[探针] command=${cmd}（${scene}）→ 打包器：${bundler}\n`);
    },
  };
}

export default defineConfig({
  plugins: [enginePositionProbe()],
});
