// Oxc 工具链演示：转译（TS+JSX → JS）+ 压缩。
// 重点体会：Oxc 输入「一个文件」、输出「一个文件」，全程没有「打包/模块图」概念——
// 这就是「工具链 ≠ 打包器」。它是给打包器（如 Rolldown）当零件用的。
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { transform } from 'oxc-transform';
import { minify } from 'oxc-minify';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = join(__dirname, 'src/widget.tsx');
const source = await readFile(srcPath, 'utf8');

// ① 转译：去掉 TS 类型、把 JSX 转成 React.createElement（classic 运行时，便于直观阅读）
const transformed = await transform('widget.tsx', source, {
  jsx: { runtime: 'classic' },
});

if (transformed.errors.length) {
  console.error('转译报错：', transformed.errors);
  process.exit(1);
}

// ② 压缩：把转译后的 JS 压小
const minified = await minify('widget.js', transformed.code);

await writeFile(join(__dirname, 'out.transformed.js'), transformed.code);
await writeFile(join(__dirname, 'out.min.js'), minified.code);

const B = (s) => Buffer.byteLength(s);

console.log('\n===== ① 原始 TS+JSX 源码 =====\n');
console.log(source.trim());

console.log('\n===== ② Oxc 转译后（类型没了、JSX 变成函数调用）=====\n');
console.log(transformed.code.trim());

console.log('\n===== ③ Oxc 压缩后 =====\n');
console.log(minified.code.trim());

console.log('\n===== 体积对比 =====');
console.log(`源码        : ${B(source)} B`);
console.log(`转译后      : ${B(transformed.code)} B`);
console.log(`压缩后      : ${B(minified.code)} B`);
console.log('\n注意：全程没有「打包」——没有解析 import 把多个文件合并。');
console.log('Oxc 只对「单个文件」做转译/压缩，这正是「工具链」的特征。\n');
