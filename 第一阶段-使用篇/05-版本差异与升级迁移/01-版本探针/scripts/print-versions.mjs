// 直接从 vite 包里读出它内部各引擎的真实版本号。
// 这是「事实基线」最硬的来源——不要相信文章里写的版本，跑这一行看你本地装的是什么。
//
// 关键点：Vite 8 把构建打包器从 Rollup(JS) 换成了 Rolldown(Rust)，
// 但为了向后兼容，仍然导出 `rollupVersion`（兼容层）和 `esbuildVersion`（个别转换仍可能用到）。
// 真正驱动 dev + build 的是 Rolldown；转译/压缩由 Oxc 接管。

import {
  version as viteVersion,
  rolldownVersion,
  rollupVersion,
  esbuildVersion,
} from 'vite';

const rows = [
  ['Vite', viteVersion, '主框架版本（决定 Environment API / 默认打包器等能力边界）'],
  ['Rolldown', rolldownVersion, 'Vite 8 默认唯一打包器（Rust），同时驱动 dev 与 build'],
  ['Rollup(兼容)', rollupVersion, '兼容层报告的 Rollup API 版本，老插件据此判断能力，不再是真打包器'],
  ['esbuild', esbuildVersion, '历史遗留依赖，Vite 8 转译主力已是 Oxc，这里仅个别场景兜底'],
];

console.log('\n=== 当前环境 Vite 引擎版本全景（事实基线） ===\n');
for (const [name, ver, note] of rows) {
  console.log(`${name.padEnd(14)} ${String(ver).padEnd(12)} ${note}`);
}
console.log(
  '\n解读：dev 与 build 都跑在 Rolldown 上 → 不再有「Vite 5 时代 esbuild(dev) 和 Rollup(build) 行为不一致」的老问题。\n',
);
