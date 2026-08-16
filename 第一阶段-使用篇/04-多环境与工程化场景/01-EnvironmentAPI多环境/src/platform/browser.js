// 浏览器运行时实现：client 环境通过 alias 解析到这里。
export const runtime = 'browser';
export const now = () => new Date().toLocaleTimeString();
