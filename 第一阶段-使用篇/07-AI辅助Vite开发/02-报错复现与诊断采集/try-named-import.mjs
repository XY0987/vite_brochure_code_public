// 从 ESM 里对一个「动态导出的 CJS 包」做具名导入。
// 这一行会在模块求值期抛错：SyntaxError: does not provide an export named 'foo'。
// reproduce.mjs 用 dynamic import 把它包起来，好捕获并打印这个错误。
import { foo } from './bad-cjs-pkg/index.cjs';

console.log(foo());
