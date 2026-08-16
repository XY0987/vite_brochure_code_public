#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const targets = [
  ['01 config', '第一阶段-使用篇/01-核心使用/02-项目搭建与配置详解', 'build'],
  ['01 performance', '第一阶段-使用篇/01-核心使用/08-性能优化与产物分析', 'build'],
  ['02 react', '第一阶段-使用篇/02-框架集成与测试/02-React接入', 'build'],
  ['02 vitest', '第一阶段-使用篇/02-框架集成与测试/04-Vitest测试', 'test:run'],
  ['03 plugin', '第一阶段-使用篇/03-插件与生态/01-插件开发', 'build'],
  ['04 environment', '第一阶段-使用篇/04-多环境与工程化场景/01-EnvironmentAPI多环境', 'show'],
  ['05 config migration', '第一阶段-使用篇/05-版本差异与升级迁移/02-配置迁移对照', 'compare'],
  ['07 verify toolkit', '第一阶段-使用篇/07-AI辅助Vite开发/04-校验工具箱', 'verify'],
];

const shouldInstall = process.argv.includes('--install');
const dryRun = process.argv.includes('--dry-run');

function assertNodeVersion() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  const ok = (major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major > 22;
  if (!ok) {
    console.error(`Node ${process.versions.node} is too old for Vite 8 demos.`);
    console.error('Please use Node >= 20.19 or >= 22.12.');
    process.exit(1);
  }
}

function readPackageJson(dir) {
  const file = join(dir, 'package.json');
  if (!existsSync(file)) throw new Error(`missing package.json: ${relative(repoRoot, file)}`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

function run(command, args, cwd) {
  console.log(`\n$ ${command} ${args.join(' ')}  # ${relative(repoRoot, cwd)}`);
  if (dryRun) return;
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('First-stage smoke check');
console.log(`Repo: ${repoRoot}`);
console.log(`Mode: ${dryRun ? 'dry-run' : shouldInstall ? 'install + run' : 'run only'}\n`);
assertNodeVersion();

for (const [name, relDir, script] of targets) {
  const dir = join(repoRoot, relDir);
  const pkg = readPackageJson(dir);
  if (!pkg.scripts?.[script]) {
    throw new Error(`${name}: missing script "${script}" in ${relative(repoRoot, join(dir, 'package.json'))}`);
  }

  console.log(`=== ${name}: npm run ${script} ===`);
  if (shouldInstall) run('npm', ['install'], dir);
  run('npm', ['run', script], dir);
}

console.log('\nSmoke check finished.');
