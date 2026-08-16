// 武器四「产物验证」：对一个 dist/ 目录做客观对账，确认 AI 关于配置的说法是否真的生效。
// 检查项：① 产生了几个 JS chunk；② 是否做了 vendor 分离；③ 生产产物里是否残留 console；
//        ④ index.html 里的资源前缀（base）是否一致。
//
// 确定性来自「可观测的事实（文件 + 内容）」，不来自任何人或 AI 的断言。
//
// 用法：
//   node scripts/verify-build.mjs 示例产物          # demo 自带样本，直接可跑
//   node scripts/verify-build.mjs /你的项目/dist       # 先 vite build 再指向真实 dist

import fs from 'node:fs';
import path from 'node:path';

const distArg = process.argv[2] ?? '示例产物';
const distDir = path.resolve(distArg);

if (!fs.existsSync(distDir)) {
  console.error(`找不到产物目录: ${distDir}\n请先 vite build，或指向 demo 自带的「示例产物」。`);
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(distDir);
const jsFiles = files.filter((f) => f.endsWith('.js'));
const htmlFiles = files.filter((f) => f.endsWith('.html'));

const checks = [];

// ① chunk 数量
checks.push({
  name: 'JS chunk 数量',
  ok: jsFiles.length > 0,
  detail: `共 ${jsFiles.length} 个 .js（${jsFiles.map((f) => path.basename(f)).join(', ') || '无'}）`,
});

// ② vendor 分离：是否存在名字像第三方块的 chunk（vendor / react / vue 等）
const vendorChunk = jsFiles.find((f) => /vendor|react|vue|chunk-/i.test(path.basename(f)));
checks.push({
  name: 'vendor 分离',
  ok: Boolean(vendorChunk) && jsFiles.length > 1,
  detail: vendorChunk
    ? `检测到独立块: ${path.basename(vendorChunk)}`
    : '未发现独立 vendor 块（可能一锅端，或确实不需要分包）',
});

// ③ 生产产物是否残留 console（AI 常说「这样配会去掉 console」——这里对账）
const withConsole = jsFiles.filter((f) => /console\.(log|info|debug)\s*\(/.test(fs.readFileSync(f, 'utf8')));
checks.push({
  name: '生产去除 console',
  ok: withConsole.length === 0,
  detail:
    withConsole.length === 0
      ? '产物中未发现 console.log/info/debug'
      : `仍残留 console 的文件: ${withConsole.map((f) => path.basename(f)).join(', ')}`,
});

// ④ 资源前缀（base）一致性
let prefixDetail = '无 html，跳过';
let prefixOk = true;
if (htmlFiles.length) {
  const html = fs.readFileSync(htmlFiles[0], 'utf8');
  const srcs = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g)].map((m) => m[1]);
  const prefixes = new Set(srcs.map((s) => (s.match(/^(\.?\/[^/]*\/)/)?.[1] ?? '(相对)')));
  prefixOk = prefixes.size <= 1;
  prefixDetail = `引用资源前缀: ${[...prefixes].join(', ') || '(无)'}${prefixOk ? '（一致）' : '（不一致，疑似 base 配错）'}`;
}
checks.push({ name: '资源前缀一致(base)', ok: prefixOk, detail: prefixDetail });

console.log(`\n===== 产物对账: ${path.relative(process.cwd(), distDir)} =====\n`);
let failed = 0;
for (const c of checks) {
  const mark = c.ok ? '✅' : '❌';
  if (!c.ok) failed += 1;
  console.log(`${mark} ${c.name}`);
  console.log(`     ${c.detail}\n`);
}

if (failed > 0) {
  console.log(`有 ${failed} 项未通过——AI「说生效」的配置，产物里不一定真生效。去查根因。\n`);
  process.exit(2);
}
console.log('全部通过。但记住：通过的是「这几项检查」，不是「配置完美」——按需扩展检查项。\n');
