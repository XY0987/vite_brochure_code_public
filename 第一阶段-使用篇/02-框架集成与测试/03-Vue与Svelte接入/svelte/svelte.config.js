import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// 即使是最小配置，也建议保留本文件——插件会读取它（preprocess、编译选项等）
export default {
  preprocess: vitePreprocess(),
};
