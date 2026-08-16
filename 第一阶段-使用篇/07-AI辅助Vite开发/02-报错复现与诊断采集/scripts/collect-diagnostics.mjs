// 一键生成 SCROL 提问里的诊断信息块（Overview + 模板骨架），
// 你只要把报错栈（Stack）和已试列表（List）补进去就是一条完整的有效提问。
//
// 用法：
//   node scripts/collect-diagnostics.mjs            # 采集当前目录
//   node scripts/collect-diagnostics.mjs <项目路径>

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const projectDir = path.resolve(process.argv[2] ?? process.cwd());

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function installedVersion(dep) {
  let dir = projectDir;
  while (true) {
    const pkg = readJSON(path.join(dir, 'node_modules', dep, 'package.json'));
    if (pkg?.version) return pkg.version;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function packageManager() {
  if (fs.existsSync(path.join(projectDir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectDir, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectDir, 'package-lock.json'))) return 'npm';
  return '(未检测到 lockfile)';
}

const pkg = readJSON(path.join(projectDir, 'package.json'));
const allDeps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };

const out = [];
out.push('===== SCROL 提问骨架（补全 Stack / List 即可发给 AI） =====');
out.push('');
out.push('我的 Vite 项目报错了，请帮我定位根因（先判断最可能的原因和如何确认，不要直接给修法）。');
out.push('');
out.push('【触发命令与阶段 Command】');
out.push('- 命令: <例如 pnpm build>');
out.push('- 阶段: <dev / build / preview / test>，<client / SSR / edge>');
out.push('');
out.push('【环境总览 Overview】（脚本已自动填好）');
out.push(`- OS: ${os.platform()} ${os.release()} (${os.arch()})`);
out.push(`- Node: ${process.version}`);
out.push(`- 包管理器: ${packageManager()}`);
out.push(`- vite: ${installedVersion('vite') ?? '(未安装)'}（实际安装版本）`);
const others = ['@vitejs/plugin-react', '@vitejs/plugin-react-oxc', '@vitejs/plugin-vue', 'vitest', 'rolldown'].filter(
  (d) => d in allDeps || installedVersion(d),
);
if (others.length) {
  out.push('- 相关依赖:');
  for (const d of others) out.push(`    · ${d}: ${installedVersion(d) ?? '(未安装)'}`);
}
out.push('');
out.push('【完整报错栈 Stack】（粘完整、不截断，含 Plugin/File 字段）');
out.push('```');
out.push('<在这里粘报错。可先跑 node scripts/reproduce.mjs 拿一个真实报错练手>');
out.push('```');
out.push('');
out.push('【最小复现 Reproduce】');
out.push('- 能否稳定复现: <必现 / 偶发>');
out.push('- 触发点: <例如 升级某依赖后开始>');
out.push('');
out.push('【我已经试过 List】');
out.push('1. <试过什么 —— 结果>');
out.push('2. <试过什么 —— 结果>');
out.push('');
out.push('请基于以上：① 给最可能的 1-2 个根因；② 各给「如何确认是它」的验证步骤；③ 确认后再给修法。');

console.log('\n' + out.join('\n') + '\n');
