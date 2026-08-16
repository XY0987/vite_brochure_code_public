// 跑「ssr 环境」的构建产物：直接 import 并调用 render。
import { render } from '../dist/ssr/entry-server.js';

console.log('\n===== ssr 环境产物（Node 运行时）=====');
console.log(render('/about'));
