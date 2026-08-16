// 跨端共享的「组件」渲染函数：服务端用来出 HTML，客户端用来水合比对。

// ❌ 错误示范：直接用「当前时间」。服务端渲染算一次、客户端水合又算一次，
// 两次必然不同 → 经典「hydration mismatch」。
export function renderBuggyTime() {
  return `<span>渲染时刻（各算各的）：${new Date().toISOString()}</span>`;
}

// ✅ 正确示范：时间由服务端算好、随 state 下发，客户端复用同一份 → 服务端/客户端一致。
export function renderStableTime(state) {
  return `<span>渲染时刻（来自 state）：${state.renderedAt}</span>`;
}
