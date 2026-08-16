// 一段操作 DOM 的代码，用来演示 jsdom 测试环境
export function createBadge(text: string): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = 'badge';
  el.textContent = text;
  return el;
}
