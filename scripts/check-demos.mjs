#!/usr/bin/env node

// 结构性体检：遍历第一阶段所有 demo 的 package.json，
// 校验「能解析 + 有 scripts + Vite 版本符合基线」，用来抓住文稿/代码漂移、
// 防止「文章说有 demo、实际跑不起来」。它只做静态检查，不安装、不构建、不联网。

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stageRoot = join(repoRoot, '第一阶段-使用篇');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.vite']);

function findPackageJsons(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    if (existsSync(join(full, 'package.json'))) acc.push(full);
    findPackageJsons(full, acc);
  }
  return acc;
}

// 内部/嵌套包：从 stageRoot 到该目录之间，存在另一个带 package.json 的祖先目录。
// 典型是 monorepo 的 packages/ui 这类「被依赖的库包」，本就不需要 scripts。
function isNestedPackage(dir) {
  let cur = dirname(dir);
  while (cur.startsWith(stageRoot) && cur !== stageRoot) {
    if (existsSync(join(cur, 'package.json'))) return true;
    cur = dirname(cur);
  }
  return false;
}

function viteVersionOf(pkg) {
  const dep =
    pkg.devDependencies?.vite ?? pkg.dependencies?.vite ?? pkg.peerDependencies?.vite;
  return dep ?? null;
}

// 只要声明里明确「不支持 Vite 8」就算可疑（纯 ^5/^6/^7 且不含 8）。
function looksOutdated(range) {
  if (!range || typeof range !== 'string') return false;
  if (range.includes('8')) return false; // 含 8（如 ^8.1.0 或 兼容范围 ... || ^8.0.0）
  return /[567]/.test(range);
}

console.log('Demo 结构体检（静态，不安装/不构建）');
console.log(`Root: ${relative(process.cwd(), stageRoot) || '.'}\n`);

if (!existsSync(stageRoot)) {
  console.error(`找不到目录：${stageRoot}`);
  process.exit(1);
}

const pkgDirs = findPackageJsons(stageRoot).sort();
const errors = [];
const warnings = [];
let withScripts = 0;

for (const dir of pkgDirs) {
  const rel = relative(repoRoot, dir);
  const file = join(dir, 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${rel}: package.json 无法解析（${e.message}）`);
    continue;
  }

  const scripts = pkg.scripts ?? {};
  if (Object.keys(scripts).length === 0) {
    if (isNestedPackage(dir)) {
      warnings.push(`${rel}: 无 scripts（内部/被依赖包，正常，跳过）`);
    } else {
      errors.push(`${rel}: 顶层 demo 缺少可运行 scripts`);
    }
  } else {
    withScripts += 1;
  }

  const viteRange = viteVersionOf(pkg);
  if (viteRange && looksOutdated(viteRange)) {
    warnings.push(`${rel}: vite 版本范围 "${viteRange}" 未覆盖 Vite 8 基线`);
  }
}

console.log(`扫描到 ${pkgDirs.length} 个含 package.json 的 demo，其中 ${withScripts} 个有可运行 scripts。`);

if (warnings.length) {
  console.log(`\n⚠️  版本提示（${warnings.length}）：`);
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.error(`\n❌ 发现 ${errors.length} 个问题：`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('\n✅ 所有 demo 的 package.json 均有效且含可运行脚本。');
