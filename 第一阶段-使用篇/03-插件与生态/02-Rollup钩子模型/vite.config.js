import { defineConfig } from 'vite';
import { hookTracer } from './plugins/hook-tracer.js';

// 同一个插件，dev 和 build 都不改动：
//  - dev：由 Vite 的 PluginContainer 模拟 Rollup 的 Build 钩子（无 Output 阶段）
//  - build：交给 Rolldown，完整跑 Build + Output 两阶段
export default defineConfig({
  plugins: [hookTracer()],
});
