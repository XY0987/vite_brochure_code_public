import { defineConfig } from 'vite';

export default defineConfig({
  // base：产物里资源引用的「公共前缀」。
  //   - 部署在域名根（https://cdn.com/）→ 默认 '/'
  //   - 部署在子路径（https://cdn.com/my-app/）→ 设成 '/my-app/'，否则线上资源 404
  //   本 demo 默认 '/'；执行 `npm run build:subpath` 会用 --base=/my-app/ 覆盖，
  //   对比 dist/index.html 里资源路径前缀的变化。
  base: '/',

  build: {
    // 生成 .vite/manifest.json：记录「源文件 → 带哈希产物」的映射，
    // 供后端模板（Rails / Laravel / 自研 SSR）按源名找到带哈希的真实文件名。
    manifest: true,

    // 生产 sourcemap：用于线上报错定位。注意别把 .map 暴露给公网用户，
    // 通常只上传到 Sentry 等错误平台。
    sourcemap: true,

    rolldownOptions: {
      output: {
        // Vite 8（Rolldown）的分包能力：output.codeSplitting。
        // 把「很少变动」的模块单独拆成 vendor chunk，业务代码改动不影响它的哈希，
        // 用户浏览器缓存继续命中 —— 这是长效缓存的核心手段。
        //
        // 命名演进（典型的版本漂移，注意别照抄旧文章）：
        //   manualChunks(函数)  →  Vite 5–7 / Rollup 写法
        //   advancedChunks      →  Rolldown 早期名（现已 deprecated，会告警）
        //   codeSplitting       →  当前名（{ groups: [...] } 同构）
        codeSplitting: {
          groups: [
            { name: 'vendor', test: /vendor-like/ },
          ],
        },

        // 旧版（Vite 5–7 / Rollup）等价写法，Vite 8 仍通过兼容层支持：
        // manualChunks(id) {
        //   if (id.includes('vendor-like')) return 'vendor';
        // },
      },
    },
  },
});
