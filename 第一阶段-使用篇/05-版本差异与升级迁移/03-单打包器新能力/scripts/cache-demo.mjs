// 观察「持久缓存」：Vite 的依赖预构建结果会落盘到 cacheDir（默认 node_modules/.vite/deps），
// 并按「lockfile + 配置」算一个哈希。只要哈希没变，下次启动直接复用磁盘缓存、跳过重新预构建——
// 这份缓存跨进程、跨 dev/build 持久存在。Vite 8 用单一 Rolldown 打包器后，dev 与 build
// 共用同一套缓存管线，这类持久缓存才好统一做。
//
// 正常开发中这一切由 `vite dev` 自动完成；这里用 `vite optimize` 显式触发，方便在脚本里观察。

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const depsDir = join(process.cwd(), 'node_modules', '.vite', 'deps');

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    return (e.stdout ?? '') + (e.stderr ?? '');
  }
}

console.log('\n=== 依赖预构建持久缓存观察 ===\n');

// 0. 清掉旧缓存，从干净状态开始
rmSync(join(process.cwd(), 'node_modules', '.vite'), { recursive: true, force: true });
console.log(`缓存目录：${depsDir}`);
console.log(`清理后是否存在：${existsSync(depsDir) ? '是' : '否'}\n`);

// 1. 第一次：强制预构建，生成缓存
console.log('① 首次预构建（vite optimize --force）：');
console.log(run('npx vite optimize --force').trim().split('\n').map((l) => '   ' + l).join('\n'));

if (existsSync(depsDir)) {
  console.log(`\n   → 缓存目录已生成，内含：${readdirSync(depsDir).join(', ')}`);
  const meta = JSON.parse(readFileSync(join(depsDir, '_metadata.json'), 'utf8'));
  console.log(`   → _metadata.json 里的缓存哈希：${meta.hash ?? meta.browserHash ?? '(见文件)'}`);
}

// 2. 第二次：不加 --force，哈希一致 → 命中缓存、跳过
console.log('\n② 再次预构建（vite optimize，不加 --force）：');
console.log(run('npx vite optimize').trim().split('\n').map((l) => '   ' + l).join('\n'));

console.log(
  '\n结论：第二次输出 “Hash is consistent. Skipping.” —— 命中了磁盘上的持久缓存，没有重新预构建。' +
    '\n这份缓存按 lockfile/配置哈希命中，跨进程、跨 dev/build 持久复用。\n',
);
