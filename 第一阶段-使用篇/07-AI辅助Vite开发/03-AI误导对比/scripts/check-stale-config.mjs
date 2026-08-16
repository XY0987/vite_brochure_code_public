// 「AI 式过时写法」体检脚本：用规则匹配扫一份 vite.config 的源码文本，
// 把 03 节讲的四类高频误导（版本 API 混淆 / 过时配置 / 插件兼容性误判 / 冗余默认值）
// 自动标出来，并给「为什么可疑 + V8 正解方向」。
//
// 定位：这是「静态规则提示」，不是打分器。会有误报（你可能有理由保留某写法），
// 它的价值是降低漏检、把注意力引到高风险处，再由你去 04 节的方法逐条核实。
//
// 用法：
//   node scripts/check-stale-config.mjs examples/ai-stale.config.js
//   node scripts/check-stale-config.mjs /你的项目/vite.config.js

import fs from 'node:fs';
import path from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('用法: node scripts/check-stale-config.mjs <vite.config 路径>');
  process.exit(1);
}

const file = path.resolve(target);
let src;
try {
  src = fs.readFileSync(file, 'utf8');
} catch {
  console.error(`读不到文件: ${file}`);
  process.exit(1);
}

// 去掉注释，避免「注释里提到 manualChunks」造成误报。
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}
const code = stripComments(src);

// 每条规则：分类 / 触发正则 / 为什么可疑 / V8 正解方向。
const rules = [
  {
    category: '版本 API 混淆',
    test: /manualChunks/,
    why: '`manualChunks` 是 Rollup 时代的函数式分包写法。',
    fix: 'Vite 8 推荐 `build.rolldownOptions.output.codeSplitting`（按分组声明）。',
  },
  {
    category: '版本 API 混淆',
    test: /rolldownOptions[\s\S]*manualChunks/,
    why: '把 V8 新名 `rolldownOptions` 和旧 `manualChunks` 混用，是典型「缝合怪」。',
    fix: '用 `output.codeSplitting`，别在 rolldownOptions 里塞 manualChunks。',
  },
  {
    category: '版本 API 混淆（过渡名已弃）',
    test: /advancedChunks/,
    why: '`advancedChunks` 只是早期 Rolldown 的过渡名，现已 deprecated（会告警）。',
    fix: '改名为 `codeSplitting`（结构同构，放在 `rolldownOptions.output` 下）。',
  },
  {
    category: '过时配置（兼容层，非推荐）',
    test: /\brollupOptions\b/,
    why: '`rollupOptions` 在 V8 走兼容层仍能用，但不是推荐入口。',
    fix: '优先 `rolldownOptions` / `output.codeSplitting`；保留前确认确为兼容某插件所必需。',
  },
  {
    category: '插件兼容性误判（已被内置取代）',
    test: /rollup-plugin-terser|['"]terser['"]/,
    why: '压缩在 Vite 8 由内置 Oxc/Rolldown 接管，单独的 terser 插件多属冗余。',
    fix: '删掉，用 `build.minify`（默认即生效）。',
  },
  {
    category: '插件兼容性误判（已被内置取代）',
    test: /esbuild-plugin-/,
    why: 'esbuild 系转译插件在 V8（转译交给 Oxc）下多已失效或冗余。',
    fix: '确认该能力是否已被 Oxc 内置覆盖，多数可直接删除。',
  },
  {
    category: '过时配置（兼容层，非推荐）',
    test: /\besbuild\s*:\s*\{[\s\S]*\bdrop\s*:/,
    why: '顶层 `esbuild` 配置在 Vite 8 已是历史兼容入口，常规转译由 Oxc 接管；`drop` 这类选项不会作为新写法推荐。',
    fix: '不要把 `esbuild.drop` 写进新配置；如确需生产去掉 console/debugger，用当前压缩器或插件链路实现，并用产物搜索验证。',
  },
  {
    category: '插件选型（React 过渡包已弃）',
    test: /@vitejs\/plugin-react-oxc/,
    why: '`@vitejs/plugin-react-oxc` 是 Vite 8 前的 Oxc 过渡包，能力已合并进 `@vitejs/plugin-react` v6。',
    fix: 'Vite 8 新项目默认用 `@vitejs/plugin-react`；只有明确历史兼容需求才保留旧包。',
  },
  {
    category: '冗余默认值',
    test: /cssCodeSplit\s*:\s*true/,
    why: '`cssCodeSplit: true` 本就是默认值，写出来只增加维护噪音。',
    fix: '删掉——只写和默认不同的选项（见 01 节）。',
  },
  {
    category: '可疑写法',
    test: /alias\s*:\s*\{[^}]*['"]@['"]\s*:\s*['"]\/src['"]/,
    why: "别名用裸字符串绝对路径 '/src'，在某些 base/部署下解析易出问题。",
    fix: "用 `new URL('./src', import.meta.url).pathname` 或 path.resolve。",
  },
];

const hits = rules.filter((r) => r.test.test(code));

console.log(`\n===== 配置体检: ${path.relative(process.cwd(), file)} =====\n`);
if (hits.length === 0) {
  console.log('✅ 未扫到常见的 AI 式过时/可疑写法。');
  console.log('   （注意：清白不等于完美，仍建议按 04 节产物验证确认配置真生效。）\n');
  process.exit(0);
}

let i = 0;
for (const r of hits) {
  i += 1;
  console.log(`⚠️  [${i}] ${r.category}`);
  console.log(`     为什么可疑: ${r.why}`);
  console.log(`     V8 正解   : ${r.fix}\n`);
}
console.log(`共 ${hits.length} 条告警。逐条去 04 节（官方文档 / 产物验证）核实，确认是误报再保留。\n`);
