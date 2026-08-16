import { defineConfig } from 'vite';
import myx from './plugins/vite-plugin-myx.js';

// 把我们手写的框架插件放进 plugins —— 和用 react()/vue() 完全一样
export default defineConfig({
  plugins: [myx()],
});
