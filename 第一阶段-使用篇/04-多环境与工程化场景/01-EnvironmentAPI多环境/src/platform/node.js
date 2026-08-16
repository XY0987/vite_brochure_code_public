// Node.js 运行时实现：ssr 环境通过 alias 解析到这里。
// 这里可以放心用 Node 专有 API（如 process），因为只会被打进 ssr 包。
export const runtime = `node ${process.version}`;
export const now = () => new Date().toISOString();
