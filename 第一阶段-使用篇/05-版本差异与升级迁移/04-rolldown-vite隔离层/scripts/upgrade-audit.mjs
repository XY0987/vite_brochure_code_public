// 升级体检脚本：扫描项目里的 vite 配置文件，找出从 Vite 5/6/7 升级到 Vite 8 时
// 应当处理的「过时写法」，并给出迁移建议。这是企业升级前「风险评估」最轻量的一步——
// 先把确定要改的点列清楚，再决定升级节奏。
//
// 用法：node scripts/upgrade-audit.mjs [要扫描的目录，默认当前目录]
// 注意：这是个教学用的静态文本扫描器，不替代真实构建验证，但能快速圈出迁移热点。

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.argv[2] ?? process.cwd();

// 规则表：每条规则 = 正则 + 等级 + 说明 + 建议
const RULES = [
  {
    re: /\brollupOptions\b/,
    level: '提示',
    what: 'build.rollupOptions 是 rolldownOptions 的 deprecated 别名',
    fix: '重命名为 build.rolldownOptions（语义一致，可直接改名）',
  },
  {
    re: /\bmanualChunks\b/,
    level: '提示',
    what: 'output.manualChunks 是 Rollup 风格的函数式分包',
    fix: '迁移到声明式的 output.codeSplitting: { groups: [{ name, test }] }',
  },
  {
    re: /\badvancedChunks\b/,
    level: '警告',
    what: 'output.advancedChunks 是早期 Rolldown 名，现已 deprecated',
    fix: '改用 output.codeSplitting（二者结构同构，直接改名即可）',
  },
  {
    re: /@vitejs\/plugin-react-oxc/,
    level: '提示',
    what: '@vitejs/plugin-react-oxc 是 Oxc 过渡包，已 deprecated',
    fix: '迁回 @vitejs/plugin-react v6（已用 Oxc 接管 React Refresh transform）',
  },
  {
    re: /\bbuild\s*:\s*\{[^}]*\bpolyfillModulePreload\b/s,
    level: '警告',
    what: 'polyfillModulePreload 在新版本已更名/废弃',
    fix: '改用 build.modulePreload.polyfill',
  },
];

function collectConfigFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      collectConfigFiles(full, acc);
    } else if (/^vite\.config\./.test(name) && ['.js', '.ts', '.mjs', '.cjs'].includes(extname(name))) {
      acc.push(full);
    }
  }
  return acc;
}

console.log('\n=== Vite 8 升级体检 ===');
console.log(`扫描根目录：${root}\n`);

const files = collectConfigFiles(root);
if (files.length === 0) {
  console.log('未发现 vite.config.* 文件。');
  process.exit(0);
}

let total = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const hits = RULES.filter((r) => r.re.test(text));
  if (hits.length === 0) continue;
  console.log(`📄 ${file}`);
  for (const h of hits) {
    total += 1;
    console.log(`  [${h.level}] ${h.what}`);
    console.log(`         建议：${h.fix}`);
  }
  console.log('');
}

console.log(`共发现 ${total} 处迁移项。`);
console.log(
  '提醒：体检只圈热点，真正确认要靠「rolldown-vite 隔离层 + 实跑构建对比产物」，详见本节文章。\n',
);
