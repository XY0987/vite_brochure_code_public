// 武器一「最小复现」：生成一个可追溯的最小复现骨架，含一份「每一步改动」清单模板，
// 让你把「逐步加依赖直到问题出现」的过程记录下来——这既是定位根因的方法，
// 也是给 AI / 同事的最佳输入（见 02 节）。
//
// 用法：
//   node scripts/new-min-repro.mjs <问题简述>
// 例：
//   node scripts/new-min-repro.mjs 预构建报错-某CJS包具名导入失败

import fs from 'node:fs';
import path from 'node:path';

const title = process.argv.slice(2).join(' ').trim() || '未命名问题';
const stamp = new Date().toISOString().slice(0, 10);
const safe = title.replace(/[\\/:*?"<>|\s]+/g, '-').slice(0, 40);
const dir = path.resolve(process.cwd(), 'min-repro', `${stamp}-${safe}`);

fs.mkdirSync(dir, { recursive: true });

const steps = `# 最小复现记录：${title}

> 目的：把问题剥到最小，逐步加依赖/代码，定位「问题出现的那一步 = 根因」。
> 生成时间：${stamp}

## 环境（先填，给 AI 用）
- OS / Node / 包管理器 / Vite 实际版本：
  （可跑 ../../../02-报错复现与诊断采集/scripts/collect-diagnostics.mjs 采集）

## 复现步骤（每加一样就跑一次，记录结果）
| # | 这一步做了什么 | 跑了什么命令 | 结果（正常 / 报错）|
|---|---|---|---|
| 1 | npm create vite@latest（锁 Vite 8）、最小启动 | npm run dev | 正常 |
| 2 | 加入触发问题的依赖 X@版本 | npm run build | <填> |
| 3 | … | … | … |

## 结论
- 问题在第 __ 步出现 → 根因指向：________
- 已用什么事实确认（官方文档 / 断点 / 产物对账）：________

## 给 AI 的 SCROL（定位到根因后再问「怎么修最稳」）
（粘 02 节生成的 SCROL 骨架）
`;

fs.writeFileSync(path.join(dir, 'STEPS.md'), steps, 'utf8');
fs.writeFileSync(
  path.join(dir, 'README.md'),
  `# ${title}\n\n这是一个最小复现骨架目录。请在此 \`npm create vite@latest\` 起干净项目，\n按 STEPS.md 逐步加依赖直到问题出现。复现成功后，整个目录可压缩发给 AI / 同事。\n`,
  'utf8',
);

console.log(`\n✅ 已生成最小复现骨架：\n   ${path.relative(process.cwd(), dir)}/`);
console.log('   ├─ README.md   说明怎么用');
console.log('   └─ STEPS.md    逐步改动清单（边复现边填）\n');
console.log('下一步：进该目录起一个干净的 Vite 8 项目，按 STEPS.md 一步步加料，找到「问题出现的那一步」。\n');
