// 采集「喂给 AI 的项目上下文」：把 Node/包管理器/Vite 与插件的真实安装版本、
// 项目类型、现有配置摘要打成一段可直接粘贴到提问模板里的文本。
//
// 用法：
//   node scripts/collect-context.mjs            # 采集当前目录
//   node scripts/collect-context.mjs <项目路径>  # 采集指定项目
//
// 设计要点：读的是 node_modules 里的「真实安装版本」，而不是 package.json 里的
// "^8.1.0" 这种范围——AI 需要知道你「实际装了什么」，而不是你「希望装什么范围」。

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

// 读某个依赖在 node_modules 里的真实版本（顺着 projectDir 向上找 node_modules）。
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

function detectPackageManager() {
  if (fs.existsSync(path.join(projectDir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectDir, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectDir, 'package-lock.json'))) return 'npm';
  if (fs.existsSync(path.join(projectDir, 'bun.lockb'))) return 'bun';
  return '(未检测到 lockfile，无法确定)';
}

function detectConfigFile() {
  for (const name of ['vite.config.ts', 'vite.config.js', 'vite.config.mjs', 'vite.config.mts']) {
    const p = path.join(projectDir, name);
    if (fs.existsSync(p)) return { name, content: fs.readFileSync(p, 'utf8') };
  }
  return null;
}

// 从依赖列表里推断项目类型，给 AI 一个「这是什么项目」的快速画像。
function detectProjectType(allDeps) {
  const has = (d) => Object.prototype.hasOwnProperty.call(allDeps, d);
  const frameworks = [];
  if (has('react') || has('@vitejs/plugin-react') || has('@vitejs/plugin-react-oxc')) frameworks.push('React');
  if (has('vue')) frameworks.push('Vue');
  if (has('svelte')) frameworks.push('Svelte');
  if (has('solid-js')) frameworks.push('Solid');
  const flags = [];
  if (has('vitest')) flags.push('含 Vitest 测试');
  if (has('@module-federation/vite')) flags.push('用到模块联邦');
  const isMonorepo =
    fs.existsSync(path.join(projectDir, 'pnpm-workspace.yaml')) ||
    Array.isArray(readJSON(path.join(projectDir, 'package.json'))?.workspaces);
  if (isMonorepo) flags.push('monorepo / workspace');
  return {
    framework: frameworks.length ? frameworks.join(' + ') : '(未检测到主流框架)',
    flags,
  };
}

const pkg = readJSON(path.join(projectDir, 'package.json'));
const allDeps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };

// 关注一批和 Vite 配置强相关的依赖，逐个读真实版本。
const watched = [
  'vite',
  '@vitejs/plugin-react',
  '@vitejs/plugin-react-oxc',
  '@vitejs/plugin-vue',
  '@sveltejs/vite-plugin-svelte',
  'vitest',
  'rolldown',
  'rollup',
];

const { framework, flags } = detectProjectType(allDeps);
const cfg = detectConfigFile();

const lines = [];
lines.push('===== 可粘贴给 AI 的项目上下文块 =====');
lines.push('');
lines.push('【环境与版本】');
lines.push(`- OS: ${os.platform()} ${os.release()} (${os.arch()})`);
lines.push(`- Node: ${process.version}`);
lines.push(`- 包管理器: ${detectPackageManager()}`);
lines.push(`- 项目类型: ${framework}${flags.length ? '（' + flags.join('、') + '）' : ''}`);
lines.push('- 关键依赖实际安装版本：');
for (const dep of watched) {
  if (dep in allDeps || installedVersion(dep)) {
    const declared = allDeps[dep] ?? '(未在 package.json 声明)';
    const installed = installedVersion(dep) ?? '(未安装)';
    lines.push(`    · ${dep}: 安装 ${installed}（声明 ${declared}）`);
  }
}
lines.push('');
lines.push('【现有配置】');
if (cfg) {
  lines.push(`文件: ${cfg.name}`);
  lines.push('```js');
  lines.push(cfg.content.trimEnd());
  lines.push('```');
} else {
  lines.push('(未找到 vite.config.*，可能是新项目)');
}
lines.push('');
lines.push('【提示】把上面整块粘进提问模板，再补「目标」「约束」两段（见本 demo README）。');
lines.push('记得在【约束】里明确：必须用 Vite 8 官方推荐 API，旧写法请改新名并标注。');

console.log('\n' + lines.join('\n') + '\n');
