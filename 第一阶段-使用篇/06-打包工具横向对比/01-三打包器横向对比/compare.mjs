// 三打包器横向对比：同一份 src/index.js，分别用 esbuild / Rolldown / Rollup 打包，
// 打印「耗时 / 产物总大小 / chunk 数」，并检查 tree-shaking 是否都干掉了未使用的 subtract。
import { rm, mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTRY = join(__dirname, 'src/index.js');

async function dirStats(dir) {
  let bytes = 0;
  let chunks = 0;
  let hasSubtract = false;
  for (const name of await readdir(dir)) {
    const file = join(dir, name);
    if (!(await stat(file)).isFile()) continue;
    if (!name.endsWith('.js') && !name.endsWith('.mjs')) continue;
    chunks++;
    const code = await readFile(file, 'utf8');
    bytes += Buffer.byteLength(code);
    if (code.includes('subtract')) hasSubtract = true;
  }
  return { bytes, chunks, hasSubtract };
}

async function timeit(fn) {
  const start = performance.now();
  await fn();
  return performance.now() - start;
}

async function runEsbuild(outDir) {
  const { build } = await import('esbuild');
  return timeit(() =>
    build({
      entryPoints: [ENTRY],
      bundle: true,
      format: 'esm',
      outfile: join(outDir, 'bundle.js'),
      logLevel: 'silent',
    }),
  );
}

async function runRolldown(outDir) {
  const { rolldown } = await import('rolldown');
  return timeit(async () => {
    const bundle = await rolldown({ input: ENTRY, logLevel: 'silent' });
    await bundle.write({ dir: outDir, format: 'esm' });
    await bundle.close();
  });
}

async function runRollup(outDir) {
  const { rollup } = await import('rollup');
  return timeit(async () => {
    const bundle = await rollup({ input: ENTRY, logLevel: 'silent' });
    await bundle.write({ dir: outDir, format: 'esm' });
    await bundle.close();
  });
}

const tools = [
  { name: 'esbuild', run: runEsbuild },
  { name: 'rolldown', run: runRolldown },
  { name: 'rollup', run: runRollup },
];

const rows = [];
for (const tool of tools) {
  const outDir = join(__dirname, `dist-${tool.name}`);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  // 先跑一次「热身」并丢弃：抵消首次启动开销（尤其 esbuild 要拉起常驻服务进程），
  // 否则首测会把「进程启动时间」算进去，对比不公平。
  await tool.run(outDir);
  // 再连测三次取最快值，反映稳定状态下的打包速度。
  let best = Infinity;
  for (let i = 0; i < 3; i++) {
    best = Math.min(best, await tool.run(outDir));
  }
  const { bytes, chunks, hasSubtract } = await dirStats(outDir);
  rows.push({ name: tool.name, ms: best, bytes, chunks, hasSubtract });
}

const pad = (s, n) => String(s).padEnd(n);
console.log('\n同一份 src，三个打包器各打一遍：\n');
console.log(pad('工具', 12) + pad('耗时(ms)', 12) + pad('产物(B)', 12) + pad('chunk 数', 10) + 'tree-shaking');
console.log('-'.repeat(58));
for (const r of rows) {
  console.log(
    pad(r.name, 12) +
      pad(r.ms.toFixed(1), 12) +
      pad(r.bytes, 12) +
      pad(r.chunks, 10) +
      (r.hasSubtract ? '❌ 残留 subtract' : '✅ 已摇掉 subtract'),
  );
}
console.log(
  '\n读法：这种小 demo 上 esbuild / Rolldown（原生实现）都很快、Rollup（纯 JS）通常最慢，' +
    '三者的快慢顺序会因机器、缓存与输入规模而异；项目越大，原生实现相对 Rollup 的优势越明显。三者都应摇掉未使用的 subtract。',
);
console.log('产物目录分别在 dist-esbuild / dist-rolldown / dist-rollup，可自行打开对比代码风格。\n');
