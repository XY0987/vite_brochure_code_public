// 边缘运行时实现：edge 环境通过 alias 解析到这里。
// 边缘运行时没有完整 Node API，只能用 Web 标准 API（这里用 Date 即可）。
export const runtime = 'edge (Web/Worker runtime)';
export const now = () => new Date().toISOString();
