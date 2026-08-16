import { defineConfig } from 'vite';
import { rolldownVersion } from 'vite';

// 一个「探针插件」：在配置解析完成、以及构建开始时打印关键信息，
// 让你亲眼确认「这次 dev / build 究竟跑在什么引擎上」。
function engineProbe() {
  return {
    name: 'engine-probe',
    configResolved(config) {
      // config.command: 'serve'(dev) | 'build'
      // 重点：无论 serve 还是 build，Vite 8 用的都是同一个 Rolldown。
      console.log(
        `\n[探针] command=${config.command}  →  打包器：Rolldown v${rolldownVersion}（dev/build 统一引擎）`,
      );
    },
    buildStart() {
      console.log('[探针] buildStart：Rolldown 开始构建模块图……');
    },
  };
}

export default defineConfig({
  plugins: [engineProbe()],
});
