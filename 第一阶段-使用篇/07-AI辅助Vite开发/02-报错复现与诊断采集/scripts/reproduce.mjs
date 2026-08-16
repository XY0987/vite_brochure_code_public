// 确定性复现一个「CJS/ESM 互操作」报错现场，给你练手「怎么向 AI 描述病情」。
// 这类报错在 Vite 里表现为依赖预构建失败：
//   The requested module '/node_modules/.vite/deps/xxx.js' does not provide an export named 'foo'
// 这里用纯 Node 把同一个病根（具名导入动态导出的 CJS）复现出来，无需起 Vite。

import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const wrapper = pathToFileURL(path.resolve(here, '..', 'try-named-import.mjs')).href;

console.log('\n[reproduce] 尝试从 ESM 具名导入一个动态导出的 CommonJS 包……\n');

try {
  await import(wrapper);
  console.log('（意外：没有报错。你的 Node 版本 cjs-lexer 也许探测到了导出）');
} catch (err) {
  console.log('===== 复现到的报错（这就是你要喂给 AI 的 Stack） =====\n');
  console.log(err?.stack ?? String(err));
  console.log('\n===== 病根说明 =====');
  console.log('· 该 CJS 包用「运行时动态赋值」导出（见 bad-cjs-pkg/index.cjs），');
  console.log('  静态分析探测不到具名导出，于是具名导入失败。');
  console.log('· 在 Vite 里对应：依赖预构建无法为该包生成具名导出，需要');
  console.log('  改默认导入 `import pkg from "..."` 再取 `pkg.foo`，或配 optimizeDeps。');
  console.log('\n下一步：跑 `node scripts/collect-diagnostics.mjs`，把上面的 Stack 和环境块拼成 SCROL 提问。\n');
}
