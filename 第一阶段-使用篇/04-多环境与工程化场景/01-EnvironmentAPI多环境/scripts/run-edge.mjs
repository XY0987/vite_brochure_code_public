// 跑「edge 环境」的构建产物：用 Web 标准 Request/Response 模拟一次边缘请求。
// Node 20.19+ / 22.12+ 内置全局 Request/Response，无需任何依赖。
import handler from '../dist/edge/entry-edge.js';

const res = await handler.fetch(new Request('http://localhost/edge-path'));
console.log('\n===== edge 环境产物（Web/Worker 运行时）=====');
console.log(await res.text());
