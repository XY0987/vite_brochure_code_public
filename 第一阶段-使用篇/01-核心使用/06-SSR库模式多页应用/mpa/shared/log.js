// 被多个页面共用的模块，build 时会被提取成共享 chunk。
export function banner(page) {
  return `当前页面：${page}（共享模块 log.js 已加载）`;
}
