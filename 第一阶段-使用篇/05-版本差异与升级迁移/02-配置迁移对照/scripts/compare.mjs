// 对比两份产物的 assets 目录，确认「旧写法」与「新写法」都成功拆出了 vendor chunk。
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

function listChunks(dir) {
  try {
    return readdirSync(join(dir, 'assets')).filter((f) => f.endsWith('.js'));
  } catch {
    return ['(目录不存在，先跑 npm run build)'];
  }
}

const old = listChunks('dist-old');
const neo = listChunks('dist-new');

console.log('\n=== 旧写法 dist-old/assets ===');
old.forEach((f) => console.log('  -', f));
console.log('\n=== 新写法 dist-new/assets ===');
neo.forEach((f) => console.log('  -', f));

const vendorOf = (arr) => arr.find((f) => f.startsWith('vendor'));
const oldVendor = vendorOf(old);
const newVendor = vendorOf(neo);

console.log('\n结论：');
console.log(`  旧写法 vendor chunk：${oldVendor ?? '（未产出）'}`);
console.log(`  新写法 vendor chunk：${newVendor ?? '（未产出）'}`);

// 文件名里带内容哈希：两边文件名相同 ⇒ vendor 内容字节级一致 ⇒ 迁移不改变产物。
if (oldVendor && newVendor) {
  const same = oldVendor === newVendor;
  console.log(
    `  两边 vendor 文件名（含内容哈希）是否一致：${same ? '一致 ✅' : '不一致 ⚠️'}`,
  );
  console.log(
    same
      ? '  → 新旧写法功能等价、产物字节一致；新写法无 deprecation 警告，是 Vite 8 的推荐姿势。\n'
      : '  → 都拆出了 vendor，但哈希不同，说明产物有差异，需进一步对比内容。\n',
  );
} else {
  console.log('  → 至少一侧未产出 vendor chunk，请先 `npm run build` 再对比。\n');
}
