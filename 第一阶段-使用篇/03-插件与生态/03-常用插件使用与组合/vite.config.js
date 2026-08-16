import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';
import { orderProbe } from './plugins/probes.js';

// defineConfig 传函数，拿到 command 做条件加载（falsy 项会被自动过滤）。
export default defineConfig(({ command }) => ({
  // 路径别名：最稳的方式是内置 resolve.alias（任何版本都可靠）。
  // 想直接复用 tsconfig.json 的 paths：Vite 8 起内置 resolve.tsconfigPaths
  // （旧版本则用社区插件 vite-tsconfig-paths）——这本身就是
  // 「Vite 把常用插件能力逐步内置化」的真实例子，见配套文章第 03 节。
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // 探针：观察 enforce 分批顺序（pre → 默认 → post）
    orderProbe('PRE', 'pre'),
    orderProbe('NORMAL'),
    orderProbe('POST', 'post'),

    // 产物处理类排最后、且只在 build 跑：
    command === 'build' &&
      visualizer({ filename: 'stats.html', emitFile: true }),
    command === 'build' && compression(), // 生成 .gz 预压缩产物
  ],
}));
