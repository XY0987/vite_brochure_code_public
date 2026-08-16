// 从 vite 包里读出它内部各引擎的真实版本号——这是「Vite 是编排层、底下踩着 Rolldown/Oxc」最硬的证据。
// 注意：Vite 8 是纯 ESM 包，直接用 import 读它导出的版本字段（不要用 require）。
import {
  version as viteVersion,
  rolldownVersion,
  rollupVersion,
  esbuildVersion,
} from 'vite';

console.log('\n===== Vite 内部引擎版本探针 =====\n');
console.log(`vite             : ${viteVersion}`);
console.log(`├─ rolldownVersion: ${rolldownVersion ?? '(无)'}（真打包器，驱动 dev + build）`);
console.log(`├─ rollupVersion  : ${rollupVersion ?? '(无)'}（兼容层，非主力）`);
console.log(`└─ esbuildVersion : ${esbuildVersion ?? '(无)'}（历史遗留，个别场景兜底）`);

console.log('\n读法：');
console.log('· rolldownVersion 有值 → Vite 8 的打包器是 Rolldown。');
console.log('· rollupVersion 仍在 → 只是兼容层（让 Rollup 插件还能用），不是主力引擎。');
console.log('· Vite 自己不打包：它把打包委托给 Rolldown、转译/压缩委托给 Oxc');
console.log('  （Oxc 内嵌于 Rolldown/Vite，没有独立 npm 包可单独读版本）。\n');
