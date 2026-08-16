// 模拟一个「UI 组件库」，会被 codeSplitting 规则拆进 vendor-ui chunk。
export function button(label) {
  return `<button class="btn">${label}</button>`;
}
export function card(title, body) {
  return `<div class="card"><h3>${title}</h3><div>${body}</div></div>`;
}
export function badge(text) {
  return `<span class="badge">${text}</span>`;
}
