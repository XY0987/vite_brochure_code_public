import { defineConfig } from 'vite';

// Vite 8 官方 React 插件：在 Vite 8 里转译/Refresh 走 Rust 工具链（Rolldown/Oxc 体系）。
import react from '@vitejs/plugin-react';

// 明确想要 SWC 链路时，可换成：
// import react from '@vitejs/plugin-react-swc';
// 注：@vitejs/plugin-react-oxc 的能力已合并进 @vitejs/plugin-react v6，独立包已 deprecated。

export default defineConfig({
  plugins: [react()],
});
